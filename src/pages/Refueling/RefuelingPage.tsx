import { useState } from 'react';
import { Link } from 'react-router-dom';
import NumberInput from '@/components/ui/NumberInput';
import SelectInput from '@/components/ui/SelectInput';
import { ELECTRICITY_FACTORS, ELECTRICITY_REGIONS } from '@/data/electricityFactors';
import toast from 'react-hot-toast';

const NAV_ITEMS = [
  { label: '氢气制取', path: '/production' },
  { label: '氢气加注', path: '/refueling' },
  { label: '用氢车辆', path: '/vehicle' },
];

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
    <div className="flex flex-col lg:flex-row min-h-full">
      {/* Left Sidebar */}
      <aside className="w-full lg:w-56 shrink-0 bg-white border-b lg:border-b-0 lg:border-r border-gray-200 py-4">
        <nav className="flex lg:flex-col flex-row overflow-x-auto lg:overflow-visible space-y-0 lg:space-y-1 gap-1 lg:gap-0 px-3">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block whitespace-nowrap px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                item.path === '/refueling'
                  ? 'bg-[#1565A0] text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-6">
        {/* Breadcrumb */}
        <nav className="hidden sm:flex text-sm text-gray-500 mb-4">
          <Link to="/" className="hover:text-[#1565A0]">首页</Link>
          <span className="mx-2">&gt;</span>
          <span>碳排放计算</span>
          <span className="mx-2">&gt;</span>
          <span className="text-gray-800">氢气加注</span>
        </nav>

        <div className="bg-white rounded-xl shadow-sm p-6 space-y-5">
          <h2 className="text-xl font-bold text-gray-800">氢气加注碳排放核算</h2>

          {/* 基础参数 */}
          <div className="border border-[#e0e0e0] rounded-lg p-5">
            <h3 className="text-[#1565A0] font-bold text-sm mb-3">基础参数</h3>
            <div className="grid grid-cols-1 gap-4">
              <NumberInput label="加氢站月耗电量 (kWh/M):" value={monthlyElec} onChange={setMonthlyElec} max={1e9} />
              <NumberInput label="月加氢量 (t H₂/M):" value={monthlyH2} onChange={setMonthlyH2} max={1e9} />
            </div>
          </div>

          {/* 电力排放因子 */}
          <div className="border border-[#e0e0e0] rounded-lg p-5">
            <h3 className="text-[#1565A0] font-bold text-sm mb-3">电力排放因子</h3>
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
          </div>

          {/* 计算结果 */}
          <div className="border border-[#e0e0e0] rounded-lg p-5">
            <h3 className="text-[#1565A0] font-bold text-sm mb-3">计算结果</h3>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">氢气加注碳排放因子 e_r (t CO₂/t H₂):</span>
              <span className="text-lg font-bold text-gray-800">{result !== null ? result.toFixed(6) : '--'}</span>
            </div>
          </div>

          <button onClick={calculate} className="bg-[#2D8C3C] hover:bg-[#35A045] text-white px-6 py-2.5 rounded-lg font-medium">
            计算
          </button>
        </div>
      </div>
    </div>
  );
}
