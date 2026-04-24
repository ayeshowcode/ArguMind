# Phase 6 — Frontend (ArguMind UI)

Briefing for teammates picking up the frontend. Use this alongside [phases-1-5-agents.md](./phases-1-5-agents.md) for backend context — the frontend is purely a consumer of the `POST /debate` endpoint built in Phase 5.

---

## 1. What changed in Phase 6 (one sentence)

We built a single-file, no-build React frontend (`frontend/index.html`) with a neo-brutalist design that lets a user enter a topic, configure rounds, watch 4 agents debate in real time, and receive a full fact-checked transcript.

---

## 2. New words you will hear

| Term | Meaning |
|------|---------|
| **CDN React** | React 18 + ReactDOM loaded directly from `unpkg.com` via `<script>` tags. No Node, no npm, no build step. Open the file in a browser and it works. |
| **`@babel/standalone`** | A browser-side Babel build. It compiles the `<script type="text/babel">` block at runtime, so you can write JSX without a bundler. |
| **Neo-brutalist** | A design style: thick black borders, hard offset box-shadows (`8px 8px 0 0 #111`), flat vibrant fill colors, and `Bangers` (a free Google Font) for all headings. Nothing is rounded or soft. |
| **`BrutalButton`** | The shared button primitive. Simulates a physical key press via `onMouseDown/Up/Enter/Leave` handlers that shift `transform` and `boxShadow`. Three variants: `primary` (cyan), `secondary` (cream), `danger` (navy). |
| **`AgentBadge`** | A colored pill that renders an agent role name (PROPONENT, CRITIC, ANALYST, FACT-CHECKER) with its brand color. Used in every `MessageCard`. |
| **`MessageCard`** | One agent turn rendered as a bordered card with a colored left strip. Fades in via CSS `opacity` transition when `visible` is true. |
| **`BriefTerminal`** | The 3-step wizard modal that collects topic and rounds before a debate starts. Rendered over the landing page as a fixed overlay. |
| **`DebateView`** | The page that fires `POST /debate`, shows `LoadingView` while waiting, then renders `DebateStream` + `SummaryCard` when the response arrives. |
| **`LoadingView`** | Cycling pipeline indicator shown during the API call. Highlights each of the 4 agent labels in sequence every 2.5 s to suggest progress. |
| **`DebateStream`** | Renders all `AgentMessage` objects grouped by round, revealing cards one at a time (600 ms apart) for a streaming effect. |
| **`SummaryCard`** | Appears at the bottom of the debate view. Shows total messages, max round, agent count, the Fact-Checker's final audit, and a "Copy Transcript" button. |
| **`StatsBar`** | Animated count-up section on the landing page. Numbers animate from 0 to their target over 800 ms when the section scrolls into view (`IntersectionObserver`). |
| **`Ticker`** | Dual marquee strip. Top row: 7 clickable quick-topic buttons that pre-fill the wizard. Bottom row: keyword scroll (ACCURACY · ANALYSIS · …). |
| **Page router** | `App` holds a `page` state (`'landing'` or `'debate'`). There is no URL routing — navigation is a single `setState` call. |
| **`BACKEND` constant** | Hard-coded to `'http://localhost:8000'` at the top of the script. Change this one string if you move the API to a different host or port. |

---

## 3. File

| File | Purpose |
|------|---------|
| `frontend/index.html` | The entire frontend — HTML shell, inline CSS, CDN script tags, and all React components in a single `<script type="text/babel">` block. |

There is intentionally only one file. No `package.json`, no `node_modules`, no bundler config.

---

## 4. Design tokens

| Token | Value | Used for |
|-------|-------|---------|
| `CREAM` | `#F5F0E8` | Page background, button secondary |
| `NAVY` | `#1E1B4B` | Hero box, critic badge, footer |
| `CYAN` | `#06B6D4` | Primary accent, proponent badge, CTA buttons |
| `PURPLE` | `#C084FC` | Fact-checker badge and highlight |
| `MINT` | `#A7F3D0` | Analyst badge |
| `BORDER` | `#111` | All borders, shadows, and outline text |

Every border is `4px solid #111`. Every hard shadow is `8px 8px 0 0 #111` (elevated) or `12px 12px 0 0 #111` (on hover). No border-radius except the pulsing live-indicator dot.

---

## 5. Component tree

```
App
├── AppHeader          (sticky, shows "← NEW DEBATE" button when on debate page)
├── LandingPage        (page === 'landing')
│   ├── HeroSection    (navy rotated card, comic bursts, two CTA buttons)
│   ├── Ticker         (dual marquee: quick-topic buttons + keyword scroll)
│   ├── PromptDebateShip
│   ├── HowWeDoIt      (4-step pipeline cards)
│   ├── StatsBar       (count-up animation: 4 agents, 3 rounds, OUT, JSON)
│   ├── LaunchSection  (CTA banner)
│   ├── AgentRoster    (4 agent cards with hover lift; IDLE/ACTIVE indicator)
│   └── BriefTerminal  (modal, renders only when wizardOpen === true)
│       ├── StepTopic  (textarea + 3 quick-fill chip buttons)
│       ├── StepRounds (1–5 number buttons)
│       └── StepReview (summary rows: TOPIC / ROUNDS / AGENTS / MODEL)
├── DebateView         (page === 'debate')
│   ├── LoadingView    (cycling pipeline indicator, shown while fetch is pending)
│   ├── DebateStream   (messages grouped by round, timed reveal)
│   │   └── MessageCard × N
│   └── SummaryCard    (stats + Fact-Checker audit + copy transcript)
└── Footer
```

