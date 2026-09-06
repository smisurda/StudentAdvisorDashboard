# Advisor Roster

A two-page advisor roster and student profile app built using Vue. Mock JSON is loaded as if it came from a backend API.

## Run locally

You need Node.js 18+ and npm.

```bash
cd project-directory
npm install
npm run dev
```

Open the URL Vite prints: (in my case `http://localhost:5173`).

Other commands:

```bash
npm test          # unit tests
npm run build     # "production" build
```

## What was built

- **Roster:** sortable table, search, campus/program/level filters, attention filter, loading/error/empty states.
- **Profile:** academics, engagement, advising, back link, missing-field labels, attention callout.
- **Data flow:** `fetch` → normalize → Pinia store → views. Direct JSON imports were avoided on purpose.
- **Attention rules:** GPA &lt; 2.50, engagement &lt; 65, attendance &lt; 70%, on-time assignments &lt; 60%.

## Project layout

```
src/services/rosterApi.js   API-style fetch + null-safe mapping
src/stores/roster.js        Shared roster/filter/sort state
src/views/                  Roster and profile pages
src/utils/                  Display formatting and attention rules
src/__tests__/              Vitest coverage for mapping and rules
public/data/                Mock API payload
```
