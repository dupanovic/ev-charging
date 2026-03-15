/* T1 solution. 
*
* Even though the problem says that the frontend and the backend do not have to be connected to the
* simulator, I am using the simulate() method from here to compute and store the actual results.
*/ 

import {
  ARRIVAL_PROBABILITIES,
  CHARGING_DEMAND_DISTRIBUTION,
  TICKS_PER_HOUR,
  TICKS_PER_DAY,
  HOURS_PER_TICK,
  TOTAL_TICKS,
} from "./constants.js";
import { createRng } from "./random.js";
import type { SimulationConfig, SimulationResult, SweepEntry } from "./types.js";

interface ChargepointState {
  energyRemaining: number;
  blockedTicks: number;
}

/**
 * Build a cumulative distribution from the T2 demand table
 * for efficient weighted sampling.
 */
function buildCumulativeDemand(): { cdf: number[]; kmValues: number[] } {
  const cdf: number[] = [];
  const kmValues: number[] = [];
  let cumulative = 0;

  for (const [prob, km] of CHARGING_DEMAND_DISTRIBUTION) {
    cumulative += prob;
    cdf.push(cumulative);
    kmValues.push(km);
  }

  // Normalize to handle floating-point drift (should sum to ~1.0)
  const total = cumulative;
  for (let i = 0; i < cdf.length; i++) {
    cdf[i] /= total;
  }

  return { cdf, kmValues };
}

const demandDist = buildCumulativeDemand();

/**
 * Sample a charging demand in km from the T2 distribution.
 * 
 * There is a large chance for vehicles to demand 0km, likely meant representing non-EV or charged arrivals
 * that draw no power, but block a chargepoint for a single tick.
 */
function sampleDemandKm(random: () => number): number {
  const r = random();
  for (let i = 0; i < demandDist.cdf.length; i++) {
    if (r < demandDist.cdf[i]) {
      return demandDist.kmValues[i];
    }
  }
  return demandDist.kmValues[demandDist.kmValues.length - 1];
}

/**
 * Run the EV chargepoint simulation.
 * 
 * Iterate for each tick, and in each iteration also iterate over each chargepoint.
 * This is because arrival possibilities and charging state updates happen at the chargepoint level.
 *
 * I wasn't sure whether the T1 table values represented per-tick probabilities or hourly probabilities.
 * Given the expected value range it seems like they are intended as per-tick probabilities, so that's how the simulation treats them:
 * each 15-minute tick within the given hour uses the table value directly.
 */
export function simulate(config: SimulationConfig): SimulationResult {
  const {
    numChargepoints,
    chargingPowerKw,
    consumptionKwhPer100km,
    arrivalMultiplier,
    seed,
  } = config;

  const random = createRng(seed);

  // Precompute per-tick arrival probabilities for each hour
  const tickArrivalProbs = ARRIVAL_PROBABILITIES.map((p) =>
    Math.min(p * arrivalMultiplier, 1)
  );

  // Energy delivered per tick at full power
  const energyPerTick = chargingPowerKw * HOURS_PER_TICK;

  // Initialize chargepoints
  const chargepoints: ChargepointState[] = Array.from(
    { length: numChargepoints },
    () => ({ energyRemaining: 0, blockedTicks: 0 })
  );

  const powerPerTick = new Float64Array(TOTAL_TICKS);
  let totalEnergyKwh = 0;
  let peakPowerKw = 0;
  let totalChargingEvents = 0;

  for (let tick = 0; tick < TOTAL_TICKS; tick++) {
    // This maps hh:00, hh:15, hh:30, hh:45 to the same hourly probability from the T1 table
    const hourOfDay = Math.floor((tick % TICKS_PER_DAY) / TICKS_PER_HOUR);
    const arrivalProb = tickArrivalProbs[hourOfDay];

    let totalPowerThisTick = 0;

    for (let cp = 0; cp < numChargepoints; cp++) {
      const state = chargepoints[cp];

      if (state.energyRemaining > 0) { // Chargepoint will charge during this tick
        const energy = Math.min(energyPerTick, state.energyRemaining);
        state.energyRemaining -= energy;
        const power = energy / HOURS_PER_TICK;
        totalPowerThisTick += power;
        totalEnergyKwh += energy;
      } else if (state.blockedTicks > 0) { // Chargepoint has a 0-demand arrival this tick
        state.blockedTicks--;
      } else { // Chargepoint is free, check if a new EV arrives and start charging it
        if (random() < arrivalProb) {
          const demandKm = sampleDemandKm(random);
          const demandKwh = (demandKm * consumptionKwhPer100km) / 100;

          totalChargingEvents++;

          if (demandKwh === 0) { // 0-demand arrival, block the chargepoint
            state.blockedTicks = 1;
          } else { // not a 0-demand arrival, start charging
            state.energyRemaining = demandKwh;
            const energy = Math.min(energyPerTick, state.energyRemaining);
            state.energyRemaining -= energy;
            const power = energy / HOURS_PER_TICK;
            totalPowerThisTick += power;
            totalEnergyKwh += energy;
          }
        }
      }
    }

    powerPerTick[tick] = totalPowerThisTick;
    if (totalPowerThisTick > peakPowerKw) {
      peakPowerKw = totalPowerThisTick;
    }
  }

  const theoreticalMaxPowerKw = numChargepoints * chargingPowerKw;

  return {
    totalEnergyKwh: Math.round(totalEnergyKwh * 100) / 100,
    theoreticalMaxPowerKw,
    actualMaxPowerKw: Math.round(peakPowerKw * 100) / 100,
    concurrencyFactor:
      Math.round((peakPowerKw / theoreticalMaxPowerKw) * 10000) / 10000,
    totalChargingEvents,
    powerPerTick: Array.from(powerPerTick),
  };
}

/**
 * Run the simulation for 1..maxChargepoints and return concurrency factor per count.
 */
export function simulateSweep(
  baseConfig: Omit<SimulationConfig, "numChargepoints">,
  maxChargepoints: number = 30
): SweepEntry[] {
  const results: SweepEntry[] = [];

  for (let n = 1; n <= maxChargepoints; n++) {
    const result = simulate({ ...baseConfig, numChargepoints: n });
    results.push({
      numChargepoints: n,
      totalEnergyKwh: result.totalEnergyKwh,
      theoreticalMaxPowerKw: result.theoreticalMaxPowerKw,
      actualMaxPowerKw: result.actualMaxPowerKw,
      concurrencyFactor: result.concurrencyFactor,
      totalChargingEvents: result.totalChargingEvents,
    });
  }

  return results;
}
