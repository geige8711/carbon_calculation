export interface ProductionResult {
  ej: number;
}

export interface RefuelingResult {
  er: number;
}

export interface VehicleResult {
  baselineEF: number;
  h2EF: number;
  reduction: number;
  carbonCredit: number;
}

export interface AdvancedResult {
  sourceEjList: string;
  et: number;
  er: number;
  eH2: number;
}
