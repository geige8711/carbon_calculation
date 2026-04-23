import { useState } from 'react';
import NumberInput from '@/components/ui/NumberInput';
import SelectInput from '@/components/ui/SelectInput';
import { ELECTRICITY_FACTORS, ELECTRICITY_REGIONS } from '@/data/electricityFactors';
import { DEFAULT_H2_LOSS_RATIO, DIESEL_DENSITY, GASOLINE_DENSITY } from '@/data/emissionFactors';
import { calculateTransportFactor, calculateRefuelingFactor, calculateWeightedH2Emission, calculateEndUseEmissionFactor, lPer100kmToTPerKm } from '@/utils/calculation';
import { useVehicleStore } from '@/stores/vehicleStore';
import type { TransportMode } from '@/types/hydrogen';
import type { FuelType } from '@/types/fuel';
import ProductionModal from './ProductionModal';
import toast from 'react-hot-toast';

interface Source { name: string; ej: number; distance: number; ratio: number; }

export default function AdvancedTab() {
  const vehicleStore = useVehicleStore();
  const [sources, setSources] = useState<Source[]>([{ name: '来源1', ej: 11, distance: 100, ratio: 100 }]);
  const [transportMode, setTransportMode] = useState<TransportMode>('管道运输');
  const [truckFuelType, setTruckFuelType] = useState<FuelType>('柴油');
  const [truckFuelConsL, setTruckFuelConsL] = useState(30);
  const [singleH2, setSingleH2] = useState(0.4);
  const [stationElec, setStationElec] = useState(50000);
  const [stationRegion, setStationRegion] = useState('全国平均');
  const [stationCustom, setStationCustom] = useState(0);
  const [useStationCustom, setUseStationCustom] = useState(false);
  const [monthlyH2, setMonthlyH2] = useState(100);
  const [resultEjList, setResultEjList] = useState('--');
  const [resultEt, setResultEt] = useState('--');
  const [resultEr, setResultEr] = useState('--');
  const [resultEH2, setResultEH2] = useState('--');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTargetIdx, setModalTargetIdx] = useState(0);

  const addSource = () => setSources([...sources, { name: `来源${sources.length + 1}`, ej: 11, distance: 100, ratio: 0 }]);
  const removeSource = (i: number) => setSources(sources.filter((_, idx) => idx !== i));
  const updateSource = (i: number, field: keyof Source, value: string | number) => {
    const updated = [...sources];
    updated[i] = { ...updated[i], [field]: value };
    setSources(updated);
  };

  const openDetail = (i: number) => { setModalTargetIdx(i); setModalOpen(true); };
  const onModalResult = (ej: number) => { updateSource(modalTargetIdx, 'ej', ej); setModalOpen(false); };

  const calculate = () => {
    try {
      const validSources = sources.filter((s) => s.ratio > 0);
      if (validSources.length === 0) { toast.error('至少需要一个有效的制氢来源（比例>0）'); return; }

      let et: number;
      if (transportMode === '管道运输') {
        et = calculateTransportFactor('管道运输');
      } else {
        const density = truckFuelType === '柴油' ? DIESEL_DENSITY : GASOLINE_DENSITY;
        const fuelTPerKm = lPer100kmToTPerKm(truckFuelConsL, density);
        const fuelEF = calculateEndUseEmissionFactor(truckFuelType);
        et = calculateTransportFactor('运氢车运输', fuelTPerKm, fuelEF, singleH2);
      }

      const elecFactor = useStationCustom ? stationCustom : (ELECTRICITY_FACTORS[stationRegion] ?? 0);
      const er = calculateRefuelingFactor(stationElec, elecFactor, monthlyH2);

      const lossRatio = parseFloat(vehicleStore.h2Loss) || DEFAULT_H2_LOSS_RATIO;
      const eH2 = calculateWeightedH2Emission(validSources, et, er, lossRatio);

      setResultEjList(validSources.map((s) => s.ej.toFixed(3)).join(', '));
      setResultEt(et.toExponential(3));
      setResultEr(er.toFixed(6));
      setResultEH2(eH2.toFixed(6));

      vehicleStore.setH2Emission(eH2.toFixed(6));
      toast.success(`计算完成！氢气碳当量为 ${eH2.toFixed(6)} t CO₂/t H₂`);
    } catch (e) {
      toast.error(`计算失败: ${e instanceof Error ? e.message : e}`);
    }
  };

  const stationFactorDisplay = ELECTRICITY_FACTORS[stationRegion];

  return (
    <div className="space-y-5">
      {/* 制氢来源 */}
      <div className="border border-[#e0e0e0] rounded-lg p-5">
        <h3 className="text-[#1565A0] font-bold text-sm mb-3">制氢来源（可多个）</h3>
        <div className="text-xs text-gray-500 hidden md:grid grid-cols-6 gap-2 mb-2 bg-gray-50 py-2 px-1 rounded uppercase">
          <span>来源名称</span><span>制氢碳排放因子 e_j</span><span></span><span>运输距离 (km)</span><span>氢源比例 (%)</span><span>操作</span>
        </div>
        {sources.map((s, i) => (
          <div key={i} className="grid grid-cols-2 md:grid-cols-6 gap-2 mb-2 items-center">
            <input className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#1565A0] focus:border-[#1565A0] outline-none" value={s.name} onChange={(e) => updateSource(i, 'name', e.target.value)} />
            <NumberInput value={s.ej} onChange={(v) => updateSource(i, 'ej', v)} max={1e9} decimals={6} />
            <button onClick={() => openDetail(i)} className="px-2 py-1.5 text-xs bg-blue-50 text-[#1565A0] rounded-md hover:bg-blue-100 border border-blue-200 font-medium">详细...</button>
            <NumberInput value={s.distance} onChange={(v) => updateSource(i, 'distance', v)} max={1e6} />
            <NumberInput value={s.ratio} onChange={(v) => updateSource(i, 'ratio', v)} max={100} decimals={2} />
            <button onClick={() => removeSource(i)} className="text-red-500 hover:text-red-700 text-sm">删除</button>
          </div>
        ))}
        <button onClick={addSource} className="mt-2 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded border border-gray-300">添加制氢来源</button>
      </div>

      {/* 氢气运输参数 */}
      <div className="border border-[#e0e0e0] rounded-lg p-5">
        <h3 className="text-[#1565A0] font-bold text-sm mb-3">氢气运输参数</h3>
        <div className="space-y-3">
          <SelectInput label="运输方式:" value={transportMode} onChange={(v) => setTransportMode(v as TransportMode)} options={['管道运输', '运氢车运输']} />
          {transportMode === '运氢车运输' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4 border-l-2 border-[#1565A0]/30">
              <SelectInput label="运氢车燃料类型:" value={truckFuelType} onChange={(v) => setTruckFuelType(v as FuelType)} options={['汽油', '柴油']} />
              <div className="flex items-center text-sm text-gray-600">
                燃料车端碳排放因子 (t CO₂/t):
                <span className="font-bold ml-2">{calculateEndUseEmissionFactor(truckFuelType).toFixed(6)}</span>
              </div>
              <NumberInput label="运氢车燃料消耗量 (L/100km):" value={truckFuelConsL} onChange={setTruckFuelConsL} max={1000} decimals={2} />
              <NumberInput label="单次运氢量 (t H₂):" value={singleH2} onChange={setSingleH2} max={100} />
            </div>
          )}
        </div>
      </div>

      {/* 氢气加注参数 */}
      <div className="border border-[#e0e0e0] rounded-lg p-5">
        <h3 className="text-[#1565A0] font-bold text-sm mb-3">氢气加注参数</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <NumberInput label="加氢站月耗电量 (kWh/M):" value={stationElec} onChange={setStationElec} max={1e9} />
          <div className="flex items-center gap-2">
            <SelectInput label="电力排放因子区域:" value={stationRegion} onChange={setStationRegion} options={ELECTRICITY_REGIONS} />
            <span className="text-xs text-gray-500 whitespace-nowrap">{stationFactorDisplay?.toExponential(3)}</span>
          </div>
          <NumberInput label="自定义电力因子 (tCO₂/kWh):" value={stationCustom} onChange={setStationCustom} max={1} decimals={8} step={0.00000001} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={useStationCustom} onChange={(e) => setUseStationCustom(e.target.checked)} />
            使用自定义
          </label>
          <NumberInput label="月加氢量 (t H₂/M):" value={monthlyH2} onChange={setMonthlyH2} max={1e9} />
        </div>
      </div>

      {/* 计算结果 */}
      <div className="border border-[#e0e0e0] rounded-lg p-5">
        <h3 className="text-[#1565A0] font-bold text-sm mb-3">计算结果</h3>
        <div className="space-y-2 text-sm">
          <div>各来源制氢因子 e_j (tCO₂/tH₂): <span className="font-bold ml-2">{resultEjList}</span></div>
          <div>氢气储运因子 e_t (tCO₂/(tH₂·km)): <span className="font-bold ml-2">{resultEt}</span></div>
          <div>氢气加注因子 e_r (tCO₂/tH₂): <span className="font-bold ml-2">{resultEr}</span></div>
          <div>氢气碳当量 e_H₂ (tCO₂/tH₂): <span className="font-bold ml-2">{resultEH2}</span></div>
        </div>
      </div>

      <button onClick={calculate} className="bg-[#2D8C3C] hover:bg-[#35A045] text-white px-6 py-2.5 rounded-lg font-medium">
        计算并应用到基本计算
      </button>

      {modalOpen && <ProductionModal onClose={() => setModalOpen(false)} onResult={onModalResult} />}
    </div>
  );
}
