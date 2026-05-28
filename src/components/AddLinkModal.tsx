import React, { useState, useRef, useEffect } from 'react';
import { X, Tag, Link2, ChevronDown, Check } from 'lucide-react';
import { Category, LinkItem } from '../types';
import { cn } from '../lib/utils';
import ConfirmModal from './ConfirmModal';

interface AddLinkModalProps {
  categories: Category[];
  defaultCategoryId: string;
  onClose: () => void;
  onAdd?: (linkConfig: { url: string; title: string; description: string; tags: string[]; categoryId: string; }) => void;
  onUpdate?: (id: string, updates: Partial<LinkItem>) => void;
  linkToEdit?: LinkItem;
  initialUrl?: string;
  initialTitle?: string;
  initialDescription?: string;
}

function CategoryDropdown({ categories, value, onChange }: { categories: Category[], value: string, onChange: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = categories.find(c => c.id === value);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="neo-input w-full text-base sm:text-lg font-bold shadow-[4px_4px_0_0_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_#000] min-h-[48px] flex items-center justify-between gap-3 cursor-pointer transition-all"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {selected && (
            <div className="w-5 h-5 rounded border-[2px] border-black shrink-0" style={{ backgroundColor: selected.color }} />
          )}
          <span className="truncate">{selected?.name || 'בחר קטגוריה'}</span>
        </div>
        <div className={cn(
          "w-8 h-8 bg-[#fbbf24] border-[2px] border-black rounded-md flex items-center justify-center shrink-0 transition-transform",
          open && "rotate-180"
        )}>
          <ChevronDown size={18} className="stroke-[3]" />
        </div>
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white border-[3px] border-black rounded-xl shadow-[6px_6px_0_0_#000] z-50 overflow-hidden max-h-60 overflow-y-auto">
          {categories.length === 0 && (
            <div className="px-4 py-6 text-center text-sm font-bold text-slate-400">
              אין קטגוריות עדיין.<br />צור קטגוריה חדשה קודם!
            </div>
          )}
          {categories.map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => { onChange(cat.id); setOpen(false); }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 text-right font-bold cursor-pointer outline-none transition-colors border-b-[2px] border-black/10 last:border-b-0",
                cat.id === value
                  ? "bg-[#fef08a] text-black"
                  : "bg-white text-black hover:bg-[#f0fdf4]"
              )}
            >
              <div className="w-5 h-5 rounded border-[2px] border-black shrink-0" style={{ backgroundColor: cat.color }} />
              <span className="flex-1 text-base">{cat.name}</span>
              {cat.id === value && (
                <Check size={18} className="stroke-[3] text-black shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AddLinkModal({ 
  categories, 
  defaultCategoryId, 
  onClose, 
  onAdd, 
  onUpdate, 
  linkToEdit,
  initialUrl,
  initialTitle,
  initialDescription
}: AddLinkModalProps) {
  const isEdit = !!linkToEdit;

  const [url, setUrl] = useState(linkToEdit?.url || initialUrl || '');
  const [title, setTitle] = useState(linkToEdit?.title || initialTitle || '');
  const [description, setDescription] = useState(linkToEdit?.description || initialDescription || '');
  const [tagsInput, setTagsInput] = useState(linkToEdit?.tags ? linkToEdit.tags.join(', ') : '');
  const [categoryId, setCategoryId] = useState(linkToEdit?.categoryId || defaultCategoryId || (categories[0]?.id || ''));
  const [saving, setSaving] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Check if any changes have been made
  const hasUnsavedChanges = isEdit
    ? url !== (linkToEdit?.url || '') ||
      title !== (linkToEdit?.title || '') ||
      description !== (linkToEdit?.description || '') ||
      tagsInput !== (linkToEdit?.tags ? linkToEdit.tags.join(', ') : '') ||
      categoryId !== (linkToEdit?.categoryId || '')
    : url !== (initialUrl || '') ||
      title !== (initialTitle || '') ||
      description !== (initialDescription || '') ||
      tagsInput !== '' ||
      categoryId !== (defaultCategoryId || (categories[0]?.id || ''));

  const handleCloseAttempt = () => {
    if (hasUnsavedChanges) {
      setShowExitConfirm(true);
    } else {
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !title || saving || !categoryId) return;
    
    setSaving(true);
    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    try {
      if (isEdit && onUpdate && linkToEdit) {
        await onUpdate(linkToEdit.id, { url, title, description, tags, categoryId });
      } else if (onAdd) {
        await onAdd({ url, title, description, tags, categoryId });
      }
      onClose();
    } catch (err) {
      console.error('Failed to save link:', err);
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
          className="bg-white border-t-[4px] sm:border-[4px] border-black shadow-[0_-4px_0_0_#000] sm:shadow-[8px_8px_0_0_#000] w-full sm:max-w-xl flex flex-col sm:rounded-xl overflow-hidden max-h-[95dvh] sm:max-h-[90vh]"
          onClick={e => e.stopPropagation()}
        >
          <div className={cn("px-5 sm:px-6 py-4 sm:py-5 border-b-[4px] border-black flex items-center justify-between", isEdit ? "bg-[#c084fc]" : "bg-[#a78bfa]")}>
            <h2 className="text-xl sm:text-2xl font-black text-black m-0 uppercase tracking-widest flex items-center gap-2 sm:gap-3">
              <Link2 size={24} className="stroke-[3] sm:w-7 sm:h-7" />
              {isEdit ? 'עריכת לינק' : 'הוסף לינק חדש'}
            </h2>
            <button 
              type="button"
              onClick={handleCloseAttempt} 
              className="neo-btn bg-white hover:bg-red-400 p-2 shadow-[2px_2px_0_0_#000] hover:shadow-[4px_4px_0_0_#000] rounded-lg min-w-[44px] min-h-[44px]"
            >
              <X size={24} className="stroke-[3]" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 md:p-8 flex flex-col gap-5 sm:gap-6 bg-[#f4f4f0] overflow-y-auto flex-1">
            <div>
              <label className="block text-sm sm:text-base font-black text-black mb-2 uppercase">כתובת הלינק (URL)</label>
              <input 
                type="url" 
                required
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="neo-input w-full text-left font-mono text-base sm:text-lg shadow-[4px_4px_0_0_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_#000] min-h-[48px]"
                dir="ltr"
              />
            </div>
            
            <div>
              <label className="block text-sm sm:text-base font-black text-black mb-2 uppercase">כותרת מותאמת אישית</label>
              <input 
                type="text" 
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="תן כותרת שתרצה לזכור..."
                className="neo-input w-full text-base sm:text-lg shadow-[4px_4px_0_0_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_#000] min-h-[48px]"
              />
            </div>

            <div>
              <label className="block text-sm sm:text-base font-black text-black mb-2 uppercase">בחר קטגוריה</label>
              <CategoryDropdown
                categories={categories}
                value={categoryId}
                onChange={setCategoryId}
              />
            </div>
            
            <div>
              <label className="block text-sm sm:text-base font-black text-black mb-2 uppercase">תיאור (אופציונלי)</label>
              <textarea 
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="למה שמרת את הלינק הזה? (מומלץ)"
                className="neo-input w-full resize-none text-base sm:text-lg shadow-[4px_4px_0_0_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_#000]"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm sm:text-base font-black text-black mb-2 uppercase">
                <Tag size={18} className="stroke-[2.5] sm:w-5 sm:h-5" />
                תגיות חיפוש
                <span className="font-bold text-xs lowercase bg-[#fde047] px-2 py-0.5 border-2 border-black rotate-2 shadow-[2px_2px_0_0_#000] mr-2">פסיק בין תגיות</span>
              </label>
              <input 
                type="text" 
                value={tagsInput}
                onChange={e => setTagsInput(e.target.value)}
                placeholder="React, CSS, דוגמאות..."
                className="neo-input w-full text-base sm:text-lg shadow-[4px_4px_0_0_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_#000] min-h-[48px]"
              />
            </div>
            
            <div className="mt-4 sm:mt-8 flex flex-col sm:flex-row justify-end gap-3 sm:gap-5 pb-safe">
              <button 
                type="button" 
                onClick={handleCloseAttempt}
                className="neo-btn bg-slate-300 hover:bg-slate-400 text-black text-base sm:text-lg py-3 px-8 shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] min-h-[48px]"
              >
                ביטול
              </button>
              <button 
                type="submit"
                disabled={saving || !categoryId}
                className="neo-btn bg-[#34d399] hover:bg-[#10b981] text-black font-black text-base sm:text-lg py-3 px-10 shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] min-h-[48px] disabled:opacity-50"
              >
                {saving ? '⏳ שומר...' : (isEdit ? '💾 שמור שינויים' : '🚀 הוסף לינק למאגר')}
              </button>
            </div>
          </form>
        </div>
      </div>

      <ConfirmModal
        isOpen={showExitConfirm}
        title="לצאת ללא שמירה?"
        message="האם אתה בטוח שברצונך לצאת? השינויים שביצעת לא יישמרו."
        confirmText="כן, צא ללא שמירה"
        cancelText="חזור לערוך"
        variant="warning"
        onConfirm={onClose}
        onCancel={() => setShowExitConfirm(false)}
      />
    </>
  );
}
