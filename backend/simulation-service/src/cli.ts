// CLI entry point for the EV charging simulation. Parses command-line arguments and runs the simulation accordingly.
// I set this up to make testing the simulator easier.
// A consequence is that the project becomes agent-friendly, since the agent can test the output efficiently!


import { parseArgs } from "node:util";
import { simulate, simulateSweep } from "./simulator.js";
import {
  DEFAULT_NUM_CHARGEPOINTS,
  DEFAULT_CHARGING_POWER_KW,
  DEFAULT_CONSUMPTION_KWH_PER_100KM,
  DEFAULT_ARRIVAL_MULTIPLIER,
} from "./constants.js";

const { values } = parseArgs({
  options: {
    chargepoints: { type: "string", short: "n", default: String(DEFAULT_NUM_CHARGEPOINTS) },
    power: { type: "string", short: "p", default: String(DEFAULT_CHARGING_POWER_KW) },
    consumption: { type: "string", short: "c", default: String(DEFAULT_CONSUMPTION_KWH_PER_100KM) },
    multiplier: { type: "string", short: "m", default: String(DEFAULT_ARRIVAL_MULTIPLIER) },
    seed: { type: "string", short: "s" },
    sweep: { type: "boolean", default: false },
    help: { type: "boolean", short: "h", default: false },
  },
});

if (values.help) {
  console.log(`
EV Charging Simulation

Usage: npx tsx src/cli.ts [options]

Options:
  -n, --chargepoints <num>   Number of chargepoints (default: ${DEFAULT_NUM_CHARGEPOINTS})
  -p, --power <kW>           Charging power per chargepoint (default: ${DEFAULT_CHARGING_POWER_KW})
  -c, --consumption <kWh>    Consumption per 100km (default: ${DEFAULT_CONSUMPTION_KWH_PER_100KM})
  -m, --multiplier <factor>  Arrival probability multiplier (default: ${DEFAULT_ARRIVAL_MULTIPLIER})
  -s, --seed <number>        RNG seed for deterministic results
      --sweep                Run simulation for 1–30 chargepoints
  -h, --help                 Show this help
  `);
  process.exit(0);
}

const baseConfig = {
  chargingPowerKw: Number(values.power),
  consumptionKwhPer100km: Number(values.consumption),
  arrivalMultiplier: Number(values.multiplier),
  seed: values.seed !== undefined ? Number(values.seed) : undefined,
};

if (values.sweep) {
  console.log("Running simulation sweep for 1–30 chargepoints...\n");
  const start = performance.now();
  const results = simulateSweep(baseConfig, 30);
  const elapsed = ((performance.now() - start) / 1000).toFixed(2);

  console.log(
    "CPs".padStart(4),
    "Energy (kWh)".padStart(14),
    "Theo Max (kW)".padStart(15),
    "Actual Max (kW)".padStart(17),
    "Concurrency".padStart(13),
    "Events".padStart(8)
  );
  console.log("-".repeat(71));

  for (const r of results) {
    console.log(
      String(r.numChargepoints).padStart(4),
      r.totalEnergyKwh.toFixed(2).padStart(14),
      r.theoreticalMaxPowerKw.toFixed(0).padStart(15),
      r.actualMaxPowerKw.toFixed(2).padStart(17),
      (r.concurrencyFactor * 100).toFixed(2).padStart(12) + "%",
      String(r.totalChargingEvents).padStart(8)
    );
  }

  console.log(`\nCompleted in ${elapsed}s`);
} else {
  const numChargepoints = Number(values.chargepoints);
  console.log(`Simulating ${numChargepoints} chargepoints @ ${baseConfig.chargingPowerKw} kW for 1 year...\n`);

  const start = performance.now();
  const result = simulate({ ...baseConfig, numChargepoints });
  const elapsed = ((performance.now() - start) / 1000).toFixed(2);

  console.log("=== Simulation Results ===");
  console.log(`Total energy consumed:      ${result.totalEnergyKwh.toFixed(2)} kWh`);
  console.log(`Theoretical max power:      ${result.theoreticalMaxPowerKw.toFixed(0)} kW`);
  console.log(`Actual max power:           ${result.actualMaxPowerKw.toFixed(2)} kW`);
  console.log(`Concurrency factor:         ${(result.concurrencyFactor * 100).toFixed(2)}%`);
  console.log(`Total charging events:      ${result.totalChargingEvents}`);
  console.log(`\nCompleted in ${elapsed}s`);
}
