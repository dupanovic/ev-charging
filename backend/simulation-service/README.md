# Simulation Service

Stateless simulation engine for EV chargepoint usage. 

Available as both a CLI tool and a REST API.

## Getting Started

```bash
npm install

npm run dev
```

### CLI

#### CLI Examples

```bash
# Default: 20 chargepoints @ 11kW
npx tsx src/cli.ts

# Deterministic with seed
npx tsx src/cli.ts --seed 42

# Custom configuration
npx tsx src/cli.ts --chargepoints 30 --power 22 --multiplier 1.5

# Sweep: run 1-30 chargepoints, show concurrency factors
npx tsx src/cli.ts --sweep --seed 42
```

#### CLI Flags

| Flag | Short | Default | Description |
|------|-------|---------|-------------|
| `--chargepoints` | `-n` | 20 | Number of chargepoints |
| `--power` | `-p` | 11 | Charging power per chargepoint (kW) |
| `--consumption` | `-c` | 18 | EV consumption (kWh/100km) |
| `--multiplier` | `-m` | 1.0 | Arrival probability multiplier |
| `--seed` | `-s` | — | RNG (mulberry) seed for deterministic results |
| `--sweep` | — | false | Run 1-30 chargepoints sweep |


## Project Structure

```
src/
├── simulator.ts       # Core simulation engine
├── constants.ts       # T1 arrival probabilities, T2 demand distribution
├── random.ts          # Seeded PRNG (mulberry32)
├── types.ts           # TypeScript interfaces
├── cli.ts             # CLI entry point
├── routes.ts          # Express route handlers
├── app.ts             # Express app configuration
├── server.ts          # HTTP server entry
├── simulator.test.ts  # Simulation unit tests (13 tests)
└── random.test.ts     # PRNG unit tests (4 tests)
```
