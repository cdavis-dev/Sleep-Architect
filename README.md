# Sleep Architect

Plan bedtimes and wake times around 90-minute sleep cycles, then track how rested you feel over time.

Sleep Architect is a lightweight React app for picking a sleep or wake target, seeing the next few cycle-aligned times, and logging a short morning check-in.

## Features

- **Wake up at / Sleep at** — calculate bedtime from a wake time, or wake time from a bedtime
- **90-minute cycles** — shows options for 4, 5, and 6 cycles (6h, 7.5h, and 9h)
- **Fall-asleep buffer** — add 0–60 minutes so the schedule includes time to actually fall asleep
- **Morning check-in** — tap I'm Awake, rate how hard it was to get up, then rate energy a few minutes later
- **Efficiency chart** — plots your combined rest score over time (saved in the browser)

## How it works

Sleep is planned in 90-minute cycles. Pick a target time and a buffer, and the app subtracts or adds 4–6 cycles plus that buffer.

After you wake up, it asks for wake difficulty (1–10) and, about 10 seconds later, energy level (1–10). Those scores are combined into a rest-efficiency number and stored in `localStorage` so the chart persists on that device.

## Getting started

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually `http://localhost:5173`).

```bash
npm run build    # production build
npm run preview  # preview the production build
```

## Tech stack

- React 19
- Vite
- Recharts
- Lucide icons
