export interface SimulationConfig {
  numChargepoints: number;
  chargingPowerKw: number;
  consumptionKwhPer100km: number;
  arrivalMultiplier: number;
  seed?: number;
}

export interface SimulationResult {
  totalEnergyKwh: number;
  theoreticalMaxPowerKw: number;
  actualMaxPowerKw: number;
  concurrencyFactor: number;
  totalChargingEvents: number;
  powerPerTick: number[];
}

export interface SimulationSummary {
  totalEnergyKwh: number;
  theoreticalMaxPowerKw: number;
  actualMaxPowerKw: number;
  concurrencyFactor: number;
  totalChargingEvents: number;
}

export interface SweepEntry {
  numChargepoints: number;
  totalEnergyKwh: number;
  theoreticalMaxPowerKw: number;
  actualMaxPowerKw: number;
  concurrencyFactor: number;
  totalChargingEvents: number;
}
