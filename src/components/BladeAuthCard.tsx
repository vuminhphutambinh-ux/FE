import React, { useState } from 'react';
import {
  AuthMode,
  TransitionSettings,
  UserAccount,
} from '../types';
import {
  Layers,
  AtSign,
  Eye,
  EyeOff,
  ArrowRight,
  User,
  Mail,
  Check,
  ShieldCheck,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';
import { playBladeSweepSound, playClickSound } from '../utils/audio';

interface BladeAuthCardProps {
  mode: AuthMode;
  onModeChange: (newMode: AuthMode) => void;
  settings: TransitionSettings;
  onLoginSuccess: (user: UserAccount) => void;
  onShowToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const BladeAuthCard: React.FC<BladeAuthCardProps> = ({
  mode,
  onModeChange,
  settings,
  onLoginSuccess,
  onShowToast,
}) => {
  // Form input states - Sign In
  const [signinUser, setSigninUser] = useState('clara@aureliadesign.com');
  const [signinPassword, setSigninPassword] = useState('aurelia2025');
  const [showSigninPassword, setShowSigninPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const [signinErrors, setSigninErrors] = useState<{ user?: string; pass?: string }>({});

  // Form input states - Sign Up
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [signupErrors, setSignupErrors] = useState<{
    name?: string;
    email?: string;
    pass?: string;
    terms?: string;
  }>({});

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // Loading spinner during submit
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Transition handler
  const handleSwitchMode = (targetMode: AuthMode) => {
    if (mode === targetMode) return;
    if (settings.soundEnabled) {
      playBladeSweepSound();
    }
    onModeChange(targetMode);
  };

  // Demo auto-fill
  const handleFillDemo = () => {
    if (settings.soundEnabled) playClickSound();
    if (mode === 'signin') {
      setSigninUser('clara@aureliadesign.com');
      setSigninPassword('aurelia2025');
      onShowToast('Demo credentials inserted: clara@aureliadesign.com', 'info');
    } else {
      setSignupName('Julian Vance');
      setSignupEmail('julian@aureliadesign.com');
      setSignupPassword('aurelia2025');
      setTermsAccepted(true);
      onShowToast('Demo details filled.', 'info');
    }
  };

  // Validation
  const validateSignin = () => {
    const errors: { user?: string; pass?: string } = {};
    if (!signinUser.trim()) {
      errors.user = 'Please enter your username or email address.';
    } else if (signinUser.length < 3) {
      errors.user = 'Credential must be at least 3 characters.';
    }

    if (!signinPassword) {
      errors.pass = 'Please enter your password.';
    } else if (signinPassword.length < 6) {
      errors.pass = 'Password must be at least 6 characters.';
    }

    setSigninErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateSignup = () => {
    const errors: { name?: string; email?: string; pass?: string; terms?: string } = {};
    if (!signupName.trim()) {
      errors.name = 'Please provide your full name.';
    }
    if (!signupEmail.trim() || !signupEmail.includes('@')) {
      errors.email = 'Please provide a valid email format.';
    }
    if (!signupPassword || signupPassword.length < 8) {
      errors.pass = 'Password must be at least 8 characters.';
    }
    if (!termsAccepted) {
      errors.terms = 'You must accept the terms to proceed.';
    }

    setSignupErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submissions
  const handleSigninSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSignin()) {
      onShowToast('Please review the highlighted fields.', 'error');
      return;
    }

    setIsSubmitting(true);
    if (settings.soundEnabled) playClickSound();

    setTimeout(() => {
      setIsSubmitting(false);
      const user: UserAccount = {
        name: signinUser.includes('@')
          ? signinUser.split('@')[0].replace('.', ' ').replace(/^./, (s) => s.toUpperCase())
          : signinUser,
        email: signinUser.includes('@') ? signinUser : `${signinUser}@aureliadesign.com`,
        avatarLetter: signinUser.charAt(0).toUpperCase(),
        role: 'Senior Curator',
        joinedYear: 2025,
      };
      onLoginSuccess(user);
      onShowToast(`Welcome back, ${user.name}! Accessing workspace...`, 'success');
    }, 600);
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSignup()) {
      onShowToast('Please complete all required fields.', 'error');
      return;
    }

    setIsSubmitting(true);
    if (settings.soundEnabled) playClickSound();

    setTimeout(() => {
      setIsSubmitting(false);
      const user: UserAccount = {
        name: signupName,
        email: signupEmail,
        avatarLetter: signupName.charAt(0).toUpperCase(),
        role: 'Atelier Member',
        joinedYear: 2025,
      };
      onLoginSuccess(user);
      onShowToast('Account successfully created! Welcome to Maison Aurelia.', 'success');
    }, 650);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail || !forgotEmail.includes('@')) {
      onShowToast('Please enter a valid email address.', 'error');
      return;
    }
    setForgotSent(true);
    onShowToast(`Password recovery link sent to ${forgotEmail}`, 'success');
  };

  // Dynamic geometry for blade cut based on settings.angle
  // 7.5 deg gives roughly ~54% at top and ~44% at bottom on a 1040x650 card
  const deltaPct = Math.min(14, Math.max(0, (settings.angle / 7.5) * 5.2));
  const topCutIn = 50 + deltaPct;
  const botCutIn = 50 - deltaPct;

  const clipPathStyle =
    mode === 'signin' || mode === 'forgot'
      ? `polygon(0 0, ${topCutIn.toFixed(1)}% 0, ${botCutIn.toFixed(1)}% 100%, 0% 100%)`
      : `polygon(${botCutIn.toFixed(1)}% 0, 100% 0, 100% 100%, ${topCutIn.toFixed(1)}% 100%)`;

  const dynamicBladeLineRotation =
    mode === 'signin' || mode === 'forgot' ? -1 * settings.angle : settings.angle;

  const isSignMode = mode === 'signin';
  const isSignupMode = mode === 'signup';
  const isForgotMode = mode === 'forgot';

  return (
    <div
      className={`auth-card relative w-full max-w-[1040px] min-h-[640px] rounded-3xl sm:rounded-[32px] bg-[#f6f1e7] overflow-hidden border border-[#c8a35a]/30 transition-all ${
        isSignupMode ? 'state-signup' : 'state-signin'
      }`}
      style={{
        boxShadow:
          '0 25px 70px -15px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(200, 163, 90, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.25)',
      }}
    >
      {/* ======================================================== */}
      {/* 1. DYNAMIC DIAGONAL BLADE OVERLAY (Dark Forest Branding)  */}
      {/* ======================================================== */}
      <div
        className="blade-panel"
        style={{
          clipPath: typeof window !== 'undefined' && window.innerWidth >= 768 ? clipPathStyle : undefined,
          transitionDuration: `${settings.duration}ms`,
          transitionTimingFunction: settings.easing,
        }}
        aria-hidden="true"
      >
        {/* Subtle geometric dot mesh & gold ambience inside blade */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#c8a35a_1.2px,transparent_1.2px)] [background-size:22px_22px]" />
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-[#133a2e]/50 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 left-1/4 w-96 h-96 rounded-full bg-[#05140f]/90 blur-3xl pointer-events-none" />
      </div>

      {/* Gold Blade Cutting Edge Glowing Line */}
      <div
        className="blade-line hidden md:block"
        style={{
          left: '50%',
          transform: `rotate(${dynamicBladeLineRotation}deg) scaleY(1.18)`,
          transitionDuration: `${settings.duration}ms`,
          transitionTimingFunction: settings.easing,
        }}
        aria-hidden="true"
      />

      {/* ======================================================== */}
      {/* 2. BRANDING PANEL CONTENT (Floating above dark blade)    */}
      {/* Swaps horizontal position between SignIn (Left) and SignUp (Right) */}
      {/* ======================================================== */}
      <div
        className={`absolute inset-y-0 w-full md:w-[48%] z-30 pointer-events-none flex flex-col justify-between p-7 sm:p-10 lg:p-14 text-white transition-all`}
        style={{
          left:
            isSignupMode && typeof window !== 'undefined' && window.innerWidth >= 768
              ? '52%'
              : '0%',
          transitionDuration: `${settings.duration}ms`,
          transitionTimingFunction: settings.easing,
        }}
      >
        {/* Top: Brand Logo / Wordmark (As in Image 1) */}
        <div className="flex items-center space-x-3 pointer-events-auto">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#c8a35a] via-[#dfbf75] to-[#f4dfa6] flex items-center justify-center shadow-lg shadow-black/40 border border-white/20">
            <Layers className="w-5 h-5 text-[#0a231b]" />
          </div>
          <div>
            <span className="block text-[10px] uppercase tracking-[0.3em] font-semibold text-[#c8a35a] font-sans">
              Maison
            </span>
            <span className="block text-sm tracking-[0.25em] font-bold text-[#f6f1e7] font-serif">
              AURELIA
            </span>
          </div>
        </div>

        {/* Middle: Dynamic Branding Headlines with serif typography & gold italic accents */}
        <div className="my-auto py-6 pointer-events-auto max-w-sm">
          {/* Sign-in state branding message (Exact text from Image 1) */}
          <div
            className={`transition-all duration-500 transform ${
              isSignMode || isForgotMode
                ? 'opacity-100 translate-x-0 block'
                : 'opacity-0 -translate-x-8 hidden'
            }`}
          >
            <span className="inline-block px-3 py-1 mb-4 rounded-full text-[11px] font-semibold uppercase tracking-widest text-[#c8a35a] bg-[#133a2e]/70 border border-[#c8a35a]/30 shadow-inner">
              Welcome back
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-serif font-bold text-[#f6f1e7] leading-[1.18] mb-4">
              Step back into{' '}
              <em className="italic font-serif text-[#c8a35a] font-normal">timeless</em> focus.
            </h1>
            <p className="text-[#8ca097] text-sm sm:text-base leading-relaxed font-light">
              Your content, curated spaces, and personalized insights are right where you left them.
            </p>

            {/* Social proof avatar row (Exact as in Image 1) */}
            <div className="mt-8 flex items-center space-x-3.5 text-xs text-[#f6f1e7]/70">
              <div className="flex -space-x-2">
                <div className="w-7 h-7 rounded-full bg-[#c8a35a] border-2 border-[#0a231b] flex items-center justify-center text-[10px] text-[#0a231b] font-bold shadow-sm">
                  A
                </div>
                <div className="w-7 h-7 rounded-full bg-[#059669] border-2 border-[#0a231b] flex items-center justify-center text-[10px] text-white font-bold shadow-sm">
                  K
                </div>
                <div className="w-7 h-7 rounded-full bg-[#d97706] border-2 border-[#0a231b] flex items-center justify-center text-[10px] text-white font-bold shadow-sm">
                  L
                </div>
              </div>
              <span className="tracking-wide">Joined by 14,000+ creators</span>
            </div>
          </div>

          {/* Sign-up state branding message */}
          <div
            className={`transition-all duration-500 transform ${
              isSignupMode
                ? 'opacity-100 translate-x-0 block'
                : 'opacity-0 translate-x-8 hidden'
            }`}
          >
            <span className="inline-block px-3 py-1 mb-4 rounded-full text-[11px] font-semibold uppercase tracking-widest text-[#c8a35a] bg-[#133a2e]/70 border border-[#c8a35a]/30 shadow-inner">
              Membership
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-serif font-bold text-[#f6f1e7] leading-[1.18] mb-4">
              Start the{' '}
              <em className="italic font-serif text-[#c8a35a] font-normal">first page</em> of your story.
            </h1>
            <p className="text-[#8ca097] text-sm sm:text-base leading-relaxed font-light mb-6">
              One account for every device you own. Seamless cloud synchronization, private by design.
            </p>
            <div className="space-y-2.5 text-xs text-[#f6f1e7]/85">
              <div className="flex items-center space-x-2.5">
                <ShieldCheck className="w-4 h-4 text-[#c8a35a] shrink-0" />
                <span>End-to-end encrypted personal workspace</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Check className="w-4 h-4 text-[#c8a35a] shrink-0" />
                <span>Zero advertisements, privacy guaranteed</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Sparkles className="w-4 h-4 text-[#c8a35a] shrink-0" />
                <span>Curated typographic monograph archives</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: Subtle brand credential (As in Image 1) */}
        <div className="text-[11px] text-[#f6f1e7]/45 uppercase tracking-[0.25em] pointer-events-auto">
          Crafted with care &bull; Est. 2025
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. INTERACTIVE FORM PANELS (Cream background layer)      */}
      {/* Swaps positions: SignIn (Right) and SignUp (Left)        */}
      {/* ======================================================== */}
      <div className="relative z-20 w-full min-h-[640px] flex flex-col justify-center">
        <div className="grid grid-cols-1 md:grid-cols-12 h-full">

          {/* ======================================== */}
          {/* A. SIGN IN PANEL (Right half: cols 7-12) */}
          {/* ======================================== */}
          <div
            className={`md:col-start-7 md:col-span-6 p-7 sm:p-10 lg:p-14 flex flex-col justify-center transition-all ${
              isSignMode
                ? 'opacity-100 translate-x-0 block'
                : 'opacity-0 translate-x-12 hidden'
            }`}
            style={{
              transitionDuration: `${settings.duration * 0.75}ms`,
              transitionTimingFunction: settings.easing,
            }}
          >
            <div className="max-w-md w-full mx-auto">
              {/* Form Header (As in Image 1) */}
              <div className="mb-7">
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1b2923] tracking-tight gold-underline">
                  Sign in
                </h2>
                <p className="text-xs sm:text-sm text-[#1b2923]/65 mt-4">
                  Please enter your credentials to access your workspace.
                </p>
              </div>

              {/* Sign In Form */}
              <form onSubmit={handleSigninSubmit} noValidate className="space-y-6">
                {/* Username or Email Input (Underline only style with @ icon) */}
                <div className="underline-input-group">
                  <label
                    htmlFor="signinUser"
                    className="block text-[11px] font-semibold uppercase tracking-wider text-[#1b2923]/70 mb-1"
                  >
                    Username or email
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="signinUser"
                      name="username"
                      required
                      autoComplete="username"
                      value={signinUser}
                      onChange={(e) => {
                        setSigninUser(e.target.value);
                        if (signinErrors.user) setSigninErrors({ ...signinErrors, user: undefined });
                      }}
                      placeholder="e.g. clara@aureliadesign.com"
                      className={`underline-input ${signinErrors.user ? 'has-error' : ''}`}
                    />
                    <div className="input-accent-bar" />
                    <span className="absolute right-2 top-3 text-[#1b2923]/40 pointer-events-none">
                      <AtSign className="w-4 h-4" />
                    </span>
                  </div>
                  {signinErrors.user && (
                    <p className="text-[11px] text-red-600 mt-1.5 flex items-center gap-1">
                      <span>{signinErrors.user}</span>
                    </p>
                  )}
                </div>

                {/* Password Input (Underline only + Eye toggle icon) */}
                <div className="underline-input-group">
                  <label
                    htmlFor="signinPassword"
                    className="block text-[11px] font-semibold uppercase tracking-wider text-[#1b2923]/70 mb-1"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showSigninPassword ? 'text' : 'password'}
                      id="signinPassword"
                      name="password"
                      required
                      autoComplete="current-password"
                      value={signinPassword}
                      onChange={(e) => {
                        setSigninPassword(e.target.value);
                        if (signinErrors.pass) setSigninErrors({ ...signinErrors, pass: undefined });
                      }}
                      placeholder="••••••••••••"
                      className={`underline-input ${signinErrors.pass ? 'has-error' : ''}`}
                    />
                    <div className="input-accent-bar" />
                    <button
                      type="button"
                      onClick={() => setShowSigninPassword(!showSigninPassword)}
                      className="absolute right-2 top-3 text-[#1b2923]/40 hover:text-[#1b2923] focus:outline-none focus:text-[#c8a35a] transition-colors"
                      title={showSigninPassword ? 'Hide password' : 'Show password'}
                      aria-label="Toggle password visibility"
                    >
                      {showSigninPassword ? (
                        <EyeOff className="w-4 h-4 text-[#c8a35a]" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {signinErrors.pass && (
                    <p className="text-[11px] text-red-600 mt-1.5 flex items-center gap-1">
                      <span>{signinErrors.pass}</span>
                    </p>
                  )}
                </div>

                {/* Keep me signed in + Forgot password? */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center space-x-2.5 cursor-pointer text-[#1b2923]/80 hover:text-[#1b2923] select-none">
                    <input
                      type="checkbox"
                      checked={keepSignedIn}
                      onChange={(e) => setKeepSignedIn(e.target.checked)}
                      className="custom-checkbox"
                    />
                    <span className="font-medium">Keep me signed in</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => handleSwitchMode('forgot')}
                    className="font-semibold text-[#c8a35a] hover:text-[#b59247] underline underline-offset-4 decoration-[#c8a35a]/60 hover:decoration-[#b59247] transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Sign In Button (Pill in dark forest green with gold right arrow) */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-forest-pill w-full py-3.5 px-6 rounded-full text-white font-medium tracking-wide text-sm flex items-center justify-center space-x-2 group focus:ring-2 focus:ring-[#c8a35a] focus:ring-offset-2 outline-none cursor-pointer disabled:opacity-75"
                  >
                    <span>{isSubmitting ? 'Authenticating...' : 'Sign in'}</span>
                    <ArrowRight className="w-4 h-4 text-[#c8a35a] transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </div>

                {/* Bottom link: New to Aurelia? Create an account */}
                <div className="pt-3 text-center text-xs text-[#1b2923]/70">
                  New to Aurelia?{' '}
                  <button
                    type="button"
                    onClick={() => handleSwitchMode('signup')}
                    className="font-bold text-[#0e2e24] hover:text-[#133a2e] underline underline-offset-4 decoration-[#c8a35a] decoration-2 transition-colors ml-1 focus:outline-none focus:ring-1 focus:ring-[#c8a35a] rounded px-1"
                  >
                    Create an account
                  </button>
                </div>

                {/* Demo quick auto-fill helper */}
                <div className="pt-1 text-center">
                  <button
                    type="button"
                    onClick={handleFillDemo}
                    className="inline-flex items-center gap-1.5 text-[11px] text-[#1b2923]/50 hover:text-[#0e2e24] transition-colors"
                  >
                    <Sparkles className="w-3 h-3 text-[#c8a35a]" />
                    <span>Auto-fill test credentials</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* =========================================== */}
          {/* B. SIGN UP PANEL (Left half: cols 1-6)      */}
          {/* =========================================== */}
          <div
            className={`md:col-start-1 md:col-span-6 p-7 sm:p-10 lg:p-14 flex flex-col justify-center transition-all ${
              isSignupMode
                ? 'opacity-100 translate-x-0 block'
                : 'opacity-0 -translate-x-12 hidden'
            }`}
            style={{
              transitionDuration: `${settings.duration * 0.75}ms`,
              transitionTimingFunction: settings.easing,
            }}
          >
            <div className="max-w-md w-full mx-auto">
              {/* Form Header */}
              <div className="mb-7">
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1b2923] tracking-tight gold-underline">
                  Create account
                </h2>
                <p className="text-xs sm:text-sm text-[#1b2923]/65 mt-4">
                  Join our distinguished ecosystem of authors and curators.
                </p>
              </div>

              {/* Create Account Form */}
              <form onSubmit={handleSignupSubmit} noValidate className="space-y-5">
                {/* Full name input */}
                <div className="underline-input-group">
                  <label
                    htmlFor="signupName"
                    className="block text-[11px] font-semibold uppercase tracking-wider text-[#1b2923]/70 mb-1"
                  >
                    Full name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="signupName"
                      name="fullname"
                      required
                      autoComplete="name"
                      value={signupName}
                      onChange={(e) => {
                        setSignupName(e.target.value);
                        if (signupErrors.name) setSignupErrors({ ...signupErrors, name: undefined });
                      }}
                      placeholder="e.g. Julian Vance"
                      className={`underline-input ${signupErrors.name ? 'has-error' : ''}`}
                    />
                    <div className="input-accent-bar" />
                    <span className="absolute right-2 top-3 text-[#1b2923]/40 pointer-events-none">
                      <User className="w-4 h-4" />
                    </span>
                  </div>
                  {signupErrors.name && (
                    <p className="text-[11px] text-red-600 mt-1.5">{signupErrors.name}</p>
                  )}
                </div>

                {/* Email address input */}
                <div className="underline-input-group">
                  <label
                    htmlFor="signupEmail"
                    className="block text-[11px] font-semibold uppercase tracking-wider text-[#1b2923]/70 mb-1"
                  >
                    Email address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="signupEmail"
                      name="email"
                      required
                      autoComplete="email"
                      value={signupEmail}
                      onChange={(e) => {
                        setSignupEmail(e.target.value);
                        if (signupErrors.email) setSignupErrors({ ...signupErrors, email: undefined });
                      }}
                      placeholder="e.g. julian@aureliadesign.com"
                      className={`underline-input ${signupErrors.email ? 'has-error' : ''}`}
                    />
                    <div className="input-accent-bar" />
                    <span className="absolute right-2 top-3 text-[#1b2923]/40 pointer-events-none">
                      <Mail className="w-4 h-4" />
                    </span>
                  </div>
                  {signupErrors.email && (
                    <p className="text-[11px] text-red-600 mt-1.5">{signupErrors.email}</p>
                  )}
                </div>

                {/* Password input */}
                <div className="underline-input-group">
                  <label
                    htmlFor="signupPassword"
                    className="block text-[11px] font-semibold uppercase tracking-wider text-[#1b2923]/70 mb-1"
                  >
                    Create password
                  </label>
                  <div className="relative">
                    <input
                      type={showSignupPassword ? 'text' : 'password'}
                      id="signupPassword"
                      name="password"
                      required
                      autoComplete="new-password"
                      value={signupPassword}
                      onChange={(e) => {
                        setSignupPassword(e.target.value);
                        if (signupErrors.pass) setSignupErrors({ ...signupErrors, pass: undefined });
                      }}
                      placeholder="••••••••••••"
                      className={`underline-input ${signupErrors.pass ? 'has-error' : ''}`}
                    />
                    <div className="input-accent-bar" />
                    <button
                      type="button"
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                      className="absolute right-2 top-3 text-[#1b2923]/40 hover:text-[#1b2923] focus:outline-none transition-colors"
                      title={showSignupPassword ? 'Hide password' : 'Show password'}
                      aria-label="Toggle password visibility"
                    >
                      {showSignupPassword ? (
                        <EyeOff className="w-4 h-4 text-[#c8a35a]" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-[11px] text-[#1b2923]/50 mt-1">
                    Use 8 characters or more with mixed letters & numbers
                  </p>
                  {signupErrors.pass && (
                    <p className="text-[11px] text-red-600 mt-1">{signupErrors.pass}</p>
                  )}
                </div>

                {/* Terms checkbox */}
                <div className="flex items-start space-x-2.5 text-xs pt-1">
                  <input
                    type="checkbox"
                    id="termsAgree"
                    checked={termsAccepted}
                    onChange={(e) => {
                      setTermsAccepted(e.target.checked);
                      if (signupErrors.terms) setSignupErrors({ ...signupErrors, terms: undefined });
                    }}
                    className="custom-checkbox mt-0.5"
                  />
                  <label htmlFor="termsAgree" className="text-[#1b2923]/80 leading-snug cursor-pointer select-none">
                    I agree to the{' '}
                    <span className="text-[#c8a35a] underline font-semibold">Terms of Service</span> and{' '}
                    <span className="text-[#c8a35a] underline font-semibold">Privacy Policy</span>.
                  </label>
                </div>
                {signupErrors.terms && (
                  <p className="text-[11px] text-red-600 -mt-2">{signupErrors.terms}</p>
                )}

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-forest-pill w-full py-3.5 px-6 rounded-full text-white font-medium tracking-wide text-sm flex items-center justify-center space-x-2 group focus:ring-2 focus:ring-[#c8a35a] focus:ring-offset-2 outline-none cursor-pointer disabled:opacity-75"
                  >
                    <span>{isSubmitting ? 'Creating workspace...' : 'Create account'}</span>
                    <ArrowRight className="w-4 h-4 text-[#c8a35a] transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </div>

                {/* Return link */}
                <div className="pt-2 text-center text-xs text-[#1b2923]/70">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => handleSwitchMode('signin')}
                    className="font-bold text-[#0e2e24] hover:text-[#133a2e] underline underline-offset-4 decoration-[#c8a35a] decoration-2 transition-colors ml-1 focus:outline-none focus:ring-1 focus:ring-[#c8a35a] rounded px-1"
                  >
                    Sign in
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* =================================================== */}
          {/* C. FORGOT PASSWORD PANEL (Right half: cols 7-12)    */}
          {/* =================================================== */}
          <div
            className={`md:col-start-7 md:col-span-6 p-7 sm:p-10 lg:p-14 flex flex-col justify-center transition-all ${
              isForgotMode
                ? 'opacity-100 translate-x-0 block'
                : 'opacity-0 translate-x-12 hidden'
            }`}
            style={{
              transitionDuration: `${settings.duration * 0.75}ms`,
              transitionTimingFunction: settings.easing,
            }}
          >
            <div className="max-w-md w-full mx-auto">
              <div className="mb-7">
                <button
                  type="button"
                  onClick={() => handleSwitchMode('signin')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0e2e24] hover:text-[#c8a35a] mb-4 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Sign in</span>
                </button>
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1b2923] tracking-tight gold-underline">
                  Reset password
                </h2>
                <p className="text-xs sm:text-sm text-[#1b2923]/65 mt-4">
                  Enter your registered email address to receive password recovery instructions.
                </p>
              </div>

              {forgotSent ? (
                <div className="bg-[#133a2e]/10 border border-[#c8a35a]/30 rounded-2xl p-6 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-[#133a2e] text-[#c8a35a] flex items-center justify-center mx-auto">
                    <Mail className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#1b2923]">
                    Instructions Dispatched
                  </h3>
                  <p className="text-xs text-[#1b2923]/70 leading-relaxed">
                    We sent a secure recovery link to <span className="font-semibold text-[#0e2e24]">{forgotEmail}</span>.
                    Please review your inbox or spam folder.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotSent(false);
                      handleSwitchMode('signin');
                    }}
                    className="btn-forest-pill w-full py-2.5 px-4 rounded-full text-white text-xs font-medium"
                  >
                    Back to Sign In
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} className="space-y-6">
                  <div className="underline-input-group">
                    <label
                      htmlFor="forgotEmail"
                      className="block text-[11px] font-semibold uppercase tracking-wider text-[#1b2923]/70 mb-1"
                    >
                      Registered email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        id="forgotEmail"
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="e.g. clara@aureliadesign.com"
                        className="underline-input"
                      />
                      <div className="input-accent-bar" />
                      <span className="absolute right-2 top-3 text-[#1b2923]/40 pointer-events-none">
                        <Mail className="w-4 h-4" />
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn-forest-pill w-full py-3.5 px-6 rounded-full text-white font-medium tracking-wide text-sm flex items-center justify-center space-x-2 group focus:ring-2 focus:ring-[#c8a35a]"
                  >
                    <span>Send recovery instructions</span>
                    <ArrowRight className="w-4 h-4 text-[#c8a35a] transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
