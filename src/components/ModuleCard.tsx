import { useNavigate } from 'react-router-dom';

interface ModuleCardProps {
  title: string;
  description: string;
  path: string;
  icon: string;
}

export default function ModuleCard({ title, description, path, icon }: ModuleCardProps) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(path)}
      className="flex flex-col items-center gap-3 p-8 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-green-400 transition-all cursor-pointer min-w-[200px] flex-1"
    >
      <span className="text-4xl">{icon}</span>
      <h3 className="text-lg font-bold text-gray-800">{title}</h3>
      <p className="text-sm text-gray-500 text-center">{description}</p>
    </button>
  );
}
