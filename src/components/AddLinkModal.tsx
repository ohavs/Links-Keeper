import React, { useState, useRef, useEffect } from 'react';
import { X, Tag, Link2, ChevronDown, Check } from 'lucide-react';
import { Category, LinkItem } from '../types';
import { cn } from '../lib/utils';
import ConfirmModal from './ConfirmModal';

const INLINE_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#22c55e', '#06b6d4',
  '#3b82f6', '#8b5cf6', '#ec4899', '#64748b', '#000000'
];

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
  onAddCategory?: (name: string, color: string) => Promise<string>;
  allTags?: string[];
}

function CategoryDropdown({
  categories,
  value,
  onChange,
  onAddCategory,
}: {
  categories: Category[];
  value: string;
  onChange: (id: string) => void;
  onAddCategory?: (name: string, color: string) => Promise<string>;
}) {
  const [open, setOpen] = useState(false);
  const [showInlineAdd, setShowInlineAdd] = useState(false);
  const [inlineName, setInlineName] = useState('');
  const [inlineColor, setInlineColor] = useState(INLINE_COLORS[5]);
  const ref = useRef<HTMLDivElement>(null);
  const selected = categories.find(c => c.id === value);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setShowInlineAdd(false);
        setInlineName('');
        setInlineColor(INLINE_COLORS[5]);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleInlineSubmit = async () => {
    if (!inlineName.trim() || !onAddCategory) return;
    const newId = await onAddCategory(inlineName.trim(), inlineColor);
    onChange(newId);
    setShowInlineAdd(false);
    setInlineName('');
    setInlineColor(INLINE_COLORS[5]);
    setOpen(false);
  };

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
        <div className="absolute left-0 right-0 top-full mt-2 bg-white border-[3px] border-black rounded-xl shadow-[6px_6px_0_0_#000] z-50 overflow-hidden max-h-72 overflow-y-auto">
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

          {/* Inline Add Category */}
          {onAddCategory && (
            <div className="border-t-[2px] border-black/10">
              {!showInlineAdd ? (
                <button
                  type="button"
                  onClick={() => setShowInlineAdd(true)}
                  className="w-full flex items-center gap-2 px-4 py-3 text-right font-bold text-purple-600 cursor-pointer outline-none hover:bg-purple-50 transition-colors"
                >
                  <span className="text-lg leading-none">＋</span>
                  <span className="text-sm">הוסף קטגוריה</span>
                </button>
              ) : (
                <div className="px-4 py-3 flex flex-col gap-3">
                  <input
                    type="text"
                    value={inlineName}
                    onChange={e => setInlineName(e.target.value)}
                    placeholder="שם הקטגוריה..."
                    autoFocus
                    className="neo-input w-full text-sm py-2 px-3 font-bold border-[2px] shadow-[2px_2px_0_0_#000]"
                    onKeyDown={e => {
                      if (e.key === 'Enter') { e.preventDefault(); handleInlineSubmit(); }
                      if (e.key === 'Escape') { setShowInlineAdd(false); setInlineName(''); }
                    }}
                  />
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {INLINE_COLORS.map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setInlineColor(color)}
                        className={cn(
                          "w-6 h-6 rounded border-[2px] border-black cursor-pointer transition-transform",
                          inlineColor === color && "scale-125 shadow-[2px_2px_0_0_#000]"
                        )}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleInlineSubmit}
                      disabled={!inlineName.trim()}
                      className="neo-btn bg-[#8b5cf6] hover:bg-[#7c3aed] text-white text-xs py-1.5 px-3 shadow-[2px_2px_0_0_#000] disabled:opacity-50 flex-1"
                    >
                      הוסף
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowInlineAdd(false); setInlineName(''); setInlineColor(INLINE_COLORS[5]); }}
                      className="neo-btn bg-slate-200 hover:bg-slate-300 text-black text-xs py-1.5 px-3 shadow-[2px_2px_0_0_#000]"
                    >
                      ביטול
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
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
  initialDescription,
  onAddCategory,
  allTags,
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

  // Compute existing tags from tagsInput for suggestion filtering
  const currentTags = tagsInput
    .split(',')
    .map(t => t.trim())
    .filter(t => t.length > 0);

  const suggestedTags = (allTags || []).filter(tag => !currentTags.includes(tag));

  const handleAddSuggestedTag = (tag: string) => {
    const trimmed = tagsInput.trim();
    if (!trimmed) {
      setTagsInput(tag);
    } else {
      setTagsInput(trimmed + ', ' + tag);
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
              <label className="block text-sm sm:text-base font-black text-black mb-2 uppercase">כותרת</label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="שם הלינק..."
                className="neo-input w-full text-base sm:text-lg shadow-[4px_4px_0_0_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_#000] min-h-[48px]"
              />
            </div>

            <div>
              <label className="block text-sm sm:text-base font-black text-black mb-2 uppercase">בחר קטגוריה</label>
              <CategoryDropdown
                categories={categories}
                value={categoryId}
                onChange={setCategoryId}
                onAddCategory={onAddCategory}
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
              {suggestedTags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {suggestedTags.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleAddSuggestedTag(tag)}
                      className="text-xs font-bold px-2 py-0.5 bg-indigo-100 hover:bg-indigo-200 border-[2px] border-indigo-300 hover:border-indigo-400 rounded-md cursor-pointer transition-colors outline-none"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}
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
