import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastData {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info';
}

interface ToastProps {
  toast: ToastData | null;
  onDismiss: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  if (!toast) return null;

  const isError = toast.type === 'error';
  const isSuccess = toast.type === 'success' || !toast.type;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-xl backdrop-blur-md shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-top-4 border ${
        isError
          ? 'bg-[#1a0f0f]/95 border-red-500/80 text-[#fbf6ed]'
          : 'bg-[#0a231b]/95 border-[#c8a35a]/90 text-[#f6f1e7]'
      }`}
    >
      {isError ? (
        <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
      ) : isSuccess ? (
        <CheckCircle2 className="w-5 h-5 text-[#c8a35a] shrink-0" />
      ) : (
        <Info className="w-5 h-5 text-[#c8a35a] shrink-0" />
      )}
      <span className="text-xs sm:text-sm font-medium tracking-wide">
        {toast.message}
      </span>
      <button
        onClick={onDismiss}
        className="ml-2 text-white/50 hover:text-white transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
