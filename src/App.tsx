import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './Layout';
import DeviceDetail from './pages/DeviceDetail';

// Dashboard component (placeholder for now, or redirect to first device)
const DashboardRedirect = () => <Navigate to="/device/1" replace />;

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardRedirect />} />
          <Route path="device/:id" element={<DeviceDetail />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
