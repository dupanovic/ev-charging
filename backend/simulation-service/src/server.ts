import app from "./app.js";

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;

app.listen(PORT, () => {
  console.log(`Simulation service running on http://localhost:${PORT}`);
  console.log(`  POST /api/simulate       — run a simulation`);
  console.log(`  POST /api/simulate/sweep  — sweep 1..N chargepoints`);
  console.log(`  GET  /api/health          — health check`);
});
