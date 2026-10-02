/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { AuthMode, TransitionSettings, UserAccount } from './types';
import { HeaderNav } from './components/HeaderNav';
import { BladeAuthCard } from './components/BladeAuthCard';
import { TransitionInspector } from './components/TransitionInspector';
import { WorkspaceApp } from './components/WorkspaceApp';
import { Toast, ToastData } from './components/Toast';

export default function App() {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [view, setView] = useState<'auth' | 'workspace'>('auth');
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [toast, setToast] = useState<ToastData | null>(null);

  // Blade dynamic settings
  const [settings, setSettings] = useState<TransitionSettings>({
    duration: 750,
    angle: 7.5,
    easing: 'cubic-bezier(0.77, 0, 0.175, 1)',
    soundEnabled: true,
  });

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ id: String(Date.now()), message, type });
  };

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3600);
    return () => clearTimeout(timer);
  }, [toast]);

  // Keyboard accessibility listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Do not intercept if user is typing inside an input or textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      if (e.key === 'i' || e.key === 'I') {
        setIsInspectorOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    // Smoothly enter workspace after brief delay so user perceives the feedback
    setTimeout(() => {
      setView('workspace');
    }, 700);
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    setView('auth');
    setMode('signin');
    showToast('Signed out of Maison Aurelia session.', 'info');
  };

  return (
    <div className="min-h-screen bg-[#071712] relative overflow-x-hidden selection:bg-[#c8a35a] selection:text-[#0a231b]">
      {/* Toast Notification */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />

      {/* Global Ambient Glow Orbs */}
      <div className="fixed top-1/4 -left-36 w-96 h-96 bg-emerald-950/40 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed -bottom-24 -right-24 w-96 h-96 bg-[#c8a35a]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Navigation (As in Image 1) */}
      <HeaderNav
        mode={mode}
        onModeChange={setMode}
        onOpenInspector={() => setIsInspectorOpen(true)}
        currentUser={currentUser}
        isInWorkspace={view === 'workspace'}
        onEnterWorkspace={() => setView('workspace')}
        onExitWorkspace={() => setView('auth')}
      />

      {/* Main Content Area */}
      {view === 'workspace' && currentUser ? (
        <WorkspaceApp
          user={currentUser}
          onSignOut={handleSignOut}
          onOpenInspector={() => setIsInspectorOpen(true)}
          onReturnToBladeDemo={() => setView('auth')}
          onShowToast={showToast}
        />
      ) : (
        <div className="bg-mesh-pattern min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 lg:p-12 relative pt-24 sm:pt-28 pb-16">
          {/* Main Auth Container Card */}
          <main className="w-full max-w-[1040px] relative z-10">
            <BladeAuthCard
              mode={mode}
              onModeChange={setMode}
              settings={settings}
              onLoginSuccess={handleLoginSuccess}
              onShowToast={showToast}
            />

            {/* Bottom Footnote info & accessibility tip (Exact as in Image 1) */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#f6f1e7]/40 px-3 gap-2">
              <div className="flex items-center space-x-2">
                <kbd className="px-2 py-0.5 rounded bg-[#133a2e] text-[#f6f1e7]/85 text-[10px] border border-white/10 font-mono">
                  Tab
                </kbd>
                <span>Full keyboard navigation &amp; screen reader accessible</span>
              </div>
              <div className="flex items-center space-x-4 text-[11px]">
                <span>
                  Easing: <code className="text-[#c8a35a]/80 font-mono">{settings.easing}</code>
                </span>
                <span>
                  Duration:{' '}
                  <code className="text-[#c8a35a]/80 font-mono tabular-nums">{settings.duration}ms</code>
                </span>
              </div>
            </div>
          </main>
        </div>
      )}

      {/* Transition Inspector Drawer */}
      <TransitionInspector
        settings={settings}
        onChange={setSettings}
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
      />
    </div>
  );
}
