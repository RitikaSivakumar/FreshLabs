
import React, { useEffect } from 'react';
import { Bell, CheckCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = {
    success: 'bg-emerald-600 shadow-emerald-200',
    info: 'bg-indigo-600 shadow-indigo-200',
    warning: 'bg-amber-600 shadow-amber-200',
  };

  const icons = {
    success: <CheckCircle size={20} />,
    info: <Bell size={20} />,
    warning: <Info size={20} />,
  };

  return (
    <div className={`fixed bottom-8 right-8 z-[110] flex items-center space-x-4 p-4 pr-12 rounded-2xl text-white shadow-2xl animate-in slide-in-from-right-8 duration-500 ${colors[type]}`}>
      <div className="p-2 bg-white/20 rounded-xl">
        {icons[type]}
      </div>
      <p className="font-bold text-sm whitespace-nowrap">{message}</p>
      <button 
        onClick={onClose}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded-full transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
};

export default Toast;
