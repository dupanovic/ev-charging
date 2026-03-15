  import { Router, type Request, type Response } from "express";
  import { simulate, simulateSweep } from "./simulator.js";
  import {
    DEFAULT_NUM_CHARGEPOINTS,
    DEFAULT_CHARGING_POWER_KW,
    DEFAULT_CONSUMPTION_KWH_PER_100KM,
    DEFAULT_ARRIVAL_MULTIPLIER,
  } from "./constants.js";
  import type { SimulationConfig } from "./types.js";

  export const router = Router();

  function parseConfig(body: Record<string, unknown>): SimulationConfig {
    return {
      numChargepoints: Number(body.numChargepoints ?? DEFAULT_NUM_CHARGEPOINTS),
      chargingPowerKw: Number(body.chargingPowerKw ?? DEFAULT_CHARGING_POWER_KW),
      consumptionKwhPer100km: Number(body.consumptionKwhPer100km ?? DEFAULT_CONSUMPTION_KWH_PER_100KM),
      arrivalMultiplier: Number(body.arrivalMultiplier ?? DEFAULT_ARRIVAL_MULTIPLIER),
      seed: body.seed !== undefined ? Number(body.seed) : undefined,
    };
  }

  router.get("/health", (_req: Request, res: Response) => {
    res.json({ status: "ok" });
  });

  router.post("/simulate", (req: Request, res: Response) => {
    try {
      const config = parseConfig(req.body);
      const result = simulate(config);

      const includeTicks = req.query.includeTicks === "true";

      if (includeTicks) {
        res.json(result);
      } else {
        const { powerPerTick: _unused, ...summary } = result;
        res.json(summary);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Simulation failed";
      res.status(500).json({ error: message });
    }
  });

  router.post("/simulate/sweep", (req: Request, res: Response) => {
    try {
      const config = parseConfig(req.body);
      const maxChargepoints = Number(req.body.maxChargepoints ?? 30);
      const { numChargepoints: _unused, ...baseConfig } = config;
      const results = simulateSweep(baseConfig, maxChargepoints);
      res.json(results);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Sweep failed";
      res.status(500).json({ error: message });
    }
  });
