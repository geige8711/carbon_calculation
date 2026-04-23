import { Link } from 'react-router-dom';
import NumberInput from '@/components/ui/NumberInput';
import SelectInput from '@/components/ui/SelectInput';
import { useTransportStore } from '@/stores/transportStore';
import { DIESEL_DENSITY, GASOLINE_DENSITY } from '@/data/emissionFactors';
import { calculateEndUseEmissionFactor, calculateTransportFactor, lPer100kmToTPerKm } from '@/utils/calculation';
import type { TransportMode } from '@/types/hydrogen';
import type { FuelType } from '@/types/fuel';
import toast from 'react-hot-toast';

const NAV_ITEMS = [
  { label: '氢气制取', path: '/production' },
  { label: '氢气加注', path: '/refueling' },
  { label: '氢气运输', path: '/transport' },
  { label: '用氢车辆', path: '/vehicle' },
];

export default function TransportPage() {
  const store = useTransportStore();

  const fuelEF = calculateEndUseEmissionFactor(store.fuelType);
  const density = store.fuelType === '柴油' ? DIESEL_DENSITY : GASOLINE_DENSITY;

  const calculate = () => {
    try {
      if (store.transportMode === '管道运输') {
        store.setResult(0);
        toast.success('管道运输碳排放因子为 0');
        return;
      }
      if (store.singleH2Amount <= 0) { toast.error('单次运氢量必须大于0'); return; }
      const fuelTPerKm = lPer100kmToTPerKm(store.fuelConsumption, density);
      const et = calculateTransportFactor('运氢车运输', fuelTPerKm, fuelEF, store.singleH2Amount);
      store.setResult(et);
      toast.success(`计算完成！运输碳排放因子为 ${et.toExponential(4)} t CO₂/(t H₂·km)`);
    } catch (e) {
      toast.error(`计算失败: ${e instanceof Error ? e.message : e}`);
    }
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
                item.path === '/transport'
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
          <span className="text-gray-800">氢气运输</span>
        </nav>

        <div className="bg-white rounded-xl shadow-sm p-6 space-y-5">
          <h2 className="text-xl font-bold text-gray-800">氢气运输碳排放核算</h2>

          {/* 运输方式 */}
          <div className="border border-[#e0e0e0] rounded-lg p-5">
            <h3 className="text-[#1565A0] font-bold text-sm mb-3">运输方式</h3>
            <SelectInput
              label="运输方式:"
              value={store.transportMode}
              onChange={(v) => store.setTransportMode(v as TransportMode)}
              options={['管道运输', '运氢车运输']}
            />
          </div>

          {/* 运氢车参数 */}
          {store.transportMode === '运氢车运输' && (
            <div className="border border-[#e0e0e0] rounded-lg p-5">
              <h3 className="text-[#1565A0] font-bold text-sm mb-3">运氢车参数</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectInput
                  label="燃料类型:"
                  value={store.fuelType}
                  onChange={(v) => store.setFuelType(v as FuelType)}
                  options={['汽油', '柴油']}
                />
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>燃料车端碳排放因子 (t CO₂/t):</span>
                  <span className="font-bold text-gray-800">{fuelEF.toFixed(6)}</span>
                </div>
                <NumberInput
                  label="燃料消耗量 (L/100km):"
                  value={store.fuelConsumption}
                  onChange={store.setFuelConsumption}
                  max={1000}
                  decimals={2}
                />
                <NumberInput
                  label="单次运氢量 (t H₂):"
                  value={store.singleH2Amount}
                  onChange={store.setSingleH2Amount}
                  max={100}
                  decimals={2}
                />
              </div>
            </div>
          )}

          {/* 计算结果 */}
          <div className="border border-[#e0e0e0] rounded-lg p-5">
            <h3 className="text-[#1565A0] font-bold text-sm mb-3">计算结果</h3>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">氢气运输碳排放因子 e_t (t CO₂/(t H₂·km)):</span>
              <span className="text-lg font-bold text-gray-800">
                {store.result !== null ? store.result.toExponential(4) : '--'}
              </span>
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
