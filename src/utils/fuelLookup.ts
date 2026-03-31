import type { FuelType } from '@/types/fuel';
import { FUEL_CONSUMPTION_LIMITS } from '@/data/fuelConsumptionLimits';

export function lookupFuelConsumption(
  vehicleType: string,
  fuelType: FuelType,
  weight: number,
): number | null {
  for (const entry of FUEL_CONSUMPTION_LIMITS) {
    if (entry.vehicleType !== vehicleType || entry.fuelType !== fuelType) continue;

    const lowerOk = entry.lowInclusive ? weight >= entry.weightLow : weight > entry.weightLow;
    const upperOk = entry.weightHigh === Infinity
      ? true
      : entry.highInclusive
        ? weight <= entry.weightHigh
        : weight < entry.weightHigh;

    if (lowerOk && upperOk) {
      if (entry.formula) return entry.formula(weight);
      return entry.value;
    }
  }
  return null;
}
