# API Service

Express REST API for managing simulation configurations and results. Uses Prisma ORM with PostgreSQL for persistence. Delegates simulation execution to the simulation-service.

## Getting Started

```bash
npm install

# Set up database (requires PostgreSQL running)
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ev_charging"
npx prisma db push

npm run dev   # http://localhost:3000
```

## Project Structure

```
src/
├── routes/
│   ├── simulations.ts       # CRUD configs, run simulations, results
│   ├── simulations.test.ts  # Route unit tests
│   └── health.ts            # Health check route
├── app.ts                   # Express app setup (cors, json, routes)
├── prisma.ts                # Prisma client singleton
└── server.ts                # HTTP server entry
prisma/
└── schema.prisma            # Database schema
```
