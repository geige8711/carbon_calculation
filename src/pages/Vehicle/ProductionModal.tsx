import { useCallback } from 'react';
import GroupBox from '@/components/ui/GroupBox';
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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-[900px] max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-xl font-bold text-gray-800 mb-4">氢气生产碳排放核算（详细）</h3>

        <NumberInput label="氢气年产量 (t H₂/yr):" value={production} onChange={setProduction} max={1e9} className="mb-4" />

        <GroupBox title="化石燃料燃烧" className="mb-4">
          {fuels.map((f, i) => (
            <div key={i} className="grid grid-cols-5 gap-2 mb-1 items-center text-sm">
              <SelectInput value={f.name} onChange={(v) => updateFuel(i, 'name', v)} options={['', ...FUEL_REF_NAMES]} />
              <NumberInput value={f.consumption} onChange={(v) => updateFuel(i, 'consumption', v)} max={1e9} />
              <NumberInput value={f.carbonContent} onChange={(v) => updateFuel(i, 'carbonContent', v)} max={10} decimals={6} step={0.001} />
              <NumberInput value={f.oxidationRate} onChange={(v) => updateFuel(i, 'oxidationRate', v)} max={1} decimals={3} step={0.01} />
              <button onClick={() => setFuels(fuels.filter((_, idx) => idx !== i))} className="text-red-500 text-sm">删除</button>
            </div>
          ))}
          <button onClick={() => setFuels([...fuels, { name: '', consumption: 0, carbonContent: 0.75, oxidationRate: 0.99 }])} className="mt-1 text-sm text-blue-600">+ 添加燃料</button>
        </GroupBox>

        <GroupBox title="原料输入" className="mb-4">
          {rawMaterials.map((r, i) => (
            <div key={i} className="grid grid-cols-4 gap-2 mb-1 items-center text-sm">
              <SelectInput value={r.name} onChange={(v) => updateRaw(i, 'name', v)} options={['', ...RAW_MATERIAL_NAMES]} />
              <NumberInput value={r.amount} onChange={(v) => updateRaw(i, 'amount', v)} max={1e9} />
              <NumberInput value={r.factor} onChange={(v) => updateRaw(i, 'factor', v)} max={1e9} decimals={6} />
              <button onClick={() => setRawMaterials(rawMaterials.filter((_, idx) => idx !== i))} className="text-red-500 text-sm">删除</button>
            </div>
          ))}
          <button onClick={() => setRawMaterials([...rawMaterials, { name: '', amount: 0, factor: 0 }])} className="mt-1 text-sm text-blue-600">+ 添加原料</button>
        </GroupBox>

        <GroupBox title="电力消耗" className="mb-4">
          <div className="grid grid-cols-2 gap-3">
            <NumberInput label="年耗电量 (kWh/yr):" value={elecAmount} onChange={setElecAmount} max={1e12} />
            <SelectInput label="区域:" value={elecRegion} onChange={setElecRegion} options={ELECTRICITY_REGIONS} />
            <NumberInput label="自定义因子:" value={customElec} onChange={setCustomElec} max={1} decimals={8} />
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={useCustomElec} onChange={(e) => setUseCustomElec(e.target.checked)} />使用自定义</label>
          </div>
        </GroupBox>

        <GroupBox title="热力消耗" className="mb-4">
          <div className="grid grid-cols-2 gap-3">
            <NumberInput label="年耗热量 (MJ/yr):" value={heatAmount} onChange={setHeatAmount} max={1e12} />
            <NumberInput label="热力排放因子 (tCO₂/MJ):" value={heatFactor} onChange={setHeatFactor} max={1} decimals={8} />
          </div>
        </GroupBox>

        <div className="flex items-center gap-4 mb-4">
          <span className="text-sm">制氢碳排放因子 e_j: <span className="font-bold text-lg">{result !== null ? result.toFixed(6) : '--'}</span> t CO₂/t H₂</span>
        </div>

        <div className="flex gap-3">
          <button onClick={calculate} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">计算</button>
          <button onClick={confirm} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">确定</button>
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">取消</button>
        </div>
      </div>
    </div>
  );
}
