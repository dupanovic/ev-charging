# EV Charging Simulation

Full-stack monorepo for simulating EV charging metrics over a year.

```
┌──────────┐     /api/*      ┌──────────┐  POST /api/simulate  ┌────────────────────┐
│ Frontend │ ──────────────> │   API    │ ───────────────────> │ Simulation Service │
│ (Vite)   │ <────────────── │(Node.js) │ <─────────────────── │    (Node.js)       │
│ :5173    │   JSON results  │ :3000    │    simulation data   │    :3001           │
└──────────┘                 └────┬─────┘                      └────────────────────┘
                                  │ 
                                  │ saved results and test config
                                  ▼
                             ┌──────────┐
                             │ Postgres │
                             │ :5432    │
                             └──────────┘
```

## Getting Started

### With Docker (recommended)

```bash
docker compose up --build
```

| Service | URL | What it does |
|---------|-----|-------------|
| Frontend | http://localhost:5173 | React dashboard |
| API | http://localhost:3000 | REST API with database |
| Adminer | http://localhost:8080 | Database browser |
| PostgreSQL | localhost:5432 | Database for storing simulation runs and configs |
| Simulation Service | http://localhost:3001 | Simulation engine (unfortunately not in Rust) |

For your convencience the database can be accessed through Adminer, with these credentials: 
- System=PostgreSQL
- Server=`postgres`
- User=`postgres`
- Password=`postgres`
- Database=`ev_charging`

### Without Docker

See individual READMEs in /frontend, /backend/api, and /backend/simulation-service.
Also requires a running PostgreSQL instance with credentials as listed above.

## Task 1 Analysis

When simulating with default paramaters but varied numbers of chargepoints, from 1 to 30, the concurrency factor continuously drops, and strong diminishing returns kick in at n = 25. Concurrency factor reaches 100% only for low n, but even then during most of the day there is excess charging capacity. This is due to very low arrival probabilities during most of the day. Half of the charging happens just in the afternoon.

The actual break-even point isn't clear to me since the price of a chargepoint is unknown, but the default of n = 20 seems like good middle ground.

To improve the analysis it would be good to include more parameters which represent large jumps in cost for charging providers. The assignment mentions a noticable jump when exceeding 220kW, but I assume that there are also space considerations since each charging point has to come with a parking spot plus the approach to the spot.

