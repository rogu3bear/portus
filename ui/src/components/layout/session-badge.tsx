import { useEffect, useState } from 'react';
import { authApi } from '@/lib/api-client';

export function SessionBadge() {
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    authApi
      .status()
      .then((res) => setUser(res.data.user ?? null))
      .catch(() => setUser(null));
  }, []);

  return (
    <div className="text-sm" aria-label="session-user">
      {user ? `Session: ${user}` : 'Session: none'}
    </div>
  );
}
