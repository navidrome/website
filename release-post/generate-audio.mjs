#!/usr/bin/env node
// Records narration.txt of a release post bundle as narration.mp3, and writes audio.json.
// assets.mjs then uploads the MP3 and adds its URL to audio.json.
//
// Usage:
//   node release-post/generate-audio.mjs <bundle-dir>           record if narration.txt changed
//   node release-post/generate-audio.mjs <bundle-dir> --force   always record
//   node release-post/generate-audio.mjs <bundle-dir> --check   exit 1 if the audio is missing or stale
//
// Engines (RELEASE_POST_TTS_ENGINE):
//   realtime  gpt-realtime-2.1-mini over the Realtime API WebSocket (default). OpenAI names it as
//             the replacement for the TTS models.
//   speech    POST /v1/audio/speech with gpt-4o-mini-tts. OpenAI shuts these models down on
//             2027-01-06. Kept as a fallback until then.
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { RELEASE_ASSET_URL, REPO_ROOT, apiBase, chunkText, env, narrationHash, recordUsage, requireKey, wordSimilarity } from "./lib.mjs";

const SAMPLE_RATE = 24000; // Both engines return 16-bit mono PCM at 24 kHz.
const BYTES_PER_SECOND = SAMPLE_RATE * 2;
const PAUSE = Buffer.alloc(Math.round(BYTES_PER_SECOND * 0.6)); // Silence between chunks.
const MIN_SIMILARITY = 0.9;
const MAX_ATTEMPTS = 3;

const VOICE_INSTRUCTIONS =
  "You are the narrator of a blog post for Navidrome, an open source music server. " +
  "Read the text you are given aloud, exactly as written, word for word. " +
  "Do not add, skip, reorder or change any words. Do not greet, answer, comment or ask questions. " +
  "Speak in a warm, clear and relaxed voice, at a natural pace, like a short podcast update.";

export function readState(dir) {
  const narrationFile = path.join(dir, "narration.txt");
  if (!existsSync(narrationFile)) throw new Error(`${narrationFile} does not exist`);
  const narration = readFileSync(narrationFile, "utf8");
  const metaFile = path.join(dir, "audio.json");
  const meta = existsSync(metaFile) ? JSON.parse(readFileSync(metaFile, "utf8")) : null;
  const hash = narrationHash(narration);
  // The audio is either uploaded (a URL in audio.json) or recorded and not uploaded yet.
  const recorded = RELEASE_ASSET_URL.test(meta?.url ?? "") || existsSync(path.join(dir, "narration.mp3"));
  const fresh = Boolean(meta && meta.narration_sha256 === hash && recorded);
  return { narration, hash, meta, fresh };
}

// One Realtime API session per chunk, so earlier chunks cannot steer later ones.
export function realtimeChunk({ text, model, voice, apiKey, connect, timeoutMs = 180_000 }) {
  const base = apiBase().replace(/^http/, "ws");
  const ws = connect(`${base}/realtime?model=${encodeURIComponent(model)}`, { Authorization: `Bearer ${apiKey}` });
  return new Promise((resolve, reject) => {
    const audio = [];
    let transcript = "";
    let done = false;
    const finish = (err, value) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      try {
        ws.close();
      } catch {}
      if (err) reject(err);
      else resolve(value);
    };
    const timer = setTimeout(() => finish(new Error("Realtime API timed out")), timeoutMs);
    const send = (event) => ws.send(JSON.stringify(event));

    ws.onopen = () => {
      send({
        type: "session.update",
        session: {
          type: "realtime",
          model,
          output_modalities: ["audio"],
          instructions: VOICE_INSTRUCTIONS,
          audio: {
            input: { turn_detection: null },
            output: { format: { type: "audio/pcm", rate: SAMPLE_RATE }, voice },
          },
        },
      });
    };
    ws.onerror = (e) => finish(new Error(`Realtime WebSocket error: ${e?.message ?? e?.type ?? "unknown"}`));
    ws.onclose = (e) => finish(new Error(`Realtime WebSocket closed early (code ${e?.code})`));
    ws.onmessage = (msg) => {
      let event;
      try {
        event = JSON.parse(typeof msg.data === "string" ? msg.data : Buffer.from(msg.data).toString());
      } catch {
        return;
      }
      switch (event.type) {
        case "error":
          finish(new Error(`Realtime API error: ${event.error?.message ?? JSON.stringify(event.error)}`));
          break;
        case "session.updated":
          send({
            type: "conversation.item.create",
            item: { type: "message", role: "user", content: [{ type: "input_text", text }] },
          });
          send({ type: "response.create" });
          break;
        case "response.output_audio.delta":
          audio.push(Buffer.from(event.delta, "base64"));
          break;
        case "response.output_audio_transcript.delta":
          transcript += event.delta ?? "";
          break;
        case "response.output_audio_transcript.done":
          if (event.transcript) transcript = event.transcript;
          break;
        case "response.done": {
          const r = event.response ?? {};
          if (r.status && r.status !== "completed") {
            // A failed take is still billed, so its usage goes with the error.
            const err = new Error(`Realtime response ${r.status}: ${JSON.stringify(r.status_details ?? {})}`);
            err.usage = r.usage;
            finish(err);
          } else {
            finish(null, { pcm: Buffer.concat(audio), transcript, usage: r.usage });
          }
          break;
        }
      }
    };
  });
}

