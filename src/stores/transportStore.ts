import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TransportMode } from '@/types/hydrogen';
import type { FuelType } from '@/types/fuel';

interface TransportState {
  transportMode: TransportMode;
  fuelType: FuelType;
  fuelConsumption: number;
  singleH2Amount: number;
  result: number | null;
  setTransportMode: (v: TransportMode) => void;
  setFuelType: (v: FuelType) => void;
  setFuelConsumption: (v: number) => void;
  setSingleH2Amount: (v: number) => void;
  setResult: (v: number | null) => void;
}

export const useTransportStore = create<TransportState>()(
  persist(
    (set) => ({
      transportMode: '运氢车运输',
      fuelType: '柴油',
      fuelConsumption: 30,
      singleH2Amount: 0.4,
      result: null,
      setTransportMode: (v) => set({ transportMode: v }),
      setFuelType: (v) => set({ fuelType: v }),
      setFuelConsumption: (v) => set({ fuelConsumption: v }),
      setSingleH2Amount: (v) => set({ singleH2Amount: v }),
      setResult: (v) => set({ result: v }),
    }),
    { name: 'transport-store' },
  ),
);
