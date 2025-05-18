import { useEffect, useState } from 'react';
import { healthApi } from '@/lib/api-client';

export function StatusBar() {
  const [ok, setOk] = useState<boolean | null>(null);

  useEffect(() => {
    healthApi
      .check()
      .then(() => setOk(true))
      .catch(() => setOk(false));
  }, []);

  return (
    <div className="flex items-center space-x-1 text-sm">
      <span>API</span>
      <span
        className={`h-3 w-3 rounded-full ${ok ? 'bg-green-500' : 'bg-red-500'}`}
        aria-label={ok ? 'api up' : 'api down'}
      />
    </div>
  );
}
