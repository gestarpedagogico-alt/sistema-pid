# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This repository is a personal study-schedule tracker (in Brazilian Portuguese) built for one person's PDI (Plano de Desenvolvimento Individual) at "Norte Rios". It's a static multi-file site: `index.html` and `login.html` are thin HTML shells, with CSS in `css/`, JS in `js/`, and the shared logo in `assets/img/`. There is no build system, no package manager, no test suite, and no framework — everything is plain HTML/CSS/JS loaded via `<link>`/`<script src>` tags, so it can still be opened by double-clicking `index.html` (or serving the folder with any static file server).

Note: this repo used to keep everything inline in a single `index.html` (partly so the file could also run standalone inside a Claude Artifact, via `window.claude.use`). It was deliberately split into the structure below for maintainability; the Claude-Artifact-compatibility property no longer holds now that CSS/JS live in separate files loaded via relative paths.

## Running / developing

There is nothing to build or install. To work on it, open `index.html` directly in a browser (double-click, or serve the folder with any static file server). Changes take effect on reload — edit the relevant file under `css/`/`js/`/`assets/` and refresh.

There are no linters or automated tests configured. Verify changes manually in a browser: exercise the affected tab(s), check that data persists after reload (via `localStorage`), and check print/export flows if touched.

## File structure

```
index.html              thin shell: markup + <link>/<script src> tags for the app
login.html              thin shell: markup + <link>/<script src> tags for the login gate
css/
  theme.css              shared design tokens (:root vars, light/dark mode) + global reset
  main.css               all index.html-specific styles
  login.css              all login.html-specific styles (extends theme.css tokens)
js/
  auth-guard.js           index.html's synchronous login check (must load first, before any content)
  data.js                 BASE_COURSES seed list + EIXO_NAMES/EIXO_COLORS/eixoDot()
  state.js                state object, defaultState/loadState/saveState/ensureDefaults, course helpers
  scheduler.js             buildSessionPlan/groupPlanByMonth/monthCapacity (the round-robin engine)
  render-summary.js        renderSummary() (top progress card)
  render-schedule.js       renderSchedule() (Cronograma por mês tab)
  render-courses.js        renderCoursesCards()/populateEixoSelects()/addCustomCourse() (Cursos tab)
  dnd.js                   pointer-based drag reordering (startDrag/onDragMove/onDragEnd)
  render-sessions.js       Sessões tab: log/list sessions, skip dates, streaks & heatmap
  render-analysis.js       renderAnalysis() (Análise tab)
  render-indicadores.js    renderIndicadores() (Indicadores por eixo tab + certificates)
  io.js                    exportJson/importJsonFile/exportIcs/saveOrFallback
  app.js                   renderAll() + all event-listener wiring + init calls (must load last)
  login.js                 login.html's script (ALLOWED_EMAILS check, redirect logic)
assets/
  img/
    logo.svg               Norte Rios logo, shared by both pages via <img>
```

All the JS files above are plain classic scripts (no `type="module"`, no bundler) loaded in dependency order via multiple `<script src>` tags at the bottom of `index.html`. Classic `<script>` tags on the same page share one top-level scope, so a `const`/`function` declared in one file is visible to code in a later one — but this means **load order in `index.html` matters**: keep `data.js`/`state.js` before anything that reads `state`, and keep `app.js` last (it calls `renderAll()` and wires up DOM events that reference functions defined in the other files).

## Architecture

- **Data model** (`js/data.js`): `BASE_COURSES` is the hardcoded seed list of all courses (id, eixo/axis, institution, name, workload `ch` in hours — `ch:null` means workload is unknown/estimated). `EIXO_NAMES`/`EIXO_COLORS` map each "eixo" (thematic axis, e.g. `A` = AI in education, `B` = building AI systems, etc.) to a label/color.
- **State** (`js/state.js`): a single `state` object (`{courses, custom, order, sessions, skip}`) is the source of truth for everything user-editable — per-course status/notes/certificate, user-added custom courses, the drag-and-drop ordering used for scheduling priority, logged study sessions, and skipped (holiday/pause) dates. It's persisted to `localStorage` under `STORAGE_KEY` (`norte_rios_pdi_cronograma_v3`, with a fallback read from the old `v2` key) via `saveState()`/`loadState()`. There is no backend — this app is entirely client-side and single-user.
- **Scheduling engine** (`js/scheduler.js`, `buildSessionPlan`): the core logic. It walks forward from `START_DATE` (fixed study slots are Wednesdays and Fridays, 2h each, 4h/week total) and round-robins across "eixos" — it works one course at a time, but each time a course completes, the next one is pulled from a *different* eixo than the one just finished, cycling through `eixoOrder`. Skipped dates (`state.skip`) are excluded from capacity. `groupPlanByMonth`/`monthCapacity` derive the month-by-month schedule view from this plan.
- **Rendering**: one `render*()` function per tab/section, split across `render-summary.js`, `render-schedule.js`, `render-courses.js`, `render-sessions.js`, `render-analysis.js`, `render-indicadores.js`, all wired together by `renderAll()` in `app.js`, which is called after every state mutation. There's no virtual DOM or framework — each render function rebuilds its container's `innerHTML` from `state` and re-attaches event listeners as needed.
- **Course reordering** (`js/dnd.js`): drag-and-drop (mouse + touch) is hand-rolled in `startDrag`/`onDragMove`/`onDragEnd`, mutating `state.order` (which directly drives round-robin priority in the scheduler).
- **Import/export** (`js/io.js`): `exportJson`/`importJsonFile` round-trip the entire `state` object as a JSON backup. `exportIcs` generates an `.ics` calendar file from the session plan. `saveOrFallback` tries a `window.claude.use("downloads")` API first (in case this is ever embedded somewhere that provides it) and falls back to a copy-paste modal (`#fallbackModal`) when that's unavailable.
- **Theming** (`css/theme.css`): light/dark mode via CSS custom properties in `:root`, respecting `prefers-color-scheme` and an optional `data-theme` attribute override. `main.css` and `login.css` both depend on the tokens defined here.

## Login gate

`login.html` is a standalone page (own markup + `css/login.css`, on top of the shared `css/theme.css` tokens) that asks only for an e-mail and checks it against a hardcoded `ALLOWED_EMAILS` array in `js/login.js`. On success it writes `{email, ts}` to `localStorage["norte_rios_pdi_auth_v1"]` and redirects to `index.html`; `index.html` loads `js/auth-guard.js` as the very first thing in `<body>`, which checks the same key and redirects to `login.html` if it's missing.

This is intentionally **not** a real security boundary — there's no backend, so the allowlist lives in plain sight in the page source. It's just a casual-access filter. Known, accepted tradeoff: the `index.html` guard does not re-check the email against `ALLOWED_EMAILS`, so removing someone from the list doesn't revoke a session they already have saved in their browser. To add or remove an authorized e-mail, edit `ALLOWED_EMAILS` in `js/login.js`. This mirrors the same pattern already used in the sibling project `painel-pessoal`.

## Conventions

- All user-facing text and code comments follow the existing file are in Portuguese (pt-BR); keep new UI strings consistent with this.
- Keep the modular structure above: put new styles in the right `css/*.css` file (shared tokens in `theme.css`, page-specific rules in `main.css`/`login.css`), and new behavior in a focused `js/*.js` file rather than piling everything into `app.js`.
- No build step or bundler — every file must run as-is in the browser. Don't introduce `import`/`export`, TypeScript, JSX, or npm dependencies.
