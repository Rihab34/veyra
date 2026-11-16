import { ArrowLeft, LogOut } from 'lucide-react';
import { Logo } from './Logo';
import { useApp } from '@/context/AppContext';

interface AppHeaderProps {
  showBack?: boolean;
  backPath?: string;
}

export function AppHeader({ showBack, backPath = '/' }: AppHeaderProps) {
  const { navigate, session, guest, signOut } = useApp();
  const exitLabel = session ? 'Sign out' : 'Exit guest mode';

  return (
    <header className="sticky top-4 z-30 mx-auto max-w-[1200px] rounded-xl border border-white/30 bg-white/15 backdrop-blur-md">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          {showBack && (
            <button onClick={() => navigate(backPath)} className="btn-ghost -ml-2" aria-label="Go back">
              <ArrowLeft size={18} />
            </button>
          )}
          <button onClick={() => navigate('/dashboard')} className="transition-opacity hover:opacity-80">
            <Logo size="sm" />
          </button>
        </div>
        {(session || guest) && (
          <button onClick={() => signOut()} className="btn-ghost" aria-label={exitLabel} title={exitLabel}>
            <LogOut size={16} />
            <span className="hidden sm:inline">{exitLabel}</span>
          </button>
        )}
      </div>
    </header>
  );
}
