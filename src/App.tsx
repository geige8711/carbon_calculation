import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AppLayout from '@/components/layout/AppLayout';
import HomePage from '@/pages/Home/HomePage';
import ProductionPage from '@/pages/Production/ProductionPage';
import RefuelingPage from '@/pages/Refueling/RefuelingPage';
import TransportPage from '@/pages/Transport/TransportPage';
import VehiclePage from '@/pages/Vehicle/VehiclePage';
import StandardsPage from '@/pages/Standards/StandardsPage';
import NewsPage from '@/pages/News/NewsPage';
import AboutPage from '@/pages/About/AboutPage';
import ContactPage from '@/pages/Contact/ContactPage';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
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
    </BrowserRouter>
  );
}
