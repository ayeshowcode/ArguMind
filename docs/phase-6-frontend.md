# Phase 6 — Frontend (ArguMind UI)

Briefing for teammates picking up the frontend. Use this alongside [phases-1-5-agents.md](./phases-1-5-agents.md) for backend context — the frontend is purely a consumer of the `POST /debate` endpoint built in Phase 5.

---

## 1. What changed in Phase 6 (one sentence)

We built the ArguMind UI as a **Next.js 15 + React 18 + TypeScript** app with a neo-brutalist design that lets a user enter a topic, configure rounds, watch 4 agents debate, and receive a full fact-checked transcript.

> **Migration note:** The frontend was originally a single `index.html` using CDN React + Babel. It has been fully migrated to a proper Next.js project. The `index.html` file is kept in the directory as a legacy reference only.

---

## 2. New words you will hear

| Term | Meaning |
|------|---------|
| **Next.js App Router** | The `src/app/` directory structure introduced in Next.js 13. Each file in `app/` maps to a route; `layout.tsx` wraps all pages; `page.tsx` is the route's content. |
| **`'use client'`** | A Next.js directive placed at the top of any component file that uses React hooks, event handlers, or browser APIs. Without it, the component runs as a Server Component (no interactivity). Every interactive component in this project carries it. |
| **Server Component** | A React component that renders on the server and sends HTML to the browser. Used here only for purely static components (`BrainIcon`, `Footer`, `PromptDebateShip`, `HowWeDoIt`) that have no state or event handlers. |
| **`NEXT_PUBLIC_BACKEND_URL`** | Environment variable for the API base URL. Defaults to `http://localhost:8000` if not set. Prefix `NEXT_PUBLIC_` is required by Next.js to expose a variable to client-side code. |
| **Neo-brutalist** | A design style: thick black borders, hard offset box-shadows (`8px 8px 0 0 #111`), flat vibrant fill colors, and `Bangers` (a free Google Font) for all headings. Nothing is rounded or soft. |
| **`BrutalButton`** | The shared button primitive. Simulates a physical key press via `onMouseDown/Up/Enter/Leave` handlers that shift `transform` and `boxShadow`. Three variants: `primary` (cyan), `secondary` (cream), `danger` (navy). |
| **`AgentBadge`** | A colored pill that renders an agent role name (PROPONENT, CRITIC, ANALYST, FACT-CHECKER) with its brand color. Used in every `MessageCard`. |
| **`MessageCard`** | One agent turn rendered as a bordered card with a colored left strip. Fades in via CSS `opacity` transition when `visible` is true. |
| **`BriefTerminal`** | The 3-step wizard modal that collects topic and rounds before a debate starts. Rendered over the landing page as a fixed overlay. |
| **`DebateView`** | The component that fires `POST /debate`, shows `LoadingView` while waiting, then renders `DebateStream` + `SummaryCard` when the response arrives. |
| **`LoadingView`** | Cycling pipeline indicator shown during the API call. Highlights each of the 4 agent labels in sequence every 2.5 s to suggest progress. |
| **`DebateStream`** | Renders all `Message` objects grouped by round, revealing cards one at a time (600 ms apart) for a streaming effect. |
| **`SummaryCard`** | Appears at the bottom of the debate view. Shows total messages, max round, agent count, the Fact-Checker's final audit, and a "Copy Transcript" button. |
| **`StatsBar`** | Animated count-up section on the landing page. Numbers animate from 0 to their target over 800 ms when the section scrolls into view (`IntersectionObserver`). |
| **`Ticker`** | Dual marquee strip. Top row: 7 clickable quick-topic buttons that pre-fill the wizard. Bottom row: keyword scroll (ACCURACY · ANALYSIS · …). |
| **Page state router** | `page.tsx` holds a `page` state (`'landing'` or `'debate'`). There is no URL routing — navigation is a single `setState` call. |

---

## 3. File structure

```
frontend/
├── package.json                        Next.js 15, React 18, TypeScript
├── tsconfig.json
├── next.config.ts
├── index.html                          Legacy CDN version (reference only)
└── src/
    ├── app/
    │   ├── layout.tsx                  Root layout: metadata, Google Fonts <link>
    │   ├── page.tsx                    App root — holds page/debate state
    │   └── globals.css                 CSS animations, scrollbar, box-model reset
    ├── types/
    │   └── debate.ts                   AgentRole, Message, DebateResult, DebateParams
    └── components/
        ├── ui/
        │   ├── BrainIcon.tsx           3×3 grid logo icon
        │   ├── BrutalButton.tsx        Shared button with press animation
        │   ├── AgentBadge.tsx          Role-colored pill label
        │   ├── MessageCard.tsx         Single agent turn card
        │   └── AppHeader.tsx           Sticky nav bar
        ├── landing/
        │   ├── LandingPage.tsx         Landing root — manages wizard open state
        │   ├── HeroSection.tsx         Navy hero box + comic burst graphics
        │   ├── Ticker.tsx              Dual animated marquee strip
        │   ├── PromptDebateShip.tsx    "ARGUE. ANALYSE. VERIFY." section
        │   ├── HowWeDoIt.tsx           4-step pipeline cards
        │   ├── StatsBar.tsx            Animated count-up stats
        │   ├── LaunchSection.tsx       CTA banner
        │   ├── AgentRoster.tsx         4 agent profile cards
        │   └── Footer.tsx              Brand footer
        ├── wizard/
        │   └── BriefTerminal.tsx       3-step modal wizard (steps inlined)
        └── debate/
            ├── LoadingView.tsx         Pipeline indicator during fetch
            ├── DebateStream.tsx        Timed message reveal by round
            ├── SummaryCard.tsx         Stats + audit + copy transcript
            └── DebateView.tsx          Fetch orchestrator, renders loading/error/success
```

