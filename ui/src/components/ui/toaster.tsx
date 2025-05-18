import { useState, useEffect } from 'react';
import { Toast, ToastProvider } from './toast';

type ToastType = {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  duration?: number;
};

type ToastWithTimer = ToastType & {
  timer: ReturnType<typeof setTimeout>;
};

let toasts: ToastWithTimer[] = [];
let listeners: Array<() => void> = [];

function createToast(toast: ToastType) {
  const id = Math.random().toString(36).substring(2, 9);
  const timer = setTimeout(() => {
    removeToast(id);
  }, toast.duration || 5000);

  const newToast = { ...toast, id, timer };
  toasts = [newToast, ...toasts];
  emitChange();
  return id;
}

function dismissToast(id: string) {
  const toast = toasts.find((t) => t.id === id);
  if (toast) {
    clearTimeout(toast.timer);
    toasts = toasts.filter((t) => t.id !== id);
    emitChange();
  }
}

function removeToast(id: string) {
  toasts = toasts.filter((t) => t.id !== id);
  emitChange();
}

function emitChange() {
  listeners.forEach((listener) => listener());
}

export function useToast() {
  const [toastsState, setToastsState] = useState<ToastWithTimer[]>([]);

  useEffect(() => {
    const listener = () => setToastsState([...toasts]);
    listeners.push(listener);
    listener();
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  return {
    toasts: toastsState,
    toast: createToast,
    dismiss: dismissToast,
  };
}

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <ToastProvider>
      <div className="ToastViewport">
        {toasts.map(({ id, title, description, variant }) => (
          <Toast
            key={id}
            id={id}
            title={title}
            description={description}
            variant={variant}
            onDismiss={() => dismiss(id)}
            className="mb-2"
          />
        ))}
      </div>
    </ToastProvider>
  );
}
