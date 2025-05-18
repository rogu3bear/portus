import { QueryProvider } from './query-provider';
import { ThemeProvider } from './theme-provider';
import { AuthProvider } from './auth-provider';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        <ThemeProvider defaultTheme="system" storageKey="portus-ui-theme">
          {children}
        </ThemeProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
