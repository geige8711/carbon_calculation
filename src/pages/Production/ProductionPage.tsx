import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import NumberInput from '@/components/ui/NumberInput';
import SelectInput from '@/components/ui/SelectInput';
import { useProductionStore } from '@/stores/productionStore';
import { ELECTRICITY_FACTORS, ELECTRICITY_REGIONS } from '@/data/electricityFactors';
import { FUEL_REF_NAMES, RAW_MATERIAL_NAMES, getFuelDefaults, getRawMaterialDefaults } from '@/data/referenceData';
import { calculateHydrogenProductionFactor } from '@/utils/calculation';
import toast from 'react-hot-toast';

const NAV_ITEMS = [
  { label: '氢气制取', path: '/production' },
  { label: '氢气加注', path: '/refueling' },
  { label: '用氢车辆', path: '/vehicle' },
];

export default function ProductionPage() {
  const store = useProductionStore();

  const addFuel = () => {
    store.setFuels([...store.fuels, { name: '', consumption: 0, carbonContent: 0.75, oxidationRate: 0.99 }]);
  };
  const removeFuel = (i: number) => {
    store.setFuels(store.fuels.filter((_, idx) => idx !== i));
  };
  const updateFuel = (i: number, field: string, value: string | number) => {
    const updated = [...store.fuels];
    const item = { ...updated[i], [field]: value };
    if (field === 'name') {
      const [cc, of] = getFuelDefaults(value as string);
      item.carbonContent = cc;
      item.oxidationRate = of;
    }
    updated[i] = item;
    store.setFuels(updated);
  };

  const addRaw = () => {
    store.setRawMaterials([...store.rawMaterials, { name: '', amount: 0, factor: 0 }]);
  };
  const removeRaw = (i: number) => {
    store.setRawMaterials(store.rawMaterials.filter((_, idx) => idx !== i));
  };
  const updateRaw = (i: number, field: string, value: string | number) => {
    const updated = [...store.rawMaterials];
    const item = { ...updated[i], [field]: value };
    if (field === 'name') {
      item.factor = getRawMaterialDefaults(value as string);
    }
    updated[i] = item;
    store.setRawMaterials(updated);
  };

  const getElecFactor = useCallback(() => {
    if (store.useCustomElecFactor) return store.customElecFactor;
    return ELECTRICITY_FACTORS[store.electricityRegion] ?? 0;
  }, [store.useCustomElecFactor, store.customElecFactor, store.electricityRegion]);

  const calculate = () => {
    try {
      if (store.productionAmount <= 0) { toast.error('氢气年产量必须大于0'); return; }
      const fuels = store.fuels.filter((f) => f.consumption > 0).map((f) => ({
        consumption: f.consumption, carbonContent: f.carbonContent, oxidationRate: f.oxidationRate,
      }));
      const rawMaterials = store.rawMaterials.filter((r) => r.amount > 0 && r.factor > 0).map((r) => ({
        amount: r.amount, factor: r.factor,
      }));
      const result = calculateHydrogenProductionFactor({
        production: store.productionAmount,
        fuels: fuels.length > 0 ? fuels : undefined,
        electricityAmount: store.electricityAmount > 0 ? store.electricityAmount : undefined,
        electricityFactor: store.electricityAmount > 0 ? getElecFactor() : undefined,
        heatAmount: store.heatAmount > 0 ? store.heatAmount : undefined,
        heatFactor: store.heatAmount > 0 ? store.heatFactor : undefined,
        rawMaterials: rawMaterials.length > 0 ? rawMaterials : undefined,
      });
      store.setResult(result);
      toast.success('计算完成');
    } catch (e) {
      toast.error(`计算失败: ${e instanceof Error ? e.message : e}`);
    }
  };

  const elecFactorDisplay = ELECTRICITY_FACTORS[store.electricityRegion];

  return (
    <div className="flex min-h-full">
      {/* Left Sidebar */}
      <aside className="w-56 shrink-0 bg-white border-r border-gray-200 py-4">
        <nav className="space-y-1 px-3">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                item.path === '/production'
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
      <div className="flex-1 p-6">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-4">
          <Link to="/" className="hover:text-[#1565A0]">首页</Link>
          <span className="mx-2">&gt;</span>
          <span>碳排放计算</span>
          <span className="mx-2">&gt;</span>
          <span className="text-gray-800">氢气制取</span>
        </nav>

        <div className="bg-white rounded-xl shadow-sm p-6 space-y-5">
          <h2 className="text-xl font-bold text-gray-800">氢气生产碳排放核算</h2>

          <div className="flex items-center gap-4">
            <NumberInput label="氢气年产量 (t H₂/yr):" value={store.productionAmount} onChange={store.setProductionAmount} max={1e9} />
          </div>

          {/* 化石燃料燃烧 */}
          <div className="border border-[#e0e0e0] rounded-lg p-5">
            <h3 className="text-[#1565A0] font-bold text-sm mb-3">化石燃料燃烧</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase">
                  <th className="pb-2 pt-2 px-2 text-left">燃料名称</th>
                  <th className="pb-2 pt-2 px-2 text-left">消耗量 (t或Nm³/yr)</th>
                  <th className="pb-2 pt-2 px-2 text-left">含碳量 (tC/t)</th>
                  <th className="pb-2 pt-2 px-2 text-left">碳氧化率</th>
                  <th className="pb-2 pt-2 px-2 text-left">操作</th>
                </tr>
              </thead>
              <tbody>
                {store.fuels.map((fuel, i) => (
                  <tr key={i} className="border-t border-gray-100">
                    <td className="py-2 pr-2">
                      <SelectInput value={fuel.name} onChange={(v) => updateFuel(i, 'name', v)} options={['', ...FUEL_REF_NAMES]} />
                    </td>
                    <td className="py-2 pr-2">
                      <NumberInput value={fuel.consumption} onChange={(v) => updateFuel(i, 'consumption', v)} max={1e9} />
                    </td>
                    <td className="py-2 pr-2">
                      <NumberInput value={fuel.carbonContent} onChange={(v) => updateFuel(i, 'carbonContent', v)} max={10} decimals={6} step={0.001} />
                    </td>
                    <td className="py-2 pr-2">
                      <NumberInput value={fuel.oxidationRate} onChange={(v) => updateFuel(i, 'oxidationRate', v)} max={1} decimals={3} step={0.01} />
                    </td>
                    <td className="py-2">
                      <button onClick={() => removeFuel(i)} className="text-red-500 hover:text-red-700 text-sm">删除</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={addFuel} className="mt-2 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded border border-gray-300">添加燃料</button>
          </div>

          {/* 原料输入 */}
          <div className="border border-[#e0e0e0] rounded-lg p-5">
            <h3 className="text-[#1565A0] font-bold text-sm mb-3">原料输入</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase">
                  <th className="pb-2 pt-2 px-2 text-left">原料名称</th>
                  <th className="pb-2 pt-2 px-2 text-left">消耗量 (t/yr)</th>
                  <th className="pb-2 pt-2 px-2 text-left">碳排放因子 (tCO₂/t)</th>
                  <th className="pb-2 pt-2 px-2 text-left">操作</th>
                </tr>
              </thead>
              <tbody>
                {store.rawMaterials.map((raw, i) => (
                  <tr key={i} className="border-t border-gray-100">
                    <td className="py-2 pr-2">
                      <SelectInput value={raw.name} onChange={(v) => updateRaw(i, 'name', v)} options={['', ...RAW_MATERIAL_NAMES]} />
                    </td>
                    <td className="py-2 pr-2">
                      <NumberInput value={raw.amount} onChange={(v) => updateRaw(i, 'amount', v)} max={1e9} />
                    </td>
                    <td className="py-2 pr-2">
                      <NumberInput value={raw.factor} onChange={(v) => updateRaw(i, 'factor', v)} max={1e9} decimals={6} />
                    </td>
                    <td className="py-2">
                      <button onClick={() => removeRaw(i)} className="text-red-500 hover:text-red-700 text-sm">删除</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={addRaw} className="mt-2 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded border border-gray-300">添加原料</button>
          </div>

          {/* 电力消耗 */}
          <div className="border border-[#e0e0e0] rounded-lg p-5">
            <h3 className="text-[#1565A0] font-bold text-sm mb-3">电力消耗</h3>
            <div className="grid grid-cols-2 gap-4">
              <NumberInput label="年耗电量 (kWh/yr):" value={store.electricityAmount} onChange={store.setElectricityAmount} max={1e12} />
              <div className="flex items-center gap-2">
                <SelectInput label="电力排放因子区域:" value={store.electricityRegion} onChange={store.setElectricityRegion} options={ELECTRICITY_REGIONS} />
                <span className="text-xs text-gray-500 whitespace-nowrap">{elecFactorDisplay?.toExponential(3)} t CO₂/kWh</span>
              </div>
              <NumberInput label="自定义因子 (tCO₂/kWh):" value={store.customElecFactor} onChange={store.setCustomElecFactor} max={1} decimals={8} step={0.00000001} />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={store.useCustomElecFactor} onChange={(e) => store.setUseCustomElecFactor(e.target.checked)} />
                使用自定义
              </label>
            </div>
          </div>

          {/* 热力消耗 */}
          <div className="border border-[#e0e0e0] rounded-lg p-5">
            <h3 className="text-[#1565A0] font-bold text-sm mb-3">热力消耗</h3>
            <div className="grid grid-cols-2 gap-4">
              <NumberInput label="年耗热量 (MJ/yr):" value={store.heatAmount} onChange={store.setHeatAmount} max={1e12} />
              <NumberInput label="热力排放因子 (tCO₂/MJ):" value={store.heatFactor} onChange={store.setHeatFactor} max={1} decimals={8} step={0.00000001} />
            </div>
          </div>

          {/* 计算结果 */}
          <div className="border border-[#e0e0e0] rounded-lg p-5">
            <h3 className="text-[#1565A0] font-bold text-sm mb-3">计算结果</h3>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">制氢碳排放因子 e_j (t CO₂/t H₂):</span>
              <span className="text-lg font-bold text-gray-800">{store.result !== null ? store.result.toFixed(6) : '--'}</span>
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
