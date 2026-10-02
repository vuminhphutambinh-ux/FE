import React from 'react';
import { AuthMode, UserAccount } from '../types';
import { Sliders, LayoutDashboard, LogOut } from 'lucide-react';

interface HeaderNavProps {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
  onOpenInspector: () => void;
  currentUser: UserAccount | null;
  onEnterWorkspace: () => void;
  isInWorkspace: boolean;
  onExitWorkspace: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  mode,
  onModeChange,
  onOpenInspector,
  currentUser,
  onEnterWorkspace,
  isInWorkspace,
  onExitWorkspace,
}) => {
  return (
    <header className="fixed top-4 left-0 right-0 z-40 px-4 sm:px-8 flex items-center justify-between max-w-6xl mx-auto pointer-events-none">
      {/* Left Badge: DIAGONAL BLADE TRANSITION UI (As in Image 1) */}
      <div className="pointer-events-auto flex items-center space-x-2.5 bg-[#0a231b]/85 backdrop-blur-md px-4 py-2 rounded-full border border-[#c8a35a]/30 shadow-xl transition-all hover:border-[#c8a35a]/50">
        <span className="w-2 h-2 rounded-full bg-[#c8a35a] animate-pulse shadow-[0_0_8px_#c8a35a]" />
        <span className="text-[11px] uppercase tracking-widest text-[#f6f1e7]/90 font-medium whitespace-nowrap">
          Diagonal Blade Transition UI
        </span>
      </div>

      {/* Right Controls */}
      <div className="pointer-events-auto flex items-center gap-2">
        {/* If in Workspace: button to return to Blade UI */}
        {isInWorkspace ? (
          <div className="flex items-center gap-2 bg-[#0a231b]/90 backdrop-blur-md p-1.5 rounded-full border border-[#c8a35a]/35 shadow-xl">
            <button
              onClick={onExitWorkspace}
              className="px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 text-[#c8a35a] bg-[#133a2e]/80 border border-[#c8a35a]/40 shadow flex items-center gap-1.5 hover:bg-[#133a2e]"
            >
              <span>Blade Auth Showcase</span>
            </button>
            <button
              onClick={onExitWorkspace}
              className="p-1.5 rounded-full text-white/60 hover:text-white transition-colors"
              title="Sign out"
              aria-label="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* When in Auth mode: show exact top bar from Image 1 */
          <div className="flex items-center gap-2">
            {/* Inspector Toggle */}
            <button
              onClick={onOpenInspector}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white/80 bg-[#0a231b]/80 backdrop-blur-md border border-white/10 hover:border-[#c8a35a]/40 hover:text-white transition-all shadow-md"
              title="Tune blade angle, duration and curve"
            >
              <Sliders className="w-3.5 h-3.5 text-[#c8a35a]" />
              <span>Blade Studio</span>
            </button>

            {/* Quick Workspace Peek if logged in or direct test */}
            {currentUser && (
              <button
                onClick={onEnterWorkspace}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-[#c8a35a] bg-[#0a231b]/80 backdrop-blur-md border border-[#c8a35a]/30 hover:bg-[#133a2e] transition-all shadow-md"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Open Workspace</span>
              </button>
            )}

            {/* Mode Toggle Switch (SIGN IN | CREATE ACCOUNT) */}
            <div className="flex items-center bg-[#0a231b]/90 backdrop-blur-md p-1 rounded-full border border-[#c8a35a]/35 shadow-xl">
              <button
                onClick={() => onModeChange('signin')}
                className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${
                  mode === 'signin'
                    ? 'text-[#c8a35a] bg-[#133a2e]/90 border border-[#c8a35a]/50 shadow-[0_0_12px_rgba(200,163,90,0.2)]'
                    : 'text-[#f6f1e7]/60 hover:text-[#f6f1e7]'
                }`}
              >
                Sign in
              </button>
              <button
                onClick={() => onModeChange('signup')}
                className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${
                  mode === 'signup'
                    ? 'text-[#c8a35a] bg-[#133a2e]/90 border border-[#c8a35a]/50 shadow-[0_0_12px_rgba(200,163,90,0.2)]'
                    : 'text-[#f6f1e7]/60 hover:text-[#f6f1e7]'
                }`}
              >
                Create account
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
