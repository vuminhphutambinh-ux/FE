import React, { useState, useEffect } from 'react';
import { UserAccount, CuratedSpaceItem } from '../types';
import {
  Layers,
  Sparkles,
  BookOpen,
  Compass,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Search,
  Plus,
  Bookmark,
  Share2,
  ArrowUpRight,
  TrendingUp,
  Award,
  LogOut,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface WorkspaceAppProps {
  user: UserAccount;
  onSignOut: () => void;
  onOpenInspector: () => void;
  onReturnToBladeDemo: () => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const WorkspaceApp: React.FC<WorkspaceAppProps> = ({
  user,
  onSignOut,
  onOpenInspector,
  onReturnToBladeDemo,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'spaces' | 'focus' | 'insights'>('spaces');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Curated spaces database
  const [spaces, setSpaces] = useState<CuratedSpaceItem[]>([
    {
      id: 'sp-1',
      title: 'Monograph: The Golden Proportion in Brutalist Forms',
      category: 'Monographs',
      description:
        'An exhaustive photographic essay on monolithic cast concrete, geometric precision, and natural light channels in mid-century civic architecture.',
      curator: 'Clara Vance',
      date: 'March 2026',
      tags: ['Architecture', 'Geometry', 'Monograph'],
      readingTime: '8 min read',
      accentColor: '#c8a35a',
    },
    {
      id: 'sp-2',
      title: 'Typographic Specimen: Aurelia Antiqua No. 4',
      category: 'Typography',
      description:
        'A high-contrast display serif designed for grand editorial mastheads, featuring razor-thin hairlines, sculpted terminals, and Renaissance italic swashes.',
      curator: 'Julian Vance',
      date: 'February 2026',
      tags: ['Type Design', 'Serif', 'Foundry'],
      readingTime: '5 min read',
      accentColor: '#10b981',
    },
    {
      id: 'sp-3',
      title: 'Atelier Archive: Travertine & Hand-cast Bronze Accents',
      category: 'Atelier',
      description:
        'Physical material studies detailing the unlacquered patina progression on custom brass joinery and porous Roman travertine desk plinths.',
      curator: 'Maison Aurelia Studio',
      date: 'January 2026',
      tags: ['Materials', 'Bronze', 'Atelier'],
      readingTime: '12 min read',
      accentColor: '#f59e0b',
    },
    {
      id: 'sp-4',
      title: 'Spatial Silence: Acoustic Wood Finishes & Deep Contemplation',
      category: 'Architecture',
      description:
        'Constructing sanctuaries of timeless focus through slatted dark oak baffles, indirect golden luminescence, and concealed micro-perforations.',
      curator: 'Clara Vance',
      date: 'April 2026',
      tags: ['Acoustics', 'Interior', 'Sanctuary'],
      readingTime: '7 min read',
      accentColor: '#c8a35a',
    },
  ]);

  // Focus Timer State
  const [timerDuration, setTimerDuration] = useState<number>(25 * 60); // 25 minutes
  const [secondsRemaining, setSecondsRemaining] = useState<number>(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [focusNote, setFocusNote] = useState(
    'Refining the italic ligatures for Aurelia Antiqua. Paying close attention to the intersection of the diagonal crossbars and generous ascenders.'
  );

  // Ambient sound synthesizer
  const [isAmbientPlaying, setIsAmbientPlaying] = useState(false);
  const [ambientAudioNode, setAmbientAudioNode] = useState<AudioNode | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
    } else if (secondsRemaining === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      onShowToast('Focus session complete! Your insights have been logged.', 'success');
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, secondsRemaining, onShowToast]);

  const toggleTimer = () => {
    playClickSound();
    setIsTimerRunning(!isTimerRunning);
  };

  const resetTimer = (mins: number) => {
    playClickSound();
    setIsTimerRunning(false);
    setTimerDuration(mins * 60);
    setSecondsRemaining(mins * 60);
  };

  // Toggle ambient white-noise/rain sound via Web Audio API
  const toggleAmbientSound = () => {
    playClickSound();
    if (isAmbientPlaying) {
      if (ambientAudioNode) {
        try {
          // stop
          (ambientAudioNode as unknown as AudioBufferSourceNode).stop();
        } catch {
          // ignore
        }
      }
      setIsAmbientPlaying(false);
      onShowToast('Ambient soundscape paused.', 'info');
    } else {
      try {
        const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioCtxClass) return;
        const ctx = new AudioCtxClass();
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          data[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = data[i];
          data[i] *= 0.12; // warm gentle pink/brown noise
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 650;
        const gain = ctx.createGain();
        gain.gain.value = 0.08;

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start();

        setAmbientAudioNode(noise);
        setIsAmbientPlaying(true);
        onShowToast('Ambient focus rain generator active.', 'success');
      } catch {
        onShowToast('Audio could not be initialized.', 'error');
      }
    }
  };

  const filteredSpaces = spaces.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const minutesFormatted = Math.floor(secondsRemaining / 60);
  const secondsFormatted = secondsRemaining % 60;
  const progressPercent = ((timerDuration - secondsRemaining) / timerDuration) * 100;

  return (
    <div className="min-h-screen bg-[#071712] text-[#f6f1e7] pb-16 font-sans">
      {/* Top Luxury Workspace Header */}
      <header className="sticky top-0 z-40 bg-[#0a231b]/90 backdrop-blur-xl border-b border-[#c8a35a]/25 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand lockup */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#c8a35a] to-[#f4dfa6] flex items-center justify-center text-[#0a231b] shadow-md">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-[9px] uppercase tracking-[0.3em] font-semibold text-[#c8a35a]">
                Maison
              </span>
              <span className="block text-xs tracking-[0.25em] font-bold text-white font-serif">
                AURELIA
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 bg-black/25 p-1 rounded-full border border-white/10 text-xs">
            <button
              onClick={() => {
                playClickSound();
                setActiveTab('spaces');
              }}
              className={`px-4 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                activeTab === 'spaces'
                  ? 'bg-[#133a2e] text-[#c8a35a] font-semibold shadow-sm border border-[#c8a35a]/30'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Curated Spaces</span>
            </button>
            <button
              onClick={() => {
                playClickSound();
                setActiveTab('focus');
              }}
              className={`px-4 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                activeTab === 'focus'
                  ? 'bg-[#133a2e] text-[#c8a35a] font-semibold shadow-sm border border-[#c8a35a]/30'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Timeless Focus</span>
            </button>
            <button
              onClick={() => {
                playClickSound();
                setActiveTab('insights');
              }}
              className={`px-4 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                activeTab === 'insights'
                  ? 'bg-[#133a2e] text-[#c8a35a] font-semibold shadow-sm border border-[#c8a35a]/30'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Personal Insights</span>
            </button>
          </nav>

          {/* User profile & Blade Demo return */}
          <div className="flex items-center gap-3">
            <button
              onClick={onReturnToBladeDemo}
              className="px-3 py-1.5 rounded-full text-xs font-medium text-[#c8a35a] bg-[#133a2e]/80 border border-[#c8a35a]/40 hover:bg-[#133a2e] transition-colors flex items-center gap-1.5"
              title="Return to the animated diagonal blade transition UI"
            >
              <span>Blade Auth Showcase</span>
            </button>
            <button
              onClick={onOpenInspector}
              className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              title="Open Blade Dynamics Studio"
            >
              <Sliders className="w-4 h-4 text-[#c8a35a]" />
            </button>
            <div className="flex items-center gap-2 pl-2 border-l border-white/15">
              <div className="w-8 h-8 rounded-full bg-[#c8a35a] text-[#0a231b] flex items-center justify-center text-xs font-bold shadow-md">
                {user.avatarLetter}
              </div>
              <div className="hidden lg:block text-left">
                <span className="block text-xs font-medium text-white leading-tight">
                  {user.name}
                </span>
                <span className="block text-[10px] text-[#c8a35a]">{user.role}</span>
              </div>
              <button
                onClick={onSignOut}
                className="p-1.5 text-white/50 hover:text-white transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-8">

        {/* Hero banner for current space */}
        <div className="relative rounded-3xl overflow-hidden border border-[#c8a35a]/30 bg-gradient-to-r from-[#0e2e24] via-[#10362b] to-[#0a231b] p-8 sm:p-10 mb-10 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(#c8a35a_1px,transparent_1px)] [background-size:20px_20px] opacity-15 pointer-events-none" />
          <div className="relative z-10 max-w-2xl">
            <span className="inline-block px-3 py-1 mb-3 rounded-full text-[11px] font-semibold uppercase tracking-widest text-[#c8a35a] bg-[#133a2e]/70 border border-[#c8a35a]/30">
              Personalized Sanctum
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#f6f1e7] leading-tight mb-3">
              Welcome to <span className="italic font-normal text-[#c8a35a]">your curated</span> sanctuary.
            </h1>
            <p className="text-[#8ca097] text-sm sm:text-base leading-relaxed font-light mb-6">
              All monograph proofs, typography specimens, and contemplative focus sessions synchronized
              across your private Aurelia node.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <button
                onClick={() => setActiveTab('focus')}
                className="btn-forest-pill px-5 py-2.5 rounded-full text-white font-medium flex items-center gap-2 border border-[#c8a35a]/30 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 text-[#c8a35a]" />
                <span>Begin 25m Focus Block</span>
              </button>
              <button
                onClick={() => {
                  onShowToast('New curated space draft created.', 'success');
                }}
                className="px-4 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white font-medium border border-white/10 transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 text-[#c8a35a]" />
                <span>Add Curated Monograph</span>
              </button>
            </div>
          </div>
        </div>

        {/* TAB 1: CURATED SPACES */}
        {activeTab === 'spaces' && (
          <div className="space-y-6">
            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
                {['All', 'Monographs', 'Typography', 'Atelier', 'Architecture'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      playClickSound();
                      setSelectedCategory(cat);
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs transition-all whitespace-nowrap ${
                      selectedCategory === cat
                        ? 'bg-[#c8a35a] text-[#0a231b] font-bold shadow'
                        : 'bg-black/30 text-white/70 hover:text-white border border-white/10'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-white/40 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search archives, tags, or curators..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-full bg-black/40 border border-white/15 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#c8a35a]"
                />
              </div>
            </div>

            {/* Grid of Curated Space Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredSpaces.map((item) => (
                <div
                  key={item.id}
                  className="group rounded-2xl bg-[#0e2e24]/70 border border-[#c8a35a]/20 p-6 sm:p-7 hover:border-[#c8a35a]/60 transition-all duration-300 flex flex-col justify-between shadow-lg relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#c8a35a]/5 rounded-bl-full pointer-events-none group-hover:bg-[#c8a35a]/10 transition-colors" />

                  <div>
                    {/* Unboxed metadata (anti-pill discipline) */}
                    <div className="flex items-center gap-2 text-xs text-[#8ca097] mb-3">
                      <span className="text-[#c8a35a] font-medium">{item.category}</span>
                      <span aria-hidden="true">&bull;</span>
                      <span>{item.date}</span>
                      <span aria-hidden="true">&bull;</span>
                      <span>{item.readingTime}</span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-serif font-bold text-white group-hover:text-[#f6f1e7] leading-snug mb-3">
                      {item.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-[#8ca097] leading-relaxed line-clamp-3 mb-5">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-white/60">
                      <BookOpen className="w-3.5 h-3.5 text-[#c8a35a]" />
                      <span>Curated by {item.curator}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onShowToast(`Archived "${item.title}" to offline vault.`, 'success')}
                        className="p-1.5 rounded-lg text-white/50 hover:text-[#c8a35a] transition-colors"
                        title="Bookmark to offline vault"
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onShowToast('Monograph viewer opened.', 'info')}
                        className="px-3 py-1 rounded-full text-xs font-medium text-white bg-white/10 hover:bg-[#c8a35a] hover:text-[#0a231b] transition-all flex items-center gap-1"
                      >
                        <span>Open Specimen</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: TIMELESS FOCUS STUDIO */}
        {activeTab === 'focus' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Pomodoro Circular Dial */}
            <div className="lg:col-span-6 rounded-3xl bg-[#0e2e24]/80 border border-[#c8a35a]/30 p-8 sm:p-10 flex flex-col items-center text-center shadow-xl">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-[#c8a35a] mb-2">
                Deep Work Chamber
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-6">
                Timeless Focus Block
              </h2>

              {/* Luxury circular timer ring */}
              <div className="relative w-64 h-64 my-4 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="128"
                    cy="128"
                    r="112"
                    stroke="rgba(200, 163, 90, 0.15)"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="128"
                    cy="128"
                    r="112"
                    stroke="#c8a35a"
                    strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 112}
                    strokeDashoffset={2 * Math.PI * 112 * (1 - progressPercent / 100)}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-linear"
                  />
                </svg>

                <div className="absolute flex flex-col items-center justify-center">
                  <span className="font-serif text-5xl font-bold text-white tracking-tight tabular-nums">
                    {String(minutesFormatted).padStart(2, '0')}:
                    {String(secondsFormatted).padStart(2, '0')}
                  </span>
                  <span className="text-xs text-[#8ca097] uppercase tracking-widest mt-1">
                    {isTimerRunning ? 'State of Flow' : 'Ready'}
                  </span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-4 mt-6">
                <button
                  onClick={toggleTimer}
                  className="btn-forest-pill px-8 py-3 rounded-full text-white font-semibold text-sm flex items-center gap-2 border border-[#c8a35a]/40 shadow-lg cursor-pointer"
                >
                  {isTimerRunning ? (
                    <>
                      <Pause className="w-4 h-4 text-[#c8a35a]" />
                      <span>Pause Session</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 text-[#c8a35a]" />
                      <span>Start Immersion</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => resetTimer(25)}
                  className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                  title="Reset to 25 minutes"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Presets */}
              <div className="flex items-center gap-2 mt-8 text-xs">
                {[15, 25, 45, 60].map((m) => (
                  <button
                    key={m}
                    onClick={() => resetTimer(m)}
                    className={`px-3 py-1.5 rounded-full border transition-colors ${
                      timerDuration === m * 60
                        ? 'bg-[#133a2e] text-[#c8a35a] border-[#c8a35a]'
                        : 'bg-black/30 text-white/60 border-white/10 hover:text-white'
                    }`}
                  >
                    {m} min
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Thought Pad & Ambient Audio Generator */}
            <div className="lg:col-span-6 space-y-6">
              {/* Ambient Generator Card */}
              <div className="rounded-3xl bg-[#0e2e24]/70 border border-[#c8a35a]/25 p-6 sm:p-7 flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                      isAmbientPlaying
                        ? 'bg-[#c8a35a] text-[#0a231b]'
                        : 'bg-white/10 text-white/60'
                    }`}
                  >
                    {isAmbientPlaying ? (
                      <Volume2 className="w-6 h-6 animate-pulse" />
                    ) : (
                      <VolumeX className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-bold text-white">
                      Sanctuary Rain Soundscape
                    </h3>
                    <p className="text-xs text-[#8ca097]">
                      {isAmbientPlaying
                        ? 'Synthesized acoustic warmth active'
                        : 'Filtered pink rain noise to silence distractions'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={toggleAmbientSound}
                  className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all ${
                    isAmbientPlaying
                      ? 'bg-[#133a2e] text-[#c8a35a] border border-[#c8a35a]/60 shadow'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {isAmbientPlaying ? 'Mute' : 'Play'}
                </button>
              </div>

              {/* Contemplation Pad */}
              <div className="rounded-3xl bg-[#0e2e24]/70 border border-[#c8a35a]/25 p-6 sm:p-7 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-bold text-white">
                    Contemplation & Draft Notes
                  </h3>
                  <button
                    onClick={() => onShowToast('Draft synchronized with cloud vault.', 'success')}
                    className="text-xs text-[#c8a35a] hover:underline font-medium"
                  >
                    Save draft
                  </button>
                </div>

                <textarea
                  rows={6}
                  value={focusNote}
                  onChange={(e) => setFocusNote(e.target.value)}
                  placeholder="Capture ideas, typography thoughts, or design revisions..."
                  className="w-full bg-black/30 border border-white/15 rounded-2xl p-4 text-xs sm:text-sm text-[#f6f1e7] font-serif leading-relaxed focus:outline-none focus:border-[#c8a35a]"
                />

                <div className="flex items-center justify-between text-xs text-white/50">
                  <span>Characters: {focusNote.length}</span>
                  <span className="flex items-center gap-1 text-[#10b981]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Auto-saved locally</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PERSONAL INSIGHTS */}
        {activeTab === 'insights' && (
          <div className="space-y-8">
            {/* High-level metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  label: 'Focus Hours (Week)',
                  value: '18.4h',
                  sub: '+2.8h vs last week',
                  positive: true,
                },
                {
                  label: 'Curated Monographs',
                  value: '42',
                  sub: '4 new additions this month',
                  positive: true,
                },
                {
                  label: 'Contemplation Streak',
                  value: '14 Days',
                  sub: 'Personal all-time best',
                  positive: true,
                },
                {
                  label: 'Typography Licenses',
                  value: '3 Active',
                  sub: 'Aurelia Antiqua suite',
                  positive: true,
                },
              ].map((m) => (
                <div
                  key={m.label}
                  className="rounded-2xl bg-[#0e2e24]/70 border border-[#c8a35a]/25 p-6 shadow-lg"
                >
                  <span className="block text-xs text-[#8ca097] mb-2">{m.label}</span>
                  <div className="font-serif text-3xl font-bold text-white tabular-nums mb-1">
                    {m.value}
                  </div>
                  <span className="text-[11px] text-[#c8a35a]">{m.sub}</span>
                </div>
              ))}
            </div>

            {/* Weekly focus distribution graph */}
            <div className="rounded-3xl bg-[#0e2e24]/70 border border-[#c8a35a]/25 p-8 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-serif text-xl font-bold text-white">
                    Deep Focus Cadence
                  </h3>
                  <p className="text-xs text-[#8ca097]">
                    Distribution of uninterrupted focus hours throughout the current cycle.
                  </p>
                </div>
                <span className="text-xs text-[#c8a35a] font-medium">Cycle 2026-03</span>
              </div>

              {/* Bar visualization */}
              <div className="grid grid-cols-7 gap-3 items-end h-44 pt-6 pb-2 border-b border-white/10">
                {[
                  { day: 'Mon', hours: 3.2, pct: 64 },
                  { day: 'Tue', hours: 4.5, pct: 90 },
                  { day: 'Wed', hours: 2.8, pct: 56 },
                  { day: 'Thu', hours: 4.0, pct: 80 },
                  { day: 'Fri', hours: 3.9, pct: 78 },
                  { day: 'Sat', hours: 1.5, pct: 30 },
                  { day: 'Sun', hours: 2.1, pct: 42 },
                ].map((col) => (
                  <div key={col.day} className="flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="text-[10px] text-[#c8a35a] font-mono tabular-nums opacity-0 group-hover:opacity-100 transition-opacity">
                      {col.hours}h
                    </span>
                    <div
                      style={{ height: `${col.pct}%` }}
                      className="w-full max-w-[48px] rounded-t-lg bg-gradient-to-t from-[#0e2e24] via-[#133a2e] to-[#c8a35a] transition-all group-hover:to-[#f4dfa6] shadow-sm"
                    />
                    <span className="text-xs text-white/60 font-medium">{col.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};
