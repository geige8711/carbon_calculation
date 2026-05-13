import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { lazy, Suspense } from 'react';
import AppLayout from '@/components/layout/AppLayout';

const HomePage = lazy(() => import('@/pages/Home/HomePage'));
const ProductionPage = lazy(() => import('@/pages/Production/ProductionPage'));
const RefuelingPage = lazy(() => import('@/pages/Refueling/RefuelingPage'));
const TransportPage = lazy(() => import('@/pages/Transport/TransportPage'));
const VehiclePage = lazy(() => import('@/pages/Vehicle/VehiclePage'));
const StandardsPage = lazy(() => import('@/pages/Standards/StandardsPage'));
const NewsPage = lazy(() => import('@/pages/News/NewsPage'));
const AboutPage = lazy(() => import('@/pages/About/AboutPage'));
const ContactPage = lazy(() => import('@/pages/Contact/ContactPage'));

function RouteFallback() {
  return (
    <div className="flex items-center justify-center min-h-[40vh] text-gray-500 text-sm">
      正在加载页面...
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/production" element={<ProductionPage />} />
            <Route path="/refueling" element={<RefuelingPage />} />
            <Route path="/transport" element={<TransportPage />} />
            <Route path="/vehicle" element={<VehiclePage />} />
            <Route path="/standards" element={<StandardsPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
