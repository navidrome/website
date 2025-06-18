---
title: Statistics
menu:
  main:
    weight: 40
---

{{% blocks/section color="white" %}}

<div>
    <script src="https://cdn.jsdelivr.net/npm/vega@5"></script>
    <script src="https://cdn.jsdelivr.net/npm/vega-lite@5"></script>
    <script src="https://cdn.jsdelivr.net/npm/vega-embed@6"></script>
<div style="text-align: center; width: 100%;">
<h1>Navidrome Statistics</h1>
  <div id="vis1" style="margin: 20px auto;  width: 100%"></div>
  <br>
  <div id="vis2" style="margin: 20px auto; width: 100%"></div>
  <br>
  <div id="vis3" style="margin: 20px auto; width: 100%"></div>
  <br>
  <div id="vis4" style="margin: 20px auto; width: 100%"></div>
  <br>
  <div id="vis5" style="margin: 20px auto; width: 100%"></div>
  <br>
</div>
<script type="module">
  import vegaEmbed from "https://cdn.jsdelivr.net/npm/vega-embed@6/+esm";
  function pageIsDark() {
    const root = document.documentElement;
    const m = root.getAttribute('data-bs-theme');      // light | dark | auto
    if (m === 'dark')  return true;
    if (m === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  const specMap = {
    vis1: '/charts/numInstance.json',
    vis2: '/charts/osPie.json',
    vis3: '/charts/musicFsPie.json',
    vis4: '/charts/dataFsPie.json',
    vis5: '/charts/playerTypePie.json',
  };
  const specs = Object.fromEntries(
    await Promise.all(
      Object.entries(specMap).map(async ([id, url]) => [id, await fetch(url).then(r => r.json())])
    )
  );
  let views = {};
  function renderCharts() {
    const theme = pageIsDark() ? 'dark' : 'default';
    for (const v of Object.values(views)) v.finalize?.();
    views = {};
    for (const [id, spec] of Object.entries(specs)) {
      vegaEmbed(`#${id}`, spec, { theme }).then(({ view }) => (views[id] = view));
    }
  }
  renderCharts();
  new MutationObserver((m) => {
    if (m.some(({ attributeName }) => attributeName === 'data-bs-theme')) renderCharts();
  }).observe(document.documentElement, { attributes: true });
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  mq.addEventListener('change', () => {
    if (document.documentElement.getAttribute('data-bs-theme') === 'auto') renderCharts();
  });
</script>


</div>


{{% /blocks/section %}}
