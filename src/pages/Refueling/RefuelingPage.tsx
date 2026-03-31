import { useState } from 'react';
import GroupBox from '@/components/ui/GroupBox';
import NumberInput from '@/components/ui/NumberInput';
import SelectInput from '@/components/ui/SelectInput';
import { ELECTRICITY_FACTORS, ELECTRICITY_REGIONS } from '@/data/electricityFactors';
import toast from 'react-hot-toast';

export default function RefuelingPage() {
  const [monthlyElec, setMonthlyElec] = useState(50000);
  const [monthlyH2, setMonthlyH2] = useState(100);
  const [region, setRegion] = useState('全国平均');
  const [useCustom, setUseCustom] = useState(false);
  const [customFactor, setCustomFactor] = useState(0);
  const [result, setResult] = useState<number | null>(null);

  const elecFactorDisplay = ELECTRICITY_FACTORS[region];

  const calculate = () => {
    if (monthlyH2 <= 0) { toast.error('月加氢量必须大于0'); return; }
    const factor = useCustom ? customFactor : (ELECTRICITY_FACTORS[region] ?? 0);
    const er = (monthlyElec * factor) / monthlyH2;
    setResult(er);
    toast.success('计算完成');
  };

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800">氢气加注碳排放核算</h2>

      <GroupBox title="基础参数">
        <div className="grid grid-cols-1 gap-4">
          <NumberInput label="加氢站月耗电量 (kWh/M):" value={monthlyElec} onChange={setMonthlyElec} max={1e9} />
          <NumberInput label="月加氢量 (t H₂/M):" value={monthlyH2} onChange={setMonthlyH2} max={1e9} />
        </div>
      </GroupBox>

      <GroupBox title="电力排放因子">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <SelectInput label="区域:" value={region} onChange={setRegion} options={ELECTRICITY_REGIONS} />
            <span className="text-xs text-gray-500 whitespace-nowrap">{elecFactorDisplay?.toExponential(3)} t CO₂/kWh</span>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={useCustom} onChange={(e) => setUseCustom(e.target.checked)} />
              使用自定义因子
            </label>
            <NumberInput value={customFactor} onChange={setCustomFactor} max={1} decimals={8} step={0.00000001} className={useCustom ? '' : 'opacity-50'} />
          </div>
        </div>
      </GroupBox>

      <GroupBox title="计算结果">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">氢气加注碳排放因子 e_r (t CO₂/t H₂):</span>
          <span className="text-lg font-bold text-gray-800">{result !== null ? result.toFixed(6) : '--'}</span>
        </div>
      </GroupBox>

      <button onClick={calculate} className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 font-medium">
        计算
      </button>
    </div>
  );
}
