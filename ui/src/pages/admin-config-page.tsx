import { useQuery, useMutation } from '@tanstack/react-query';
import { MainLayout } from '../components/layout/main-layout';
import { authApi } from '../lib/api-client';
import { Button } from '../components/ui/button';
import { useState, useEffect } from 'react';

export function AdminConfigPage() {
  const { data, refetch } = useQuery({
    queryKey: ['auth-config'],
    queryFn: () => authApi.getConfig().then((res) => res.data),
  });

  const mutation = useMutation({
    mutationFn: (payload: { auth_enabled?: boolean; session_expiry_minutes?: number }) =>
      authApi.updateConfig(payload).then((res) => res.data),
    onSuccess: () => refetch(),
  });

  const [enabled, setEnabled] = useState<boolean>(true);
  const [expiry, setExpiry] = useState<number>(10080);

  useEffect(() => {
    if (data) {
      setEnabled(data.auth_enabled);
      setExpiry(data.session_expiry_minutes);
    }
  }, [data]);

  const handleSave = () => {
    mutation.mutate({ auth_enabled: enabled, session_expiry_minutes: expiry });
  };

  return (
    <MainLayout>
      <h2 className="mb-4 text-2xl font-bold tracking-tight">Auth Configuration</h2>
      {data && (
        <div className="space-y-4 max-w-md">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
            />
            <span>Authentication Enabled</span>
          </label>
          <label className="flex flex-col">
            <span>Session Expiry Minutes</span>
            <input
              type="number"
              className="border p-2"
              value={expiry}
              onChange={(e) => setExpiry(Number(e.target.value))}
            />
          </label>
          <Button onClick={handleSave} disabled={mutation.isPending}>Save</Button>
        </div>
      )}
    </MainLayout>
  );
}
