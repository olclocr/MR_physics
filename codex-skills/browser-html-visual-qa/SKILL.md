---
name: browser-html-visual-qa
description: Use when editing or testing local HTML visualizations, educational browser demos, checkout flows on localhost, layout fixes from screenshots, or browser-verified UI changes.
metadata:
  short-description: Browser-check local HTML and layout fixes
---

# Browser HTML Visual QA

Use this for repeated local HTML visualization work and screenshot-driven layout fixes.

## Workflow

1. Identify how the page should run:
   - direct `file:///` is fine for static HTML without module/CORS needs
   - otherwise start a tiny local server from the repo root or docs folder
2. Inspect the target files before editing:
   - HTML structure
   - inline or linked CSS
   - scripts that drive animation/state
   - any existing verification or logging controls
3. Make small, visible edits:
   - keep labels readable and non-overlapping
   - preserve existing visual language
   - avoid adding explanatory UI text unless the user asked for it
4. Verify in browser:
   - open the local URL with the Browser plugin when available
   - take screenshots at the user-relevant viewport, often 1920px wide for this user's visual QA
   - check canvas/animation pages for nonblank rendering and stable controls
5. Report what changed and what was verified:
   - mention viewport and URL
   - note any remaining visual risk

## Local Preferences

- For MR physics demos, preserve educational clarity over decoration.
- Prefer direct manipulation and readable labels for k-space, RF, phase/frequency encoding, and signal panels.
- When the user supplies screenshots, treat them as the source of truth for spacing, overlap, and alignment.

