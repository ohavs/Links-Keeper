import React, { useState } from 'react';
import { X, Palette, FolderPlus } from 'lucide-react';
import ConfirmModal from './ConfirmModal';

interface AddCategoryModalProps {
  onClose: () => void;
  onAdd: (name: string, color: string) => void;
}

const PRESET_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308',
  '#84cc16', '#22c55e', '#10b981', '#14b8a6',
  '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
  '#8b5cf6', '#a855f7', '#d946ef', '#ec4899',
  '#f472b6', '#64748b', '#78716c', '#000000',
];

export default function AddCategoryModal({ onClose, onAdd }: AddCategoryModalProps) {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#3b82f6');
  const [saving, setSaving] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const hasUnsavedChanges = name.trim() !== '' || color !== '#3b82f6';

  const handleCloseAttempt = () => {
    if (hasUnsavedChanges) {
      setShowExitConfirm(true);
    } else {
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || saving) return;

    setSaving(true);
    try {
      await onAdd(name.trim(), color);
      onClose();
    } catch (err) {
      console.error('Failed to add category:', err);
      setSaving(false);
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center sm:p-6" 
        onClick={handleCloseAttempt}
      >
        <div
          className="bg-white border-t-[4px] sm:border-[4px] border-black shadow-[0_-4px_0_0_#000] sm:shadow-[8px_8px_0_0_#000] w-full sm:max-w-md flex flex-col sm:rounded-xl overflow-hidden max-h-[90dvh]"
          onClick={e => e.stopPropagation()}
        >
          <div className="px-5 sm:px-6 py-4 sm:py-5 border-b-[4px] border-black flex items-center justify-between bg-[#34d399]">
            <h2 className="text-xl sm:text-2xl font-black text-black m-0 uppercase tracking-wider flex items-center gap-2 sm:gap-3">
              <FolderPlus size={24} className="stroke-[3]" />
              קטגוריה חדשה
            </h2>
            <button 
              type="button"
              onClick={handleCloseAttempt} 
              className="neo-btn bg-white hover:bg-red-400 p-2 shadow-[2px_2px_0_0_#000] hover:shadow-[4px_4px_0_0_#000] rounded-lg min-w-[44px] min-h-[44px]"
            >
              <X size={24} className="stroke-[3]" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-5 sm:p-6 flex flex-col gap-5 bg-[#f4f4f0] overflow-y-auto flex-1">
            <div>
              <label className="block text-sm sm:text-base font-black text-black mb-2 uppercase">שם הקטגוריה</label>
              <input
                type="text"
                required
                autoFocus
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="למשל: עבודה, השראה, מתכונים..."
                className="neo-input w-full text-base sm:text-lg shadow-[4px_4px_0_0_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_#000] min-h-[48px]"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm sm:text-base font-black text-black mb-3 uppercase">
                <Palette size={18} className="stroke-[2.5]" />
                בחר צבע
              </label>
              <div className="grid grid-cols-10 gap-2">
                {PRESET_COLORS.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-full aspect-square rounded-lg border-[3px] transition-all cursor-pointer outline-none ${
                      color === c
                        ? 'border-black shadow-[2px_2px_0_0_#000] scale-110'
                        : 'border-black/30 hover:border-black hover:scale-105'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>

              <div className="mt-4 flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-lg border-[3px] border-black shadow-[3px_3px_0_0_#000] shrink-0"
                  style={{ backgroundColor: color }}
                />
                <div className="flex-1 bg-white border-[3px] border-black rounded-lg px-4 py-2.5 font-mono font-bold text-base shadow-[2px_2px_0_0_#000] truncate">
                  {name || 'שם הקטגוריה'}
                </div>
              </div>
            </div>

            <div className="mt-2 flex flex-col sm:flex-row justify-end gap-3 pb-safe">
              <button
                type="button"
                onClick={handleCloseAttempt}
                className="neo-btn bg-slate-300 hover:bg-slate-400 text-black text-base py-3 px-8 shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] min-h-[48px]"
              >
                ביטול
              </button>
              <button
                type="submit"
                disabled={saving || !name.trim()}
                className="neo-btn bg-[#34d399] hover:bg-[#10b981] text-black font-black text-base py-3 px-10 shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] min-h-[48px] disabled:opacity-50"
              >
                {saving ? '⏳ שומר...' : '📂 צור קטגוריה'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <ConfirmModal
        isOpen={showExitConfirm}
        title="לצאת ללא שמירה?"
        message="האם אתה בטוח שברצונך לצאת? הקטגוריה החדשה לא תישמר."
        confirmText="כן, צא ללא שמירה"
        cancelText="חזור לערוך"
        variant="warning"
        onConfirm={onClose}
        onCancel={() => setShowExitConfirm(false)}
      />
    </>
  );
}
