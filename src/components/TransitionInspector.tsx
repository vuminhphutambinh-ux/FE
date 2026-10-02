import React from 'react';
import { Sliders, Volume2, VolumeX, RotateCcw, X, Sparkles } from 'lucide-react';
import { TransitionSettings } from '../types';

interface TransitionInspectorProps {
  settings: TransitionSettings;
  onChange: (settings: TransitionSettings) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const TransitionInspector: React.FC<TransitionInspectorProps> = ({
  settings,
  onChange,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const presets = [
    {
      name: 'Original Design (750ms)',
      duration: 750,
      angle: 7.5,
      easing: 'cubic-bezier(0.77, 0, 0.175, 1)',
    },
    {
      name: 'Snappy Kinetic (450ms)',
      duration: 450,
      angle: 6,
      easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
    },
    {
      name: 'Cinematic Slow (1050ms)',
      duration: 1050,
      angle: 9,
      easing: 'cubic-bezier(0.77, 0, 0.175, 1)',
    },
    {
      name: 'Gentle Tilt (600ms, 4°)',
      duration: 600,
      angle: 4,
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
    },
  ];

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-[#0a231b]/95 backdrop-blur-xl border-l border-[#c8a35a]/30 shadow-2xl p-6 text-[#f6f1e7] flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
      <div>
        <div className="flex items-center justify-between border-b border-[#c8a35a]/20 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#c8a35a]" />
            <h3 className="font-serif text-lg font-bold tracking-wide text-white">
              Blade Dynamics Studio
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close inspector"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-[#8ca097] leading-relaxed mb-6">
          Fine-tune the diagonal blade shear angle, sweeping duration, and cubic-bezier
          acceleration curve in real-time.
        </p>

        {/* Presets */}
        <div className="mb-6">
          <span className="block text-[11px] font-semibold uppercase tracking-wider text-[#c8a35a] mb-2">
            Curated Presets
          </span>
          <div className="grid grid-cols-1 gap-2">
            {presets.map((p) => {
              const isActive =
                settings.duration === p.duration &&
                settings.angle === p.angle &&
                settings.easing === p.easing;
              return (
                <button
                  key={p.name}
                  onClick={() =>
                    onChange({
                      ...settings,
                      duration: p.duration,
                      angle: p.angle,
                      easing: p.easing,
                    })
                  }
                  className={`text-left px-3 py-2 rounded-lg text-xs transition-all flex items-center justify-between border ${
                    isActive
                      ? 'bg-[#133a2e] text-[#c8a35a] border-[#c8a35a]/60 shadow-sm'
                      : 'bg-black/20 text-white/80 border-white/10 hover:border-white/20'
                  }`}
                >
                  <span>{p.name}</span>
                  {isActive && <Sparkles className="w-3.5 h-3.5 text-[#c8a35a]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Duration slider */}
        <div className="space-y-2 mb-6">
          <div className="flex justify-between items-center text-xs">
            <label htmlFor="duration-slider" className="font-medium text-white/80">
              Sweep Duration
            </label>
            <span className="font-mono text-[#c8a35a] tabular-nums font-semibold">
              {settings.duration}ms
            </span>
          </div>
          <input
            id="duration-slider"
            type="range"
            min="300"
            max="1200"
            step="50"
            value={settings.duration}
            onChange={(e) =>
              onChange({ ...settings, duration: Number(e.target.value) })
            }
            className="w-full accent-[#c8a35a] bg-black/40 h-1.5 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-white/40">
            <span>300ms (Fast)</span>
            <span>750ms (Default)</span>
            <span>1200ms (Dramatic)</span>
          </div>
        </div>

        {/* Shear angle slider */}
        <div className="space-y-2 mb-6">
          <div className="flex justify-between items-center text-xs">
            <label htmlFor="angle-slider" className="font-medium text-white/80">
              Shear Angle
            </label>
            <span className="font-mono text-[#c8a35a] tabular-nums font-semibold">
              {settings.angle}°
            </span>
          </div>
          <input
            id="angle-slider"
            type="range"
            min="0"
            max="15"
            step="0.5"
            value={settings.angle}
            onChange={(e) =>
              onChange({ ...settings, angle: Number(e.target.value) })
            }
            className="w-full accent-[#c8a35a] bg-black/40 h-1.5 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-white/40">
            <span>0° (Vertical)</span>
            <span>7.5° (Classic)</span>
            <span>15° (Steep)</span>
          </div>
        </div>

        {/* Easing curve selector */}
        <div className="space-y-2 mb-6">
          <label htmlFor="easing-select" className="block text-xs font-medium text-white/80">
            Easing Function
          </label>
          <select
            id="easing-select"
            value={settings.easing}
            onChange={(e) =>
              onChange({ ...settings, easing: e.target.value })
            }
            className="w-full bg-[#133a2e] border border-[#c8a35a]/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c8a35a]"
          >
            <option value="cubic-bezier(0.77, 0, 0.175, 1)">
              Luxury Blade: cubic-bezier(0.77, 0, 0.175, 1)
            </option>
            <option value="cubic-bezier(0.16, 1, 0.3, 1)">
              Snappy Decel: cubic-bezier(0.16, 1, 0.3, 1)
            </option>
            <option value="cubic-bezier(0.25, 1, 0.5, 1)">
              Gentle Ease: cubic-bezier(0.25, 1, 0.5, 1)
            </option>
            <option value="ease-in-out">Standard: ease-in-out</option>
          </select>
        </div>

        {/* Audio feedback toggle */}
        <div className="flex items-center justify-between py-3 border-t border-b border-white/10 mb-6">
          <div className="flex items-center gap-2.5">
            {settings.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-[#c8a35a]" />
            ) : (
              <VolumeX className="w-4 h-4 text-white/40" />
            )}
            <div>
              <div className="text-xs font-medium text-white">Synthesized Audio</div>
              <div className="text-[10px] text-white/50">Subtle metallic blade sweep</div>
            </div>
          </div>
          <button
            onClick={() =>
              onChange({ ...settings, soundEnabled: !settings.soundEnabled })
            }
            className={`w-10 h-6 rounded-full transition-colors relative p-0.5 ${
              settings.soundEnabled ? 'bg-[#c8a35a]' : 'bg-white/20'
            }`}
            aria-label="Toggle synthesized audio"
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                settings.soundEnabled ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Reset button */}
      <div className="pt-4 border-t border-white/10">
        <button
          onClick={() =>
            onChange({
              duration: 750,
              angle: 7.5,
              easing: 'cubic-bezier(0.77, 0, 0.175, 1)',
              soundEnabled: true,
            })
          }
          className="w-full py-2.5 px-4 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 text-xs font-medium flex items-center justify-center gap-2 border border-white/10 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset to Original Parameters</span>
        </button>
      </div>
    </div>
  );
};
