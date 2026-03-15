// Constants defined in the problem pdf file, used by the simulator.

/**
 * T1: Hourly arrival probabilities for EVs at a chargepoint.
 * Index = hour of day (0–23). Value = probability of an EV arriving during that hour.
 */
export const ARRIVAL_PROBABILITIES: readonly number[] = [
  0.0094, // 00:00 - 01:00
  0.0094, // 01:00 - 02:00
  0.0094, // 02:00 - 03:00
  0.0094, // 03:00 - 04:00
  0.0094, // 04:00 - 05:00
  0.0094, // 05:00 - 06:00
  0.0094, // 06:00 - 07:00
  0.0094, // 07:00 - 08:00
  0.0283, // 08:00 - 09:00
  0.0283, // 09:00 - 10:00
  0.0566, // 10:00 - 11:00
  0.0566, // 11:00 - 12:00
  0.0566, // 12:00 - 13:00
  0.0755, // 13:00 - 14:00
  0.0755, // 14:00 - 15:00
  0.0755, // 15:00 - 16:00
  0.1038, // 16:00 - 17:00
  0.1038, // 17:00 - 18:00
  0.1038, // 18:00 - 19:00
  0.0472, // 19:00 - 20:00
  0.0472, // 20:00 - 21:00
  0.0472, // 21:00 - 22:00
  0.0094, // 22:00 - 23:00
  0.0094, // 23:00 - 24:00
];

/**
 * T2: Charging demand distribution.
 * Each entry: [probability, demand in km].
 * 0 km = "None" (EV arrives but does not consume, just blocks another arrival for a single tick on its spot).
 */
export const CHARGING_DEMAND_DISTRIBUTION: readonly [number, number][] = [
  [0.3431, 0],     // None (doesn't charge)
  [0.0490, 5],     // 5 km
  [0.0980, 10],    // 10 km
  [0.1176, 20],    // 20 km
  [0.0882, 30],    // 30 km
  [0.1176, 50],    // 50 km
  [0.1078, 100],   // 100 km
  [0.0490, 200],   // 200 km
  [0.0294, 300],   // 300 km
];

export const TICKS_PER_HOUR = 4;
export const TICKS_PER_DAY = 96;
export const HOURS_PER_TICK = 0.25;
export const TOTAL_TICKS = 35040; // 365 * 24 * 4 (because 4 ticks per hour)

export const DEFAULT_NUM_CHARGEPOINTS = 20;
export const DEFAULT_CHARGING_POWER_KW = 11;
export const DEFAULT_CONSUMPTION_KWH_PER_100KM = 18;
export const DEFAULT_ARRIVAL_MULTIPLIER = 1.0;
