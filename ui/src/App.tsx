import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import { ServicesPage } from './pages/services-page';
import { LoginPage } from './pages/login-page';
import { AdminConfigPage } from './pages/admin-config-page';
import { DashboardPage } from './pages/dashboard-page';
import { MappingsPage } from './pages/mappings-page';
import { useHotkey } from './lib/use-hotkey';

function AppRoutes() {
  const navigate = useNavigate();
  useHotkey(['g', 'm'], () => navigate('/mappings'));
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/services" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/mappings" element={<MappingsPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/admin" element={<AdminConfigPage />} />
      </Routes>
      <Toaster />
    </>
  );
}

export function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <AppRoutes />
      </div>
    </Router>
  );
}

export default App;
