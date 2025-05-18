import { useEffect } from 'react';

export function useHotkey(keys: string[], callback: () => void) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (keys.every((k) => (k === 'ctrl' ? e.ctrlKey : e.key.toLowerCase() === k))) {
        callback();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [keys, callback]);
}
