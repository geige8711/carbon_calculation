import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AppLayout from '@/components/layout/AppLayout';
import HomePage from '@/pages/Home/HomePage';
import ProductionPage from '@/pages/Production/ProductionPage';
import RefuelingPage from '@/pages/Refueling/RefuelingPage';
import VehiclePage from '@/pages/Vehicle/VehiclePage';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/production" element={<ProductionPage />} />
          <Route path="/refueling" element={<RefuelingPage />} />
          <Route path="/vehicle" element={<VehiclePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
