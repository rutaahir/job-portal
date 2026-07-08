import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X, Sparkles } from 'lucide-react';

export interface Toast {
  id: string;
  text: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface ToastItemProps {
  toast: Toast;
  onClose: (id: string) => void;
}

export const ToastItem: React.FC<ToastItemProps> = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, 4000);

    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  // Set style based on toast type
  let typeConfig = {
    icon: <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />,
    gradient: 'from-emerald-500/10 to-teal-500/5',
    borderColor: 'border-emerald-500/40 dark:border-emerald-500/30',
    glowColor: 'rgba(16,185,129,0.15)',
    barColor: 'bg-emerald-500',
    title: 'Success',
    titleColor: 'text-emerald-500',
  };

  if (toast.type === 'info') {
    typeConfig = {
      icon: <Sparkles className="w-5 h-5 text-[#E8702A] flex-shrink-0" />,
      gradient: 'from-[#E8702A]/10 to-amber-500/5',
      borderColor: 'border-[#E8702A]/40 dark:border-[#E8702A]/30',
      glowColor: 'rgba(232,112,42,0.15)',
      barColor: 'bg-[#E8702A]',
      title: 'Update',
      titleColor: 'text-[#E8702A]',
    };
  } else if (toast.type === 'warning') {
    typeConfig = {
      icon: <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />,
      gradient: 'from-amber-500/10 to-yellow-500/5',
      borderColor: 'border-amber-500/40 dark:border-amber-500/30',
      glowColor: 'rgba(245,158,11,0.15)',
      barColor: 'bg-amber-500',
      title: 'Attention',
      titleColor: 'text-amber-500',
    };
  } else if (toast.type === 'error') {
    typeConfig = {
      icon: <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />,
      gradient: 'from-rose-500/10 to-red-500/5',
      borderColor: 'border-rose-500/40 dark:border-rose-500/30',
      glowColor: 'rgba(244,63,94,0.15)',
      barColor: 'bg-rose-500',
      title: 'Error',
      titleColor: 'text-rose-500',
    };
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 80, y: 15, scale: 0.9, rotate: 1 }}
      animate={{ 
        opacity: 1, 
        x: 0, 
        y: 0, 
        scale: 1, 
        rotate: 0,
        boxShadow: `0 10px 30px -5px rgba(0,0,0,0.1), 0 0 15px ${typeConfig.glowColor}`
      }}
      exit={{ opacity: 0, x: 50, scale: 0.92, transition: { duration: 0.25 } }}
      transition={{ type: 'spring', stiffness: 220, damping: 18 }}
      className={`relative w-full max-w-[360px] bg-surface-theme border ${typeConfig.borderColor} rounded-2xl overflow-hidden group pointer-events-auto backdrop-blur-md`}
    >
      {/* Dynamic gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-r ${typeConfig.gradient} opacity-60 pointer-events-none`} />

      <div className="p-4 flex items-start gap-3 relative.z-10">
        {/* Animated Icon Wrapper with pulse radial shadow */}
        <div className="relative p-1.5 rounded-xl bg-surface-theme border border-border-theme/40 shadow-sm flex items-center justify-center">
          {typeConfig.icon}
        </div>

        {/* Content area */}
        <div className="flex-1 min-w-0 pr-2">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className={`text-[10px] font-black uppercase tracking-widest ${typeConfig.titleColor}`}>
              {typeConfig.title}
            </span>
          </div>
          <p className="text-xs font-bold leading-relaxed text-text-primary-theme">
            {toast.text}
          </p>
        </div>

        {/* Close Button */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onClose(toast.id)}
          className="p-1 rounded-lg bg-border-theme/40 hover:bg-border-theme text-text-secondary-theme hover:text-text-primary-theme transition-all cursor-pointer flex-shrink-0"
        >
          <X className="w-3.5 h-3.5" />
        </motion.button>
      </div>

      {/* Advanced dynamic countdown progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-border-theme/30 pointer-events-none">
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: 0 }}
          transition={{ duration: 4, ease: 'linear' }}
          className={`h-full ${typeConfig.barColor}`}
        />
      </div>
    </motion.div>
  );
};

interface PremiumToastsContainerProps {
  toasts: Toast[];
  onClose: (id: string) => void;
}

export const PremiumToastsContainer: React.FC<PremiumToastsContainerProps> = ({ toasts, onClose }) => {
  return (
    <div className="fixed top-24 right-6 z-[99999] flex flex-col gap-3 pointer-events-none max-w-[380px] w-full">
      <AnimatePresence mode="pop-layout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={onClose} />
        ))}
      </AnimatePresence>
    </div>
  );
};
