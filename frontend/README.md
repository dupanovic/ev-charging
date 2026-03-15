# Frontend

Dashboard for running EV charging simulations with different parameters. Results shown are from the simulation engine in the backend.

## Getting Started

```bash
npm install
npm run dev   # http://localhost:5173
```


## Project Structure

```
src/
├── components/
│   ├── ConfigPanel.tsx        # Simulation parameter sliders
│   ├── ConfigList.tsx         # Saved configs sidebar
│   ├── SummaryCards.tsx       # KPI cards (energy, power, concurrency, events)
│   ├── DayChart.tsx           # Exemplary day area chart (Recharts)
│   └── ResultsDashboard.tsx   # Results container with loading state
├── api.ts                     # API client (fetch wrapper)
├── types.ts                   # Shared TypeScript types
├── App.tsx                    # Main app component
├── main.tsx                   # React entry point
└── index.css                  # TailwindCSS + custom slider styles
```
