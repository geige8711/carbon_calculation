import type { FuelType } from '@/types/fuel';
import type { TransportMode } from '@/types/hydrogen';
import { FUEL_PARAMS } from '@/data/emissionFactors';

export function calculateEndUseEmissionFactor(fuelType: FuelType): number {
  const params = FUEL_PARAMS[fuelType];
  return params.NCV * params.CC * params.OF * (44 / 12);
}

export function calculateBaselineEF(
  upstreamFactor: number,
  enduseFactor: number,
  sfcTPerKm: number,
): number {
  return (upstreamFactor + enduseFactor) * sfcTPerKm;
}

export function lPer100kmToTPerKm(lPer100km: number, densityKgPerL: number): number {
  return (lPer100km * densityKgPerL) / 100 / 1000;
}

export function calculateHydrogenProductionFactor(params: {
  production: number;
  fuels?: { consumption: number; carbonContent: number; oxidationRate: number }[];
  electricityAmount?: number;
  electricityFactor?: number;
  heatAmount?: number;
  heatFactor?: number;
  rawMaterials?: { amount: number; factor: number }[];
}): number {
  if (params.production <= 0) throw new Error('氢气年产量必须大于0');

  let totalEmission = 0;

  if (params.fuels) {
    for (const fuel of params.fuels) {
      if (fuel.consumption > 0) {
        totalEmission += fuel.consumption * fuel.carbonContent * fuel.oxidationRate * (44 / 12);
      }
    }
  }

  if (params.electricityAmount && params.electricityAmount > 0 && params.electricityFactor != null) {
    totalEmission += params.electricityAmount * params.electricityFactor;
  }

  if (params.heatAmount && params.heatAmount > 0 && params.heatFactor != null) {
    totalEmission += params.heatAmount * params.heatFactor;
  }

  if (params.rawMaterials) {
    for (const mat of params.rawMaterials) {
      if (mat.amount > 0 && mat.factor > 0) {
        totalEmission += mat.amount * mat.factor;
      }
    }
  }

  return totalEmission / params.production;
}

export function calculateTransportFactor(
  mode: TransportMode,
  truckFuelCons?: number,
  truckFuelEF?: number,
  singleH2Amount?: number,
): number {
  if (mode === '管道运输') return 0;
  if (truckFuelCons == null || truckFuelEF == null || singleH2Amount == null) {
    throw new Error('车辆运输必须提供燃料消耗量、燃料因子和单次运氢量');
  }
  if (singleH2Amount <= 0) throw new Error('单次运氢量必须大于0');
  return (truckFuelCons * truckFuelEF) / singleH2Amount;
}

export function calculateRefuelingFactor(
  monthlyElec: number,
  elecFactor: number,
  monthlyH2: number,
): number {
  if (monthlyH2 <= 0) throw new Error('月加氢量必须大于0');
  return (monthlyElec * elecFactor) / monthlyH2;
}

export function calculateWeightedH2Emission(
  sourcesData: { ej: number; distance: number; ratio: number }[],
  et: number,
  er: number,
  lossRatio: number,
): number {
  let totalRatio = 0;
  let weightedSumEmission = 0;

  for (const { ej, distance, ratio } of sourcesData) {
    if (ratio > 0) {
      totalRatio += ratio;
      const sourceEmission = ej + et * 2 * distance;
      weightedSumEmission += sourceEmission * ratio;
    }
  }

  if (totalRatio === 0) throw new Error('氢源比例总和必须大于0');

  const avgEmissionWithoutLoss = weightedSumEmission / totalRatio;
  const eH2WithoutLoss = avgEmissionWithoutLoss + er;
  return eH2WithoutLoss * (1 + lossRatio);
}
