import { Router, Request, Response } from "express";
import prisma from "../prisma";

interface SimulationServiceResponse {
  totalEnergyKwh: number;
  theoreticalMaxPowerKw: number;
  actualMaxPowerKw: number;
  concurrencyFactor: number;
  totalChargingEvents: number;
  powerPerTick: number[];
}

const router = Router();

const SIMULATION_SERVICE_URL =
  process.env.SIMULATION_SERVICE_URL || "http://localhost:3001";

// POST /api/simulations/configs - create a config
router.post("/configs", async (req: Request, res: Response) => {
  try {
    const {
      name,
      numChargepoints,
      chargingPowerKw,
      consumptionKwhPer100km,
      arrivalMultiplier,
    } = req.body;

    const config = await prisma.simulationConfig.create({
      data: {
        ...(name !== undefined && { name }),
        ...(numChargepoints !== undefined && { numChargepoints }),
        ...(chargingPowerKw !== undefined && { chargingPowerKw }),
        ...(consumptionKwhPer100km !== undefined && { consumptionKwhPer100km }),
        ...(arrivalMultiplier !== undefined && { arrivalMultiplier }),
      },
    });

    res.status(201).json(config);
  } catch (error) {
    console.error("Error creating config:", error);
    res.status(500).json({ error: "Failed to create simulation config" });
  }
});

// GET /api/simulations/configs - list all configs
router.get("/configs", async (_req: Request, res: Response) => {
  try {
    const configs = await prisma.simulationConfig.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(configs);
  } catch (error) {
    console.error("Error listing configs:", error);
    res.status(500).json({ error: "Failed to list simulation configs" });
  }
});

// GET /api/simulations/configs/:id - get one config
router.get("/configs/:id", async (req: Request, res: Response) => {
  try {
    const config = await prisma.simulationConfig.findUnique({
      where: { id: req.params.id },
      include: { results: true },
    });

    if (!config) {
      res.status(404).json({ error: "Config not found" });
      return;
    }

    res.json(config);
  } catch (error) {
    console.error("Error fetching config:", error);
    res.status(500).json({ error: "Failed to fetch simulation config" });
  }
});

// PUT /api/simulations/configs/:id - update a config
router.put("/configs/:id", async (req: Request, res: Response) => {
  try {
    const {
      name,
      numChargepoints,
      chargingPowerKw,
      consumptionKwhPer100km,
      arrivalMultiplier,
    } = req.body;

    const config = await prisma.simulationConfig.update({
      where: { id: req.params.id },
      data: {
        ...(name !== undefined && { name }),
        ...(numChargepoints !== undefined && { numChargepoints }),
        ...(chargingPowerKw !== undefined && { chargingPowerKw }),
        ...(consumptionKwhPer100km !== undefined && { consumptionKwhPer100km }),
        ...(arrivalMultiplier !== undefined && { arrivalMultiplier }),
      },
    });

    res.json(config);
  } catch (error) {
    console.error("Error updating config:", error);
    res.status(500).json({ error: "Failed to update simulation config" });
  }
});

// DELETE /api/simulations/configs/:id - delete a config (cascade deletes results)
router.delete("/configs/:id", async (req: Request, res: Response) => {
  try {
    await prisma.simulationConfig.delete({
      where: { id: req.params.id },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting config:", error);
    res.status(500).json({ error: "Failed to delete simulation config" });
  }
});

// POST /api/simulations/configs/:id/run - run simulation for this config
router.post("/configs/:id/run", async (req: Request, res: Response) => {
  try {
    const config = await prisma.simulationConfig.findUnique({
      where: { id: req.params.id },
    });

    if (!config) {
      res.status(404).json({ error: "Config not found" });
      return;
    }

    const simulationResponse = await fetch(
      `${SIMULATION_SERVICE_URL}/api/simulate?includeTicks=true`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          numChargepoints: config.numChargepoints,
          chargingPowerKw: config.chargingPowerKw,
          consumptionKwhPer100km: config.consumptionKwhPer100km,
          arrivalMultiplier: config.arrivalMultiplier,
        }),
      }
    );
    if (!simulationResponse.ok) {
      const errorText = await simulationResponse.text();
      console.error("Simulation service error:", errorText);
      res
        .status(502)
        .json({ error: "Simulation service returned an error", details: errorText });
      return;
    }

    const simulationData: SimulationServiceResponse =
      (await simulationResponse.json()) as SimulationServiceResponse;

    // Extract exemplary day by averaging each 15-min interval across 365 days
    const powerPerTick: number[] = simulationData.powerPerTick || [];
    const INTERVALS_PER_DAY = 96;
    const DAYS_IN_YEAR = 365;
    const chargingValuesPerDay: number[] = new Array(INTERVALS_PER_DAY).fill(0);

    for (let interval = 0; interval < INTERVALS_PER_DAY; interval++) {
      let sum = 0;
      for (let day = 0; day < DAYS_IN_YEAR; day++) {
        const index = day * INTERVALS_PER_DAY + interval;
        sum += powerPerTick[index] ?? 0;
      }
      chargingValuesPerDay[interval] = sum / DAYS_IN_YEAR;
    }

    const result = await prisma.simulationResult.create({
      data: {
        configId: config.id,
        totalEnergyKwh: simulationData.totalEnergyKwh,
        theoreticalMaxPowerKw: simulationData.theoreticalMaxPowerKw,
        actualMaxPowerKw: simulationData.actualMaxPowerKw,
        concurrencyFactor: simulationData.concurrencyFactor,
        totalChargingEvents: simulationData.totalChargingEvents,
        chargingValuesPerDay,
      },
    });

    res.status(201).json(result);
  } catch (error) {
    console.error("Error running simulation:", error);
    res.status(500).json({ error: "Failed to run simulation" });
  }
});

// GET /api/simulations/configs/:id/results - get results for a config
router.get("/configs/:id/results", async (req: Request, res: Response) => {
  try {
    const results = await prisma.simulationResult.findMany({
      where: { configId: req.params.id },
      orderBy: { createdAt: "desc" },
    });

    res.json(results);
  } catch (error) {
    console.error("Error fetching results:", error);
    res.status(500).json({ error: "Failed to fetch simulation results" });
  }
});

// GET /api/simulations/results/:id - get a specific result
router.get("/results/:id", async (req: Request, res: Response) => {
  try {
    const result = await prisma.simulationResult.findUnique({
      where: { id: req.params.id },
      include: { config: true },
    });

    if (!result) {
      res.status(404).json({ error: "Result not found" });
      return;
    }

    res.json(result);
  } catch (error) {
    console.error("Error fetching result:", error);
    res.status(500).json({ error: "Failed to fetch simulation result" });
  }
});

export default router;
