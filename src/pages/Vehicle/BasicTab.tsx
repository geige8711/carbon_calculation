import GroupBox from '@/components/ui/GroupBox';
import SelectInput from '@/components/ui/SelectInput';
import { useVehicleStore } from '@/stores/vehicleStore';
import { UPSTREAM_FACTORS, H2_CONSUMPTION, DIESEL_DENSITY, GASOLINE_DENSITY } from '@/data/emissionFactors';
import { calculateEndUseEmissionFactor, calculateBaselineEF, lPer100kmToTPerKm } from '@/utils/calculation';
import { lookupFuelConsumption } from '@/utils/fuelLookup';
import type { FuelType } from '@/types/fuel';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

const BASELINE_VEHICLES = ['轻型商用车N1', '轻型商用车M2', '货车', '半挂牵引车', '客车', '城市客车'];
const H2_VEHICLES = Object.keys(H2_CONSUMPTION);

export default function BasicTab() {
  const store = useVehicleStore();

  useEffect(() => {
    const fuel = store.baselineFuelType;
    store.setField('baselineUpstream', String(UPSTREAM_FACTORS[fuel]));
    store.setField('baselineEnduse', calculateEndUseEmissionFactor(fuel).toFixed(6));
  }, [store.baselineFuelType]);

  useEffect(() => {
    const w = parseFloat(store.baselineWeight);
    if (!isNaN(w) && w > 0) {
      const fc = lookupFuelConsumption(store.baselineVehicleType, store.baselineFuelType, w);
      store.setField('baselineFuelConsumption', fc !== null ? String(fc) : '');
    }
  }, [store.baselineVehicleType, store.baselineFuelType, store.baselineWeight]);

  useEffect(() => {
    const cons = H2_CONSUMPTION[store.h2VehicleType];
    if (cons !== undefined) store.setField('h2Consumption', String(cons));
  }, [store.h2VehicleType]);

  const calculate = () => {
    try {
      const upstream = parseFloat(store.baselineUpstream);
      const enduse = parseFloat(store.baselineEnduse);
      const fcL = parseFloat(store.baselineFuelConsumption);
      const h2Cons = parseFloat(store.h2Consumption);
      const h2Emission = parseFloat(store.h2Emission);
      const h2Loss = parseFloat(store.h2Loss);
      const mileage = parseFloat(store.mileage);
      if ([upstream, enduse, fcL, h2Cons, h2Emission, h2Loss, mileage].some(isNaN)) {
        toast.error('请填写所有必要参数'); return;
      }
      const density = store.baselineFuelType === '柴油' ? DIESEL_DENSITY : GASOLINE_DENSITY;
      const sfcTPerKm = lPer100kmToTPerKm(fcL, density);
      const baselineEF = calculateBaselineEF(upstream, enduse, sfcTPerKm);
      const h2EF = h2Emission * (1 + h2Loss) * h2Cons;
      const reduction = (baselineEF - h2EF) * mileage;
      store.setField('resultBaselineEF', baselineEF.toFixed(6));
      store.setField('resultH2EF', h2EF.toFixed(6));
      store.setField('resultReduction', reduction.toFixed(3));
      store.setField('resultCarbonCredit', reduction.toFixed(2));
      toast.success('计算完成');
    } catch (e) {
      toast.error(`计算失败: ${e instanceof Error ? e.message : e}`);
    }
  };

  const inputClass = "border border-gray-300 rounded px-2 py-1.5 text-sm w-full focus:outline-none focus:ring-1 focus:ring-green-500";

  return (
    <div className="space-y-5">
      <GroupBox title="基准车辆参数">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <SelectInput label="车辆类型:" value={store.baselineVehicleType} onChange={(v) => store.setField('baselineVehicleType', v)} options={BASELINE_VEHICLES} />
          <SelectInput label="燃料类型:" value={store.baselineFuelType} onChange={(v) => store.setField('baselineFuelType', v as FuelType)} options={['汽油', '柴油']} />
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 whitespace-nowrap">总质量 (kg):</label>
            <input className={inputClass} value={store.baselineWeight} onChange={(e) => store.setField('baselineWeight', e.target.value)} placeholder="输入车辆总质量" />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 whitespace-nowrap">燃料消耗量 (L/100km):</label>
            <input className={inputClass} value={store.baselineFuelConsumption} onChange={(e) => store.setField('baselineFuelConsumption', e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 whitespace-nowrap">上车前碳排放因子 (tCO₂/t):</label>
            <input className={inputClass} value={store.baselineUpstream} onChange={(e) => store.setField('baselineUpstream', e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 whitespace-nowrap">车端碳排放因子 (tCO₂/t):</label>
            <input className={inputClass} value={store.baselineEnduse} onChange={(e) => store.setField('baselineEnduse', e.target.value)} />
          </div>
        </div>
      </GroupBox>

      <GroupBox title="氢能车辆参数">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <SelectInput label="车辆类型:" value={store.h2VehicleType} onChange={(v) => store.setField('h2VehicleType', v)} options={H2_VEHICLES} />
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 whitespace-nowrap">氢耗量 (t H₂/km):</label>
            <input className={inputClass} value={store.h2Consumption} onChange={(e) => store.setField('h2Consumption', e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 whitespace-nowrap">氢气碳当量 (tCO₂/tH₂):</label>
            <input className={inputClass} value={store.h2Emission} onChange={(e) => store.setField('h2Emission', e.target.value)} placeholder="请输入或通过高级设置计算" />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 whitespace-nowrap">氢气逸散比例:</label>
            <input className={inputClass} value={store.h2Loss} onChange={(e) => store.setField('h2Loss', e.target.value)} />
          </div>
        </div>
      </GroupBox>

      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600 whitespace-nowrap">总行驶里程 (km):</label>
        <input className="border border-gray-300 rounded px-2 py-1.5 text-sm w-64 focus:outline-none focus:ring-1 focus:ring-green-500" value={store.mileage} onChange={(e) => store.setField('mileage', e.target.value)} />
      </div>

      <button onClick={calculate} className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 font-medium">
        计算碳减排量
      </button>
    </div>
  );
}
