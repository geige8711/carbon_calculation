export type FuelType = '汽油' | '柴油';

export interface FuelParams {
  NCV: number;  // GJ/t
  CC: number;   // t C/GJ
  OF: number;   // oxidation factor
}

export interface FuelConsumptionLimit {
  vehicleType: string;
  weightLow: number;
  weightHigh: number;
  lowInclusive: boolean;
  highInclusive: boolean;
  fuelType: FuelType;
  value: number | null;
  formula: ((TM: number) => number) | null;
}

export type VehicleCategory = '轻型商用车N1' | '轻型商用车M2' | '货车' | '半挂牵引车' | '客车' | '城市客车';
