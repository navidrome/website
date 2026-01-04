# Change: Improve Getting Started Page for Better User Success

## Why

The current Getting Started page assumes everything went smoothly during installation and provides minimal guidance when things don't work as expected. New users frequently encounter issues with:
- Music not appearing after installation
- Permission problems with music folders
- Not knowing if Navidrome is actually working
- Confusion about the scan process and timing
- Platform-specific quirks (macOS quarantine, Windows service issues, Linux permissions)

A more foolproof Getting Started page would dramatically reduce support requests and improve the first-run experience.

## What Changes

- Add a **pre-flight checklist** section verifying installation is complete
- Add **clear verification steps** to confirm Navidrome is running correctly
- Reorganize content with a **step-by-step numbered flow** instead of scattered notes
- Add a **"What If Something's Wrong?"** troubleshooting section with common issues
- Include **expected timing guidance** (how long before music appears)
- Add **platform-specific tips** as collapsible sections
- Create **visual success indicators** (what you should see at each step)
- Move important notes into the main flow, not as afterthoughts

## Impact

- Affected specs: documentation-navigation
- Affected code: `content/en/docs/getting-started/_index.md`
- User experience: Significantly improved first-run success rate
- Support load: Reduced common questions about first setup

## Success Criteria

1. New users can follow the page sequentially without referring to other documentation
2. Common failure modes are addressed with actionable solutions
3. Users know exactly what to expect and when
4. Troubleshooting steps are self-contained (no "reach out" as primary guidance)
