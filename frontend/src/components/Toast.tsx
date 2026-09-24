import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'success',
  onClose,
  duration = 4000,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const styles = {
    success: 'bg-emerald-600 text-white shadow-emerald-500/20',
    error: 'bg-red-600 text-white shadow-red-500/20',
    info: 'bg-brand-600 text-white shadow-brand-500/20',
  };

  const Icon = type === 'success' ? CheckCircle2 : type === 'error' ? AlertCircle : Info;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
      <div className={`px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-white/20 backdrop-blur-md ${styles[type]}`}>
        <Icon className="w-5 h-5 shrink-0" />
        <span className="text-xs font-semibold">{message}</span>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-white/20 transition ml-2"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
