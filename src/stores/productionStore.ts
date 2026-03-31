import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FuelEntry, RawMaterialEntry } from '@/types/hydrogen';
import { HEAT_FACTOR } from '@/data/emissionFactors';

interface ProductionState {
  productionAmount: number;
  fuels: FuelEntry[];
  rawMaterials: RawMaterialEntry[];
  electricityAmount: number;
  electricityRegion: string;
  useCustomElecFactor: boolean;
  customElecFactor: number;
  heatAmount: number;
  heatFactor: number;
  result: number | null;
  setProductionAmount: (v: number) => void;
  setFuels: (f: FuelEntry[]) => void;
  setRawMaterials: (r: RawMaterialEntry[]) => void;
  setElectricityAmount: (v: number) => void;
  setElectricityRegion: (r: string) => void;
  setUseCustomElecFactor: (v: boolean) => void;
  setCustomElecFactor: (v: number) => void;
  setHeatAmount: (v: number) => void;
  setHeatFactor: (v: number) => void;
  setResult: (v: number | null) => void;
}

export const useProductionStore = create<ProductionState>()(
  persist(
    (set) => ({
      productionAmount: 1000,
      fuels: [{ name: '', consumption: 0, carbonContent: 0.75, oxidationRate: 0.99 }],
      rawMaterials: [
        { name: '烧碱（30%）', amount: 0, factor: 11.555 },
        { name: '新鲜水', amount: 0, factor: 0.0006 },
      ],
      electricityAmount: 0,
      electricityRegion: '全国平均',
      useCustomElecFactor: false,
      customElecFactor: 0,
      heatAmount: 0,
      heatFactor: HEAT_FACTOR,
      result: null,
      setProductionAmount: (v) => set({ productionAmount: v }),
      setFuels: (f) => set({ fuels: f }),
      setRawMaterials: (r) => set({ rawMaterials: r }),
      setElectricityAmount: (v) => set({ electricityAmount: v }),
      setElectricityRegion: (r) => set({ electricityRegion: r }),
      setUseCustomElecFactor: (v) => set({ useCustomElecFactor: v }),
      setCustomElecFactor: (v) => set({ customElecFactor: v }),
      setHeatAmount: (v) => set({ heatAmount: v }),
      setHeatFactor: (v) => set({ heatFactor: v }),
      setResult: (v) => set({ result: v }),
    }),
    { name: 'production-store' },
  ),
);
