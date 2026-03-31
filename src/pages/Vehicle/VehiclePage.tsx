import { useState } from 'react';
import BasicTab from './BasicTab';
import AdvancedTab from './AdvancedTab';
import GroupBox from '@/components/ui/GroupBox';
import { useVehicleStore } from '@/stores/vehicleStore';

export default function VehiclePage() {
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced'>('basic');
  const store = useVehicleStore();

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800">氢燃料电池车碳减排量化计算</h2>

      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('basic')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'basic' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          基本计算
        </button>
        <button
          onClick={() => setActiveTab('advanced')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'advanced' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          高级设置
        </button>
      </div>

      {activeTab === 'basic' ? <BasicTab /> : <AdvancedTab />}

      <GroupBox title="计算结果">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>基准线碳排放强度 (t CO₂/km): <span className="font-bold ml-2">{store.resultBaselineEF}</span></div>
          <div>氢能车辆碳排放强度 (t CO₂/km): <span className="font-bold ml-2">{store.resultH2EF}</span></div>
          <div>碳减排量 (t CO₂): <span className="font-bold ml-2">{store.resultReduction}</span></div>
          <div>碳积分: <span className="font-bold ml-2">{store.resultCarbonCredit}</span></div>
        </div>
      </GroupBox>
    </div>
  );
}
