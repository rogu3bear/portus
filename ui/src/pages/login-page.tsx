import { MainLayout } from '../components/layout/main-layout';
import { LoginForm } from '../components/auth/login-form';

export function LoginPage() {
  return (
    <MainLayout>
      <h2 className="mb-4 text-2xl font-bold tracking-tight">Login</h2>
      <LoginForm />
    </MainLayout>
  );
}
