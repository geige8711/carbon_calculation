import { useState } from 'react';
import { Link } from 'react-router-dom';
import BasicTab from './BasicTab';
import AdvancedTab from './AdvancedTab';
import { useVehicleStore } from '@/stores/vehicleStore';

const NAV_ITEMS = [
  { label: '氢气制取', path: '/production' },
  { label: '氢气加注', path: '/refueling' },
  { label: '用氢车辆', path: '/vehicle' },
];

export default function VehiclePage() {
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced'>('basic');
  const store = useVehicleStore();

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
                item.path === '/vehicle'
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
          <span className="text-gray-800">用氢车辆</span>
        </nav>

        <div className="bg-white rounded-xl shadow-sm p-6 space-y-5">
          <h2 className="text-xl font-bold text-gray-800">氢燃料电池车碳减排量化计算</h2>

          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('basic')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'basic' ? 'border-[#1565A0] text-[#1565A0]' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              基本计算
            </button>
            <button
              onClick={() => setActiveTab('advanced')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'advanced' ? 'border-[#1565A0] text-[#1565A0]' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              高级设置
            </button>
          </div>

          {activeTab === 'basic' ? <BasicTab /> : <AdvancedTab />}

          {/* 计算结果 */}
          <div className="border border-[#e0e0e0] rounded-lg p-5">
            <h3 className="text-[#1565A0] font-bold text-sm mb-3">计算结果</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>基准线碳排放强度 (t CO₂/km): <span className="font-bold ml-2">{store.resultBaselineEF}</span></div>
              <div>氢能车辆碳排放强度 (t CO₂/km): <span className="font-bold ml-2">{store.resultH2EF}</span></div>
              <div>碳减排量 (t CO₂): <span className="font-bold ml-2">{store.resultReduction}</span></div>
              <div>碳积分: <span className="font-bold ml-2">{store.resultCarbonCredit}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
