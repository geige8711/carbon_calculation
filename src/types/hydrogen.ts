export type TransportMode = '管道运输' | '运氢车运输';

export interface FuelEntry {
  name: string;
  consumption: number;
  carbonContent: number;     // 公式1：含碳量 tC/t
  oxidationRate: number;     // 公式1：碳氧化率
  ncv: number;               // 公式2：低位发热量 TJ/t 或 TJ/Nm³
  ef: number;                // 公式2：碳排放因子 tCO₂/TJ
  unit: 't' | 'Nm³';         // 消耗量单位
}

export interface RawMaterialEntry {
  name: string;
  amount: number;
  factor: number;
}

export interface ProductionInput {
  production: number;
  fuels: FuelEntry[];
  electricityAmount: number;
  electricityFactor: number | null;
  useCustomElecFactor: boolean;
  customElecFactor: number;
  electricityRegion: string;
  heatAmount: number;
  heatFactor: number;
  rawMaterials: RawMaterialEntry[];
}

export interface RefuelingInput {
  monthlyElec: number;
  monthlyH2: number;
  electricityRegion: string;
  useCustomFactor: boolean;
  customFactor: number;
}

export interface H2Source {
  name: string;
  ej: number;
  distance: number;
  ratio: number;
}

export interface TransportParams {
  mode: TransportMode;
  truckFuelCons: number;
  truckFuelEF: number;
  singleH2Amount: number;
}

export interface AdvancedInput {
  sources: H2Source[];
  transport: TransportParams;
  refueling: RefuelingInput;
  lossRatio: number;
}
