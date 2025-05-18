import { cn } from '@/lib/utils';

export function StatusDot({ ok }: { ok: boolean }) {
  return (
    <span
      className={cn(
        'inline-block h-3 w-3 rounded-full',
        ok ? 'bg-success-500' : 'bg-error-500'
      )}
      aria-label={ok ? 'status ok' : 'status error'}
    ></span>
  );
}
