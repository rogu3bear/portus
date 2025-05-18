import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import { ServicesPage } from './pages/services-page';
import { LoginPage } from './pages/login-page';
import { AdminConfigPage } from './pages/admin-config-page';
import { DashboardPage } from './pages/dashboard-page';

export function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<Navigate to="/services" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/admin" element={<AdminConfigPage />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
