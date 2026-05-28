import React from 'react';
import { AlertTriangle, HelpCircle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning';
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  variant = 'danger'
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const headerBg = variant === 'danger' ? 'bg-red-400' : 'bg-[#fbbf24]';

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <div 
        className="bg-white border-[4px] border-black shadow-[8px_8px_0_0_#000] w-full max-w-sm flex flex-col rounded-xl overflow-hidden animate-in fade-in zoom-in duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className={`px-5 py-4 border-b-[4px] border-black flex items-center gap-3 ${headerBg}`}>
          {variant === 'danger' ? (
            <AlertTriangle className="stroke-[3] text-black shrink-0" size={24} />
          ) : (
            <HelpCircle className="stroke-[3] text-black shrink-0" size={24} />
          )}
          <h3 className="text-lg font-black text-black m-0 tracking-wider">
            {title}
          </h3>
        </div>
        
        <div className="p-5 bg-[#f4f4f0] flex flex-col gap-5">
          <p className="text-sm sm:text-base font-bold text-black leading-relaxed m-0 text-right">
            {message}
          </p>
          
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="neo-btn bg-slate-300 hover:bg-slate-400 text-black text-sm py-2 px-5 shadow-[2px_2px_0_0_#000] hover:shadow-[4px_4px_0_0_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] min-h-[40px] flex-1 font-bold"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className={`neo-btn text-black text-sm py-2 px-5 shadow-[2px_2px_0_0_#000] hover:shadow-[4px_4px_0_0_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] min-h-[40px] flex-1 font-black ${
                variant === 'danger' ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-[#fbbf24] hover:bg-[#f59e0b]'
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
