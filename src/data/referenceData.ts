export type FuelRefEntry = {
  // 公式1（含碳量法）
  default_cc?: number;       // tC/t
  default_of?: number;       // 碳氧化率
  // 公式2（发热量法）
  default_ncv?: number;      // TJ/t 或 TJ/Nm³
  default_ef?: number;       // tCO₂/TJ
  unit?: 't' | 'Nm³';        // 消耗量单位
};

export const FUEL_REF_DATA: Record<string, FuelRefEntry> = {
  '丙烷': { default_cc: 0.817, default_of: 0.99, unit: 't' },
  '电煤': { default_ncv: 0.01764, default_ef: 96.2, unit: 't' },
  '天然气': { default_ncv: 0.000035611, default_ef: 57.2, unit: 'Nm³' },
  '液化天然气': { default_ncv: 0.05216, default_ef: 56.8, unit: 't' },
};

export const RAW_MATERIAL_REF_DATA: Record<string, { default_factor: number }> = {
  // 既有消耗品
  '烧碱（30%）': { default_factor: 11.555 },
  '新鲜水': { default_factor: 0.0006 },
  '循环水': { default_factor: 0.0002 },
  '除盐水': { default_factor: 0.0037 },
  '除氧水': { default_factor: 0.0243 },
  '氮气': { default_factor: 90.8e-6 },
  '压缩空气': { default_factor: 0.0001 },
  // 工业原料补充
  '碳酸钙(CaCO₃)': { default_factor: 0.44 },
  '碳酸镁(MgCO₃)': { default_factor: 0.522 },
  '碳酸钠或纯碱(Na₂CO₃)': { default_factor: 0.415 },
  '碳酸氢钠(NaHCO₃)': { default_factor: 0.524 },
  '菱铁矿或碳酸铁(FeCO₃)': { default_factor: 0.38 },
  '菱锰矿或碳酸锰(MnCO₃)': { default_factor: 0.383 },
  '碳酸钡(BaCO₃)': { default_factor: 0.223 },
  '碳酸锂(Li₂CO₃)': { default_factor: 0.595 },
  '碳酸钾(K₂CO₃)': { default_factor: 0.318 },
  '碳酸锶(SrCO₃)': { default_factor: 0.298 },
  '白云石或碳酸镁钙(CaMg(CO₃)₂)': { default_factor: 0.477 },
  '硅酸盐水泥熟料': { default_factor: 0.5274 },
  '白色硅酸盐水泥熟料': { default_factor: 0.5479 },
  '硫(铁)铝酸盐水泥熟料': { default_factor: 0.3532 },
  '铝酸盐水泥熟料': { default_factor: 0.1981 },
  '粗钢（转炉）': { default_factor: 1.6 },
  '未锻轧铝(原铝)': { default_factor: 1.69 },
};

export function getFuelDefaults(fuelName: string): FuelRefEntry {
  return FUEL_REF_DATA[fuelName] ?? { default_cc: 0.75, default_of: 0.99, unit: 't' };
}

export function getRawMaterialDefaults(materialName: string): number {
  const data = RAW_MATERIAL_REF_DATA[materialName];
  return data ? data.default_factor : 0;
}

export const FUEL_REF_NAMES = Object.keys(FUEL_REF_DATA);
export const RAW_MATERIAL_NAMES = Object.keys(RAW_MATERIAL_REF_DATA);
