import { describe, it, expect } from "vitest";
import { simulate, simulateSweep } from "./simulator.js";
import {
  DEFAULT_NUM_CHARGEPOINTS,
  DEFAULT_CHARGING_POWER_KW,
  DEFAULT_CONSUMPTION_KWH_PER_100KM,
  DEFAULT_ARRIVAL_MULTIPLIER,
  TOTAL_TICKS,
} from "./constants.js";

const defaultConfig = {
  numChargepoints: DEFAULT_NUM_CHARGEPOINTS,
  chargingPowerKw: DEFAULT_CHARGING_POWER_KW,
  consumptionKwhPer100km: DEFAULT_CONSUMPTION_KWH_PER_100KM,
  arrivalMultiplier: DEFAULT_ARRIVAL_MULTIPLIER,
  seed: 42,
};

describe("simulate", () => {
  it("returns correct structure", () => {
    const result = simulate(defaultConfig);
    expect(result).toHaveProperty("totalEnergyKwh");
    expect(result).toHaveProperty("theoreticalMaxPowerKw");
    expect(result).toHaveProperty("actualMaxPowerKw");
    expect(result).toHaveProperty("concurrencyFactor");
    expect(result).toHaveProperty("totalChargingEvents");
    expect(result).toHaveProperty("powerPerTick");
  });

  it("returns powerPerTick with 35040 entries", () => {
    const result = simulate(defaultConfig);
    expect(result.powerPerTick).toHaveLength(TOTAL_TICKS);
  });

  it("computes correct theoretical max power", () => {
    const result = simulate(defaultConfig);
    expect(result.theoreticalMaxPowerKw).toBe(
      DEFAULT_NUM_CHARGEPOINTS * DEFAULT_CHARGING_POWER_KW,
    );
  });

  it("actual max power is within expected range (77-121 kW for 20 CPs)", () => {
    const result = simulate(defaultConfig);
    expect(result.actualMaxPowerKw).toBeGreaterThanOrEqual(77);
    expect(result.actualMaxPowerKw).toBeLessThanOrEqual(121);
  });

  it("concurrency factor is within expected range (35-55%)", () => {
    const result = simulate(defaultConfig);
    expect(result.concurrencyFactor).toBeGreaterThanOrEqual(0.35);
    expect(result.concurrencyFactor).toBeLessThanOrEqual(0.55);
  });

  it("total energy is positive", () => {
    const result = simulate(defaultConfig);
    expect(result.totalEnergyKwh).toBeGreaterThan(0);
  });

  it("produces deterministic results with same seed", () => {
    const r1 = simulate(defaultConfig);
    const r2 = simulate(defaultConfig);
    expect(r1.totalEnergyKwh).toBe(r2.totalEnergyKwh);
    expect(r1.actualMaxPowerKw).toBe(r2.actualMaxPowerKw);
    expect(r1.totalChargingEvents).toBe(r2.totalChargingEvents);
  });

  it("produces different results with different seeds", () => {
    const r1 = simulate({ ...defaultConfig, seed: 1 });
    const r2 = simulate({ ...defaultConfig, seed: 2 });
    expect(r1.totalEnergyKwh).not.toBe(r2.totalEnergyKwh);
  });

  it("handles single chargepoint", () => {
    const result = simulate({ ...defaultConfig, numChargepoints: 1 });
    expect(result.theoreticalMaxPowerKw).toBe(DEFAULT_CHARGING_POWER_KW);
    expect(result.actualMaxPowerKw).toBeLessThanOrEqual(DEFAULT_CHARGING_POWER_KW);
    expect(result.totalEnergyKwh).toBeGreaterThan(0);
  });

  it("higher arrival multiplier increases energy consumed", () => {
    const low = simulate({ ...defaultConfig, arrivalMultiplier: 0.5 });
    const high = simulate({ ...defaultConfig, arrivalMultiplier: 1.5 });
    expect(high.totalEnergyKwh).toBeGreaterThan(low.totalEnergyKwh);
  });

  it("actual max never exceeds theoretical max", () => {
    const result = simulate(defaultConfig);
    expect(result.actualMaxPowerKw).toBeLessThanOrEqual(result.theoreticalMaxPowerKw);
  });
});

describe("simulateSweep", () => {
  it("returns correct number of entries", () => {
    const results = simulateSweep({ ...defaultConfig }, 5);
    expect(results).toHaveLength(5);
    expect(results[0].numChargepoints).toBe(1);
    expect(results[4].numChargepoints).toBe(5);
  });

  it("theoretical max power scales linearly with chargepoints", () => {
    const results = simulateSweep({ ...defaultConfig }, 5);
    for (const r of results) {
      expect(r.theoreticalMaxPowerKw).toBe(r.numChargepoints * DEFAULT_CHARGING_POWER_KW);
    }
  });
});
