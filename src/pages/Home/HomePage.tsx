import ModuleCard from '@/components/ModuleCard';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center gap-12 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-3">氢能碳排放核算系统</h1>
        <p className="text-gray-500">请选择功能模块</p>
      </div>
      <div className="flex gap-8 flex-wrap justify-center">
        <ModuleCard
          title="氢气制取"
          description="计算制氢碳排放因子 e_j"
          path="/production"
          icon="⚗️"
        />
        <ModuleCard
          title="氢气加注"
          description="计算加注碳排放因子 e_r"
          path="/refueling"
          icon="⛽"
        />
        <ModuleCard
          title="用氢车"
          description="碳减排量化计算"
          path="/vehicle"
          icon="🚛"
        />
      </div>
    </div>
  );
}
