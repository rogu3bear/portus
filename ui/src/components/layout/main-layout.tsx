import { ReactNode } from 'react';
import { useTheme } from '../../providers/theme-provider';
import { Button } from '../ui/button';
import { Moon, Sun, LogOut } from 'lucide-react';
import { useAuth } from '../../providers/auth-provider';
import { useNavigate } from 'react-router-dom';

export function MainLayout({ children }: { children: ReactNode }) {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <h1 className="text-xl font-bold">Portus</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              {user ?? 'anonymous'}
            </span>
            {user ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                aria-label="Logout"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/login')}
                aria-label="Login"
              >
                <LogOut className="h-5 w-5 transform rotate-180" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </header>
      <main className="container py-8">{children}</main>
      <footer className="border-t py-4">
        <div className="container text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Portus. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
