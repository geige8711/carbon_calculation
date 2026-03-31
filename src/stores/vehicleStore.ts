import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FuelType } from '@/types/fuel';

interface VehicleState {
  baselineVehicleType: string;
  baselineFuelType: FuelType;
  baselineWeight: string;
  baselineFuelConsumption: string;
  baselineUpstream: string;
  baselineEnduse: string;
  h2VehicleType: string;
  h2Consumption: string;
  h2Emission: string;
  h2Loss: string;
  mileage: string;
  resultBaselineEF: string;
  resultH2EF: string;
  resultReduction: string;
  resultCarbonCredit: string;
  setField: (field: string, value: string) => void;
  setH2Emission: (v: string) => void;
}

export const useVehicleStore = create<VehicleState>()(
  persist(
    (set) => ({
      baselineVehicleType: '轻型商用车N1',
      baselineFuelType: '汽油',
      baselineWeight: '',
      baselineFuelConsumption: '',
      baselineUpstream: '0.63396',
      baselineEnduse: '',
      h2VehicleType: '乘用车',
      h2Consumption: '0.000008',
      h2Emission: '',
      h2Loss: '0.004',
      mileage: '',
      resultBaselineEF: '--',
      resultH2EF: '--',
      resultReduction: '--',
      resultCarbonCredit: '--',
      setField: (field, value) => set({ [field]: value } as Partial<VehicleState>),
      setH2Emission: (v) => set({ h2Emission: v }),
    }),
    { name: 'vehicle-store' },
  ),
);
