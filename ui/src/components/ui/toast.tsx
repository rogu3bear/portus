import * as React from 'react';
import { X } from 'lucide-react';

import { cn } from '../../lib/utils';

type ToastProps = {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: 'default' | 'destructive';
  onDismiss?: () => void;
  className?: string;
};

export function Toast({
  title,
  description,
  action,
  variant = 'default',
  onDismiss,
  className,
}: ToastProps) {
  return (
    <div
      className={cn(
        'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg',
        {
          'bg-background text-foreground': variant === 'default',
          'bg-destructive text-destructive-foreground': variant === 'destructive',
        },
        className
      )}
    >
      <div className="grid gap-1">
        {title && <div className="text-sm font-semibold">{title}</div>}
        {description && (
          <div className="text-sm opacity-90">{description}</div>
        )}
      </div>
      {action}
      <button
        onClick={onDismiss}
        className={cn(
          'absolute right-2 top-2 rounded-md p-1 opacity-0 transition-opacity group-hover:opacity-100',
          {
            'text-foreground/50 hover:text-foreground': variant === 'default',
            'text-destructive-foreground/50 hover:text-destructive-foreground':
              variant === 'destructive',
          }
        )}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </button>
    </div>
  );
}

type ToastActionProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  altText: string;
};

export function ToastAction({
  className,
  altText,
  children,
  ...props
}: ToastActionProps) {
  return (
    <button
      className={cn(
        'inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        className
      )}
      {...props}
    >
      {children}
      <span className="sr-only">{altText}</span>
    </button>
  );
}

type ToastProviderProps = {
  children: React.ReactNode;
};

export function ToastProvider({ children }: ToastProviderProps) {
  return <div className="fixed inset-0 pointer-events-none">{children}</div>;
}

type ToastViewportProps = {
  className?: string;
};

export function ToastViewport({ className }: ToastViewportProps) {
  return (
    <div
      className={cn(
        'fixed top-0 z-[100] flex flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]',
        className
      )}
    />
  );
}
