import { useQuery } from '@tanstack/react-query';
import { MainLayout } from '../components/layout/main-layout';
import { authApi } from '../lib/api-client';

export function DashboardPage() {
  const { data } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => authApi.status().then((res) => res.data),
  });

  return (
    <MainLayout>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p>
          Logged in as:{' '}
          <span className="font-medium">{data?.user ?? 'anonymous'}</span>
        </p>
        <a
          href="/mappings"
          className="text-primary underline focus:outline-none focus:ring"
        >
          View All Mappings
        </a>
      </div>
    </MainLayout>
  );
}
