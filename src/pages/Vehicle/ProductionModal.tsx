import { useCallback } from 'react';
import NumberInput from '@/components/ui/NumberInput';
import SelectInput from '@/components/ui/SelectInput';
import { ELECTRICITY_FACTORS, ELECTRICITY_REGIONS } from '@/data/electricityFactors';
import { FUEL_REF_NAMES, RAW_MATERIAL_NAMES, getFuelDefaults, getRawMaterialDefaults } from '@/data/referenceData';
import { HEAT_FACTOR } from '@/data/emissionFactors';
import { calculateHydrogenProductionFactor } from '@/utils/calculation';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface Props {
  onClose: () => void;
  onResult: (ej: number) => void;
}

export default function ProductionModal({ onClose, onResult }: Props) {
  const [production, setProduction] = useState(1000);
  const [fuels, setFuels] = useState([{ name: '', consumption: 0, carbonContent: 0.75, oxidationRate: 0.99 }]);
  const [rawMaterials, setRawMaterials] = useState([
    { name: '烧碱（30%）', amount: 0, factor: 11.555 },
    { name: '新鲜水', amount: 0, factor: 0.0006 },
  ]);
  const [elecAmount, setElecAmount] = useState(0);
  const [elecRegion, setElecRegion] = useState('全国平均');
  const [useCustomElec, setUseCustomElec] = useState(false);
  const [customElec, setCustomElec] = useState(0);
  const [heatAmount, setHeatAmount] = useState(0);
  const [heatFactor, setHeatFactor] = useState(HEAT_FACTOR);
  const [result, setResult] = useState<number | null>(null);

  const getElecFactor = useCallback(() => {
    if (useCustomElec) return customElec;
    return ELECTRICITY_FACTORS[elecRegion] ?? 0;
  }, [useCustomElec, customElec, elecRegion]);

  const calculate = () => {
    try {
      if (production <= 0) { toast.error('氢气年产量必须大于0'); return; }
      const validFuels = fuels.filter((f) => f.consumption > 0);
      const validRaw = rawMaterials.filter((r) => r.amount > 0 && r.factor > 0);
      const ej = calculateHydrogenProductionFactor({
        production,
        fuels: validFuels.length > 0 ? validFuels.map((f) => ({ consumption: f.consumption, carbonContent: f.carbonContent, oxidationRate: f.oxidationRate })) : undefined,
        electricityAmount: elecAmount > 0 ? elecAmount : undefined,
        electricityFactor: elecAmount > 0 ? getElecFactor() : undefined,
        heatAmount: heatAmount > 0 ? heatAmount : undefined,
        heatFactor: heatAmount > 0 ? heatFactor : undefined,
        rawMaterials: validRaw.length > 0 ? validRaw.map((r) => ({ amount: r.amount, factor: r.factor })) : undefined,
      });
      setResult(ej);
    } catch (e) {
      toast.error(`计算失败: ${e instanceof Error ? e.message : e}`);
    }
  };

  const confirm = () => {
    if (result !== null) onResult(result);
    else toast.error('请先计算');
  };

  const updateFuel = (i: number, field: string, value: string | number) => {
    const updated = [...fuels];
    const item = { ...updated[i], [field]: value };
    if (field === 'name') { const [cc, of] = getFuelDefaults(value as string); item.carbonContent = cc; item.oxidationRate = of; }
    updated[i] = item;
    setFuels(updated);
  };
  const updateRaw = (i: number, field: string, value: string | number) => {
    const updated = [...rawMaterials];
    const item = { ...updated[i], [field]: value };
    if (field === 'name') item.factor = getRawMaterialDefaults(value as string);
    updated[i] = item;
    setRawMaterials(updated);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-[900px] mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Blue Header */}
        <div className="bg-[#1565A0] text-white px-6 py-4 rounded-t-xl">
          <h3 className="text-lg font-bold">氢气生产碳排放核算（详细）</h3>
        </div>

        <div className="p-6 space-y-4">
          <NumberInput label="氢气年产量 (t H₂/yr):" value={production} onChange={setProduction} max={1e9} className="mb-4" />

          {/* 化石燃料燃烧 */}
          <div className="border border-[#e0e0e0] rounded-lg p-5">
            <h3 className="text-[#1565A0] font-bold text-sm mb-3">化石燃料燃烧</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase">
                  <th className="pb-2 pt-2 px-2 text-left">燃料名称</th>
                  <th className="pb-2 pt-2 px-2 text-left">消耗量</th>
                  <th className="pb-2 pt-2 px-2 text-left">含碳量</th>
                  <th className="pb-2 pt-2 px-2 text-left">碳氧化率</th>
                  <th className="pb-2 pt-2 px-2 text-left">操作</th>
                </tr>
              </thead>
              <tbody>
                {fuels.map((f, i) => (
                  <tr key={i} className="border-t border-gray-100">
                    <td className="py-2 pr-2">
                      <SelectInput value={f.name} onChange={(v) => updateFuel(i, 'name', v)} options={['', ...FUEL_REF_NAMES]} />
                    </td>
                    <td className="py-2 pr-2">
                      <NumberInput value={f.consumption} onChange={(v) => updateFuel(i, 'consumption', v)} max={1e9} />
                    </td>
                    <td className="py-2 pr-2">
                      <NumberInput value={f.carbonContent} onChange={(v) => updateFuel(i, 'carbonContent', v)} max={10} decimals={6} step={0.001} />
                    </td>
                    <td className="py-2 pr-2">
                      <NumberInput value={f.oxidationRate} onChange={(v) => updateFuel(i, 'oxidationRate', v)} max={1} decimals={3} step={0.01} />
                    </td>
                    <td className="py-2">
                      <button onClick={() => setFuels(fuels.filter((_, idx) => idx !== i))} className="text-red-500 hover:text-red-700 text-sm">删除</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={() => setFuels([...fuels, { name: '', consumption: 0, carbonContent: 0.75, oxidationRate: 0.99 }])} className="mt-2 px-3 py-1 text-sm text-[#1565A0] hover:bg-blue-50 rounded border border-blue-200">+ 添加燃料</button>
          </div>

          {/* 原料输入 */}
          <div className="border border-[#e0e0e0] rounded-lg p-5">
            <h3 className="text-[#1565A0] font-bold text-sm mb-3">原料输入</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase">
                  <th className="pb-2 pt-2 px-2 text-left">原料名称</th>
                  <th className="pb-2 pt-2 px-2 text-left">消耗量</th>
                  <th className="pb-2 pt-2 px-2 text-left">碳排放因子</th>
                  <th className="pb-2 pt-2 px-2 text-left">操作</th>
                </tr>
              </thead>
              <tbody>
                {rawMaterials.map((r, i) => (
                  <tr key={i} className="border-t border-gray-100">
                    <td className="py-2 pr-2">
                      <SelectInput value={r.name} onChange={(v) => updateRaw(i, 'name', v)} options={['', ...RAW_MATERIAL_NAMES]} />
                    </td>
                    <td className="py-2 pr-2">
                      <NumberInput value={r.amount} onChange={(v) => updateRaw(i, 'amount', v)} max={1e9} />
                    </td>
                    <td className="py-2 pr-2">
                      <NumberInput value={r.factor} onChange={(v) => updateRaw(i, 'factor', v)} max={1e9} decimals={6} />
                    </td>
                    <td className="py-2">
                      <button onClick={() => setRawMaterials(rawMaterials.filter((_, idx) => idx !== i))} className="text-red-500 hover:text-red-700 text-sm">删除</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={() => setRawMaterials([...rawMaterials, { name: '', amount: 0, factor: 0 }])} className="mt-2 px-3 py-1 text-sm text-[#1565A0] hover:bg-blue-50 rounded border border-blue-200">+ 添加原料</button>
          </div>

          {/* 电力消耗 */}
          <div className="border border-[#e0e0e0] rounded-lg p-5">
            <h3 className="text-[#1565A0] font-bold text-sm mb-3">电力消耗</h3>
            <div className="space-y-3">
              <NumberInput label="年耗电量 (kWh/yr):" value={elecAmount} onChange={setElecAmount} max={1e12} />
              <div className="flex items-center gap-2 flex-wrap">
                <SelectInput label="区域:" value={elecRegion} onChange={setElecRegion} options={ELECTRICITY_REGIONS} disabled={useCustomElec} className="flex-1 min-w-[180px]" />
                <div className={`flex items-center gap-1 whitespace-nowrap ${useCustomElec ? 'opacity-50' : ''}`}>
                  <span className="text-xs text-gray-600">区域因子 (tCO₂/kWh):</span>
                  <span className="text-sm font-medium text-gray-800 tabular-nums">{(ELECTRICITY_FACTORS[elecRegion] ?? 0).toFixed(7)}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <label className="flex items-center gap-2 text-sm whitespace-nowrap cursor-pointer">
                  <input type="checkbox" checked={useCustomElec} onChange={(e) => setUseCustomElec(e.target.checked)} />
                  使用自定义
                </label>
                <NumberInput label="自定义因子:" value={customElec} onChange={setCustomElec} max={1} decimals={8} disabled={!useCustomElec} className="flex-1 min-w-[180px]" />
              </div>
            </div>
          </div>

          {/* 热力消耗 */}
          <div className="border border-[#e0e0e0] rounded-lg p-5">
            <h3 className="text-[#1565A0] font-bold text-sm mb-3">热力消耗</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <NumberInput label="年耗热量 (MJ/yr):" value={heatAmount} onChange={setHeatAmount} max={1e12} />
              <NumberInput label="热力排放因子 (tCO₂/MJ):" value={heatFactor} onChange={setHeatFactor} max={1} decimals={8} />
            </div>
          </div>

          {/* Result */}
          <div className="flex items-center gap-4 bg-gray-50 rounded-lg p-4">
            <span className="text-sm">制氢碳排放因子 e_j:</span>
            <span className="font-bold text-lg text-[#1565A0]">{result !== null ? result.toFixed(6) : '--'}</span>
            <span className="text-sm text-gray-500">t CO₂/t H₂</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button onClick={calculate} className="bg-[#2D8C3C] hover:bg-[#35A045] text-white px-6 py-2.5 rounded-lg font-medium">计算</button>
            <button onClick={confirm} className="bg-[#1565A0] hover:bg-[#1976D2] text-white px-6 py-2.5 rounded-lg font-medium">确定</button>
            <button onClick={onClose} className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium text-gray-700 border border-gray-300">取消</button>
          </div>
        </div>
      </div>
    </div>
  );
}
