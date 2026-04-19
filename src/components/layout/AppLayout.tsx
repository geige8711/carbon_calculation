import { Outlet } from 'react-router-dom';
import Header from './Header';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6 flex-1 w-full">
        <Outlet />
      </main>
      <footer className="text-center text-sm text-gray-400 py-4 border-t border-gray-200">
        <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600">
          浙ICP备2026024561号-1
        </a>
      </footer>
    </div>
  );
}
