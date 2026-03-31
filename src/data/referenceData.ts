export const FUEL_REF_DATA: Record<string, { default_cc: number; default_of: number }> = {
  '丙烷': { default_cc: 0.817, default_of: 0.99 },
};

export const RAW_MATERIAL_REF_DATA: Record<string, { default_factor: number }> = {
  '烧碱（30%）': { default_factor: 11.555 },
  '新鲜水': { default_factor: 0.0006 },
  '循环水': { default_factor: 0.0002 },
  '除盐水': { default_factor: 0.0037 },
  '除氧水': { default_factor: 0.0243 },
  '氮气': { default_factor: 90.8e-6 },
  '压缩空气': { default_factor: 0.0001 },
};

export function getFuelDefaults(fuelName: string): [number, number] {
  const data = FUEL_REF_DATA[fuelName];
  if (data) return [data.default_cc, data.default_of];
  return [0.75, 0.99];
}

export function getRawMaterialDefaults(materialName: string): number {
  const data = RAW_MATERIAL_REF_DATA[materialName];
  return data ? data.default_factor : 0;
}

export const FUEL_REF_NAMES = Object.keys(FUEL_REF_DATA);
export const RAW_MATERIAL_NAMES = Object.keys(RAW_MATERIAL_REF_DATA);
