# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This repository contains a single self-contained HTML file, `index.html` — a personal study-schedule tracker (in Brazilian Portuguese) built for one person's PDI (Plano de Desenvolvimento Individual) at "Norte Rios". There is no build system, no package manager, no test suite, and no framework: all HTML, CSS, and JavaScript live inline in this one file.

## Running / developing

There is nothing to build or install. To work on it, just open `index.html` directly in a browser (double-click, or serve the folder with any static file server). Changes take effect on reload — edit the file and refresh.

There are no linters or automated tests configured. Verify changes manually in a browser: exercise the affected tab(s), check that data persists after reload (via `localStorage`), and check print/export flows if touched.

## Architecture

Everything is in one `<script>` block at the bottom of the file, organized into clearly commented sections (search for `/* ---------- ... ---------- */`):

- **Data model** (top of script): `BASE_COURSES` is the hardcoded seed list of all courses (id, eixo/axis, institution, name, workload `ch` in hours — `ch:null` means workload is unknown/estimated). `EIXO_NAMES`/`EIXO_COLORS` map each "eixo" (thematic axis, e.g. `A` = AI in education, `B` = building AI systems, etc.) to a label/color.
- **State**: a single `state` object (`{courses, custom, order, sessions, skip}`) is the source of truth for everything user-editable — per-course status/notes/certificate, user-added custom courses, the drag-and-drop ordering used for scheduling priority, logged study sessions, and skipped (holiday/pause) dates. It's persisted to `localStorage` under `STORAGE_KEY` (`norte_rios_pdi_cronograma_v3`, with a fallback read from the old `v2` key) via `saveState()`/`loadState()`. There is no backend — this app is entirely client-side and single-user.
- **Scheduling engine** (`buildSessionPlan`): the core logic. It walks forward from `START_DATE` (fixed study slots are Wednesdays and Fridays, 2h each, 4h/week total) and round-robins across "eixos" — it works one course at a time, but each time a course completes, the next one is pulled from a *different* eixo than the one just finished, cycling through `eixoOrder`. Skipped dates (`state.skip`) are excluded from capacity. `groupPlanByMonth`/`monthCapacity` derive the month-by-month schedule view from this plan.
- **Rendering**: one `render*()` function per tab/section (`renderSummary`, `renderSchedule`, `renderCoursesCards`, `renderSessionsTab`, `renderStreaksAndHeatmap`, `renderAnalysis`, `renderIndicadores`), all wired together by `renderAll()`, which is called after every state mutation. There's no virtual DOM or framework — each render function rebuilds its container's `innerHTML` from `state` and re-attaches event listeners as needed.
- **Course reordering**: drag-and-drop (mouse + touch) is hand-rolled in `startDrag`/`onDragMove`/`onDragEnd`, mutating `state.order` (which directly drives round-robin priority in the scheduler).
- **Import/export**: `exportJson`/`importJsonFile` round-trip the entire `state` object as a JSON backup. `exportIcs` generates an `.ics` calendar file from the session plan. `saveOrFallback` tries a `window.claude.use("downloads")` API first (for the Claude Artifacts runtime) and falls back to a copy-paste modal (`#fallbackModal`) when that's unavailable — this means the file is designed to also work when rendered inside a Claude Artifact, not just as a plain static HTML file.
- **Theming**: light/dark mode via CSS custom properties in `:root`, respecting `prefers-color-scheme` and an optional `data-theme` attribute override.

## Login gate

`login.html` is a standalone page (its own copy of the design tokens/CSS — nothing is shared with `index.html`) that asks only for an e-mail and checks it against a hardcoded `ALLOWED_EMAILS` array in its inline script. On success it writes `{email, ts}` to `localStorage["norte_rios_pdi_auth_v1"]` and redirects to `index.html`; `index.html` has a tiny synchronous guard script as the very first thing in `<body>` that checks the same key and redirects to `login.html` if it's missing.

This is intentionally **not** a real security boundary — there's no backend, so the allowlist lives in plain sight in the page source. It's just a casual-access filter. Known, accepted tradeoff: the `index.html` guard does not re-check the email against `ALLOWED_EMAILS`, so removing someone from the list doesn't revoke a session they already have saved in their browser. To add or remove an authorized e-mail, edit `ALLOWED_EMAILS` in `login.html`. This mirrors the same pattern already used in the sibling project `painel-pessoal`.

## Conventions

- All user-facing text and code comments follow the existing file are in Portuguese (pt-BR); keep new UI strings consistent with this.
- Keep everything inline in the single HTML file — this project intentionally has no build step or external dependencies.
