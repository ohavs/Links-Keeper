import React, { useState } from 'react';
import { X, Tag, Link2 } from 'lucide-react';
import { Category } from '../types';

interface AddLinkModalProps {
  categories: Category[];
  defaultCategoryId: string;
  onClose: () => void;
  onAdd: (linkConfig: { url: string; title: string; description: string; tags: string[]; categoryId: string; }) => void;
}

export default function AddLinkModal({ categories, defaultCategoryId, onClose, onAdd }: AddLinkModalProps) {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [categoryId, setCategoryId] = useState(defaultCategoryId || (categories[0]?.id || ''));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !title) return;
    
    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    onAdd({ url, title, description, tags, categoryId });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6" onClick={onClose}>
      <div 
        className="bg-white border-[4px] border-black shadow-[8px_8px_0_0_#000] w-full max-w-xl flex flex-col rounded-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b-[4px] border-black flex items-center justify-between bg-[#a78bfa]">
          <h2 className="text-2xl font-black text-black m-0 uppercase tracking-widest flex items-center gap-3">
            <Link2 size={28} className="stroke-[3]" />
            הוסף לינק חדש
          </h2>
          <button onClick={onClose} className="neo-btn bg-white hover:bg-red-400 p-2 shadow-[2px_2px_0_0_#000] hover:shadow-[4px_4px_0_0_#000] rounded-lg">
            <X size={24} className="stroke-[3]" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 md:p-8 flex flex-col gap-6 bg-[#f4f4f0] max-h-[80vh] overflow-y-auto">
          <div>
            <label className="block text-base font-black text-black mb-2 uppercase">כתובת הלינק (URL)</label>
            <input 
              type="url" 
              required
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="neo-input w-full text-left font-mono text-lg shadow-[4px_4px_0_0_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_#000]"
              dir="ltr"
            />
          </div>
          
          <div>
            <label className="block text-base font-black text-black mb-2 uppercase">כותרת מותאמת אישית</label>
            <input 
              type="text" 
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="תן כותרת שתרצה לזכור..."
              className="neo-input w-full text-lg shadow-[4px_4px_0_0_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_#000]"
            />
          </div>

          <div>
            <label className="block text-base font-black text-black mb-2 uppercase">בחר קטגוריה</label>
            <div className="relative group">
              <select 
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                className="neo-input w-full appearance-none pl-14 cursor-pointer text-lg font-bold shadow-[4px_4px_0_0_#000] group-hover:translate-x-[-2px] group-hover:translate-y-[-2px] group-hover:shadow-[6px_6px_0_0_#000]"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 left-0 flex items-center px-4 pointer-events-none border-r-[3px] border-black bg-[#fbbf24] rounded-l-lg group-hover:translate-x-[-2px] group-hover:translate-y-[-2px] shadow-[4px_4px_0_0_#000] group-hover:shadow-[6px_6px_0_0_#000] transition-all">
                <svg className="w-6 h-6 text-black stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-base font-black text-black mb-2 uppercase">תיאור (אופציונלי)</label>
            <textarea 
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="למה שמרת את הלינק הזה? (מומלץ)"
              className="neo-input w-full resize-none text-lg shadow-[4px_4px_0_0_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_#000]"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-base font-black text-black mb-2 uppercase">
              <Tag size={20} className="stroke-[2.5]" />
              תגיות חיפוש
              <span className="font-bold text-xs lowercase bg-[#fde047] px-2 py-0.5 border-2 border-black rotate-2 shadow-[2px_2px_0_0_#000]">פסיק בין תגיות</span>
            </label>
            <input 
              type="text" 
              value={tagsInput}
              onChange={e => setTagsInput(e.target.value)}
              placeholder="React, CSS, דוגמאות..."
              className="neo-input w-full text-lg shadow-[4px_4px_0_0_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_#000]"
            />
          </div>
          
          <div className="mt-8 flex flex-col sm:flex-row justify-end gap-5">
            <button 
              type="button" 
              onClick={onClose}
              className="neo-btn bg-slate-300 hover:bg-slate-400 text-black text-lg py-3 px-8 shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000]"
            >
              ביטול
            </button>
            <button 
              type="submit"
              className="neo-btn bg-[#34d399] hover:bg-[#10b981] text-black font-black text-lg py-3 px-10 shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000]"
            >
              🚀 הוסף לינק למאגר
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
