export interface SimulationConfig {
  numChargepoints: number;
  chargingPowerKw: number;
  consumptionKwhPer100km: number;
  arrivalMultiplier: number;
}

export interface SavedConfig extends SimulationConfig {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface SimulationResult {
  id: string;
  configId: string;
  totalEnergyKwh: number;
  theoreticalMaxPowerKw: number;
  actualMaxPowerKw: number;
  concurrencyFactor: number;
  totalChargingEvents: number;
  chargingValuesPerDay: number[];
  createdAt: string;
}
