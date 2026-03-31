import type { FuelType, FuelParams } from '@/types/fuel';

export const UPSTREAM_FACTORS: Record<FuelType, number> = {
  '汽油': 0.63396,
  '柴油': 0.65086,
};

export const FUEL_PARAMS: Record<FuelType, FuelParams> = {
  '汽油': { NCV: 43.070, CC: 18.9e-3, OF: 0.98 },
  '柴油': { NCV: 42.652, CC: 20.2e-3, OF: 0.98 },
};

export const DIESEL_DENSITY = 0.84;
export const GASOLINE_DENSITY = 0.74;

export const H2_CONSUMPTION: Record<string, number> = {
  '乘用车': 0.8e-5,
  '客车': 5e-5,
  '4.5吨冷藏车': 2.8e-5,
  '4.5吨货车': 2.3e-5,
  '18吨货车': 5e-5,
  '49吨半挂牵引车': 10e-5,
};

export const HEAT_FACTOR = 0.0561e-3;
export const DEFAULT_H2_LOSS_RATIO = 0.004;