async function speechChunk({ text, model, voice, apiKey }) {
  const res = await fetch(`${apiBase()}/audio/speech`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model, voice, input: text, instructions: VOICE_INSTRUCTIONS, response_format: "pcm" }),
  });
  if (!res.ok) throw new Error(`Speech API returned ${res.status}: ${await res.text()}`);
  return { pcm: Buffer.from(await res.arrayBuffer()), transcript: null, usage: null };
}

export async function synthesize(narration, opts = {}) {
  const engine = opts.engine ?? env("RELEASE_POST_TTS_ENGINE", "realtime");
  const model = opts.model ?? env("RELEASE_POST_TTS_MODEL", engine === "speech" ? "gpt-4o-mini-tts" : "gpt-realtime-2.1-mini");
  const voice = opts.voice ?? env("RELEASE_POST_VOICE", "marin");
  const apiKey = opts.apiKey ?? requireKey();
  const connect = opts.connect ?? ((url, headers) => new WebSocket(url, { headers }));
  if (!["realtime", "speech"].includes(engine)) throw new Error(`Unknown RELEASE_POST_TTS_ENGINE: ${engine}`);

  // The speech endpoint takes at most 2000 tokens, instructions included.
  const chunks = chunkText(narration, engine === "speech" ? 1500 : 2500);
  const parts = [];
  const similarities = [];
  for (const [i, text] of chunks.entries()) {
    // Up to 3 tries per chunk, for an error or for a voice that did not follow the script.
    // Keeps the closest take.
    let best = null;
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      let result;
      try {
        result =
          engine === "speech"
            ? await speechChunk({ text, model, voice, apiKey })
            : await realtimeChunk({ text, model, voice, apiKey, connect });
        if (!result.pcm.length) throw new Error("no audio returned");
      } catch (e) {
        if (e.usage) recordUsage({ step: `audio ${i + 1}/${chunks.length} (failed)`, model, usage: e.usage, characters: text.length });
        if (attempt === MAX_ATTEMPTS && !best) throw new Error(`Chunk ${i + 1}: ${e.message}`);
        console.warn(`Chunk ${i + 1}, attempt ${attempt}: ${e.message}`);
        continue;
      } finally {
        if (result) recordUsage({ step: `audio ${i + 1}/${chunks.length}`, model, usage: result.usage, characters: text.length });
      }
      if (result.transcript === null) {
        best = { result, sim: null };
        break;
      }
      const sim = wordSimilarity(text, result.transcript);
      if (!best || sim > best.sim) best = { result, sim };
      if (sim >= MIN_SIMILARITY) break;
      console.warn(`Chunk ${i + 1}, attempt ${attempt}: similarity ${sim.toFixed(2)}`);
    }
    const { result, sim } = best;
    if (sim !== null) {
      if (sim < MIN_SIMILARITY) console.warn(`Chunk ${i + 1}: the voice did not follow the script (best similarity ${sim.toFixed(2)})`);
      similarities.push(Number(sim.toFixed(3)));
    }
    if (parts.length) parts.push(PAUSE);
    parts.push(result.pcm);
  }
  return { pcm: Buffer.concat(parts), engine, model, voice, chunks: chunks.length, similarities };
}

export function encodeMp3(pcm, outFile, title) {
  const tmp = mkdtempSync(path.join(tmpdir(), "release-audio-"));
  try {
    const raw = path.join(tmp, "audio.pcm");
    writeFileSync(raw, pcm);
    execFileSync(
      "ffmpeg",
      ["-loglevel", "error", "-y", "-f", "s16le", "-ar", String(SAMPLE_RATE), "-ac", "1", "-i", raw,
        "-codec:a", "libmp3lame", "-b:a", "64k", "-metadata", `title=${title}`, "-metadata", "artist=Navidrome", outFile],
      { stdio: "inherit" },
    );
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

async function main() {
  const args = process.argv.slice(2);
  const dirArg = args.find((a) => !a.startsWith("--"));
  if (!dirArg) throw new Error("Usage: generate-audio.mjs <bundle-dir> [--force|--check]");
  const dir = path.resolve(REPO_ROOT, dirArg);
  const state = readState(dir);

  if (args.includes("--check")) {
    if (state.fresh) {
      console.log("Audio is up to date.");
      return;
    }
    console.error("Audio is missing or does not match narration.txt.");
    process.exit(1);
  }
  if (state.fresh && !args.includes("--force")) {
    console.log("narration.txt did not change. Keeping the current audio.");
    return;
  }

  const result = await synthesize(state.narration);
  const title = path.basename(dir);
  encodeMp3(result.pcm, path.join(dir, "narration.mp3"), `Navidrome ${title}`);
  const meta = {
    narration_sha256: state.hash,
    engine: result.engine,
    model: result.model,
    voice: result.voice,
    duration_seconds: Math.round(result.pcm.length / BYTES_PER_SECOND),
    chunks: result.chunks,
    transcript_similarity: result.similarities,
    generated_at: new Date().toISOString(),
  };
  writeFileSync(path.join(dir, "audio.json"), `${JSON.stringify(meta, null, 2)}\n`);
  console.log(`Wrote narration.mp3 (${meta.duration_seconds}s).`);
  const low = result.similarities.filter((s) => s < MIN_SIMILARITY);
  if (low.length && process.env.RELEASE_POST_WARNINGS_FILE) {
    writeFileSync(
      process.env.RELEASE_POST_WARNINGS_FILE,
      `- The voice may not follow the script in ${low.length} part(s) (similarity ${low.join(", ")}). Listen before you approve.\n`,
      { flag: "a" },
    );
  }
}

// import.meta.main also works when the path has spaces or symlinks.
if (import.meta.main) {
  main().catch((e) => {
    console.error(e.message);
    process.exit(1);
  });
}
