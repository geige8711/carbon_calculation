import type { FuelType, FuelParams } from '@/types/fuel';

export const UPSTREAM_FACTORS: Partial<Record<FuelType, number>> = {
  '汽油': 0.63396,
  '柴油': 0.65086,
  // 天然气（LNG）/甲醇 上车前因子随产源差异较大，留空由用户根据来源填写
};

export const FUEL_PARAMS: Record<FuelType, FuelParams> = {
  '汽油': { NCV: 43.070, CC: 18.9e-3, OF: 0.98 },
  '柴油': { NCV: 42.652, CC: 20.2e-3, OF: 0.98 },
  '天然气（LNG）': { enduseEF: 2.665872 },
  '甲醇': { enduseEF: 1.3514886 },
};

export const FUEL_DENSITY: Record<FuelType, number> = {
  '汽油': 0.74,
  '柴油': 0.84,
  '天然气（LNG）': 0.43,
  '甲醇': 0.7918,
};

export const DIESEL_DENSITY = FUEL_DENSITY['柴油'];
export const GASOLINE_DENSITY = FUEL_DENSITY['汽油'];

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
