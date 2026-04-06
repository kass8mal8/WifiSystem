import { AlertCircle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onClose: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

export default function ConfirmModal({ 
  isOpen, 
  title, 
  message, 
  onConfirm, 
  onClose, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel',
  type = 'danger'
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const typeConfig = {
    danger: {
      icon: <AlertCircle className="text-red-400" size={24} />,
      btn: "bg-red-600 hover:bg-red-500 shadow-red-600/20",
      accent: "text-red-400",
      border: "border-red-500/30"
    },
    warning: {
      icon: <AlertCircle className="text-amber-400" size={24} />,
      btn: "bg-amber-600 hover:bg-amber-500 shadow-amber-600/20",
      accent: "text-amber-400",
      border: "border-amber-500/30"
    },
    info: {
      icon: <AlertCircle className="text-indigo-400" size={24} />,
      btn: "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20",
      accent: "text-indigo-400",
      border: "border-indigo-500/30"
    }
  };

  const config = typeConfig[type];

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className={`
        bg-slate-900 w-full max-w-sm rounded-2xl border ${config.border} shadow-2xl overflow-hidden 
        animate-in zoom-in-95 duration-300
      `}>
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-2">
            {config.icon}
            <h3 className="font-bold text-white tracking-tight">{title}</h3>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-slate-300 text-sm leading-relaxed">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="p-4 bg-white/5 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl transition-all border border-white/5"
          >
            {cancelText}
          </button>
          <button 
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 px-4 py-2.5 text-white font-semibold rounded-xl shadow-lg transition-all ${config.btn}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