---

## 4. TypeScript types

All debate data shapes live in `src/types/debate.ts`:

```ts
type AgentRole = 'proponent' | 'critic' | 'analyst' | 'fact_checker';

interface Message {
  role: AgentRole;
  round: number;
  content: string;
}

interface DebateResult {
  topic: string;
  messages: Message[];
}

interface DebateParams {
  topic: string;
  rounds: number;
}
```

---

## 5. Design tokens

| Token | Value | Used for |
|-------|-------|---------|
| `CREAM` | `#F5F0E8` | Page background, button secondary |
| `NAVY` | `#1E1B4B` | Hero box, critic badge, footer |
| `CYAN` | `#06B6D4` | Primary accent, proponent badge, CTA buttons |
| `PURPLE` | `#C084FC` | Fact-checker badge and highlight |
| `MINT` | `#A7F3D0` | Analyst badge |
| `BORDER` | `#111` | All borders, shadows, and outline text |

Every border is `4px solid #111`. Every hard shadow is `8px 8px 0 0 #111` (elevated) or `12px 12px 0 0 #111` (on hover). No border-radius except the pulsing live-indicator dot.

Animations (`pulse`, `marquee`, `marqueeRev`) live in `src/app/globals.css` and are referenced as string values in inline `style` props.

---

## 6. Component tree

```
page.tsx  (App root)
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

## 7. Two-page flow

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

## 8. Wizard steps in detail

| Step | Component | What the user does | Validation |
|------|-----------|--------------------|-----------|
| 1 | `StepTopic` | Types a debate topic (max 200 chars); or clicks a quick-fill chip | "CONTINUE →" is disabled until `topic.trim().length > 10` |
| 2 | `StepRounds` | Picks 1–5 rounds from a button row; default is 3 | No validation — all 5 choices are always valid |
| 3 | `StepReview` | Reads the summary (TOPIC, ROUNDS, AGENTS, MODEL) and confirms | "LAUNCH DEBATE →" fires `onSubmit({ topic, rounds })` |

Progress bar: 3 cyan fill segments, each fills as `step >= n`.

---

## 9. API integration

```
POST http://localhost:8000/debate
Content-Type: application/json

{ "topic": "…", "rounds": N }
```

`DebateView` sends this inside a `useEffect` that fires once on mount. It sets `cancelled = true` in the cleanup function to prevent state updates after unmount (e.g. if the user navigates back during the fetch).

On **success** (`res.ok`): stores the `DebateResult` JSON in `transcript`, sets `status = 'success'`.  
On **HTTP error**: reads `res.text()` and surfaces the exact server message in the error card.  
On **network error**: catches the thrown `Error` and shows it.

The backend URL defaults to `http://localhost:8000`. Override it by creating `frontend/.env.local`:

```
NEXT_PUBLIC_BACKEND_URL=http://your-host:8000
```

The backend must have CORS `allow_origins=["*"]`. Unlike the old `file://` version, Next.js dev serves on `http://localhost:3000` so the browser sends a real `Origin` header — a wildcard or explicit `http://localhost:3000` in `allow_origins` is required.

---

## 10. Debate stream reveal

`DebateStream` uses `setInterval` (600 ms) to increment `visibleCount` from 0 to `messages.length`. Each `MessageCard` receives `visible = globalIdx < visibleCount`. When `visible` is false the card's `opacity` is `0`; when true it transitions to `1` over 400 ms.

Messages are grouped by `round` number. Round 0 is labelled `OPENING STATEMENT`; all others are `ROUND N`.

---

## 11. Transcript copy format

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

## 12. Run path

```bash
# 1. Start the backend
cd backend && uvicorn main:app --reload --port 8000

# 2. Confirm it is up
curl http://localhost:8000/health   # → {"status":"ok"}

# 3. Install frontend deps (first time only)
cd frontend && npm install

# 4. Start the dev server
npm run dev                         # → http://localhost:3000

# 5. Production build (optional)
npm run build && npm start          # → http://localhost:3000
```

Node.js 18+ is required. There is no `file://` option anymore — the app must be served by Next.js.

---

## 13. Quick-reference: agent brand colors

| Agent | Badge background | Badge text | Left strip in MessageCard |
|-------|-----------------|------------|--------------------------|
| proponent | `#06B6D4` (cyan) | `#fff` | `#06B6D4` |
| critic | `#1E1B4B` (navy) | `#06B6D4` | `#1E1B4B` |
| analyst | `#A7F3D0` (mint) | `#111` | `#A7F3D0` |
| fact_checker | `#C084FC` (purple) | `#fff` | `#C084FC` |

---

## 14. What stayed the same vs. what changed

| Aspect | Before (CDN React) | After (Next.js) |
|--------|-------------------|-----------------|
| Visual design | Neo-brutalist, all inline styles | Identical — no visual changes |
| Component structure | All in one `<script>` block | Same tree, split into 23 `.tsx` files |
| State management | `React.useState` / `React.useEffect` | Same hooks, proper imports |
| API call | `fetch` in `useEffect` | Identical |
| Font loading | Google Fonts `<link>` in `<head>` | Same `<link>` in `layout.tsx` |
| Animations | Inline `<style>` block | Moved to `globals.css` |
| Build step | None (Babel in browser) | `npm run build` |
| Serving | `file://` double-click | `npm run dev` → `localhost:3000` |
| Backend URL | Hard-coded constant | `NEXT_PUBLIC_BACKEND_URL` env var |
| TypeScript | None (plain JS) | Full strict TypeScript |