---

## 6. Two-page flow

```
Landing
  └── user clicks any CTA  ──► BriefTerminal opens (wizard)
        └── StepTopic → StepRounds → StepReview
              └── "LAUNCH DEBATE →" ──► App.startDebate(topic, rounds)
                    └── page = 'debate'
                          └── DebateView mounts, fires POST /debate immediately
                                ├── pending  → LoadingView
                                ├── error    → error card with "TRY AGAIN" + "← BACK"
                                └── success  → DebateStream + SummaryCard
                                      └── "NEW DEBATE →" ──► App.backToLanding()
                                            └── page = 'landing'
```

The Ticker also opens the wizard pre-filled: clicking a quick-topic button calls `openWith(topic)`, which sets `initialTopic` before `wizardOpen = true`.

---

## 7. Wizard steps in detail

| Step | Component | What the user does | Validation |
|------|-----------|--------------------|-----------|
| 1 | `StepTopic` | Types a debate topic (max 200 chars); or clicks a quick-fill chip | "CONTINUE →" is disabled until `topic.trim().length > 10` |
| 2 | `StepRounds` | Picks 1–5 rounds from a button row; default is 3 | No validation — all 5 choices are always valid |
| 3 | `StepReview` | Reads the summary (TOPIC, ROUNDS, AGENTS, MODEL) and confirms | "LAUNCH DEBATE →" fires `onSubmit({ topic, rounds })` |

Progress bar: 3 cyan fill segments, each fills as `step >= n`.

---

## 8. API integration

```
POST http://localhost:8000/debate
Content-Type: application/json

{ "topic": "…", "rounds": N }
```

`DebateView` sends this inside a `useEffect` that fires once on mount. It sets `cancelled = true` in the cleanup function to prevent state updates after unmount (e.g. if the user navigates back during the fetch).

On **success** (`res.ok`): stores the `DebateTranscript` JSON in `transcript`, sets `status = 'success'`.
On **HTTP error**: reads `res.text()` and surfaces the exact server message in the error card.
On **network error**: catches the thrown `Error` and shows it.

The backend must be running at `http://localhost:8000` with CORS `allow_origins=["*"]` (no credentials). The frontend is opened as a `file://` URL — browsers send `Origin: null` for file pages, so the wildcard is required.

---

## 9. Debate stream reveal

`DebateStream` uses `setInterval` (600 ms) to increment `visibleCount` from 0 to `messages.length`. Each `MessageCard` receives `visible = globalIdx < visibleCount`. When `visible` is false the card's `opacity` is `0`; when true it transitions to `1` over 400 ms.

Messages are grouped by `round` number. Round 0 is labelled `OPENING STATEMENT`; all others are `ROUND N`.

---

## 10. Transcript copy format

Clicking "COPY TRANSCRIPT" in `SummaryCard` writes a plain-text block to the clipboard:

```
ARGUMIND DEBATE TRANSCRIPT
Topic: <topic>
Date: <locale date>

--- OPENING ---
[PROPONENT]: …

--- ROUND 1 ---
[CRITIC]: …
[PROPONENT]: …
[ANALYST]: …

--- ROUND 2 ---
…
[FACT_CHECKER]: …
```

---

## 11. Run path

1. Start the backend: `cd backend && uvicorn main:app --reload --port 8000`
2. Confirm it is up: `curl http://localhost:8000/health` → `{"status":"ok"}`
3. Open `frontend/index.html` directly in your browser (double-click it, or `File → Open`).
4. The page loads from `file://`. No local server is needed for the frontend.
5. Click any CTA → complete the 3-step wizard → watch the debate run.

If the browser shows a CORS error, check that the backend middleware has `allow_origins=["*"]` and **no** `allow_credentials=True`.

---

## 12. Quick-reference: agent brand colors

| Agent | Badge background | Badge text | Left strip in MessageCard |
|-------|-----------------|------------|--------------------------|
| proponent | `#06B6D4` (cyan) | `#fff` | `#06B6D4` |
| critic | `#1E1B4B` (navy) | `#06B6D4` | `#1E1B4B` |
| analyst | `#A7F3D0` (mint) | `#111` | `#A7F3D0` |
| fact_checker | `#C084FC` (purple) | `#fff` | `#C084FC` |

---

## 13. Analogy that usually lands

The entire frontend is like a **single printed flyer** — everything is self-contained, you can hand it to anyone and they can read it without needing a printer driver or a build system. React and Babel arrive via CDN the same way a font or image would. The page talks to the backend over `fetch`, which is the one wire connecting the flyer to the live debate engine.
