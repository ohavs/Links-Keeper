import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Plus, Trash2, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';
import { Category } from '../types';
import ConfirmModal from './ConfirmModal';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  categories: Category[];
  activeCategoryId: string;
  onSelectCategory: (id: string) => void;
  onAddCategory: () => void;
  onDeleteCategory: (id: string) => void;
}

export default function Sidebar({ categories, activeCategoryId, onSelectCategory, onAddCategory, onDeleteCategory }: SidebarProps) {
  const { user, signOut } = useAuth();
  return (
    <div className="w-[240px] flex-shrink-0 bg-white border-l-[3px] border-black hidden md:flex flex-col z-30">
      <div className="px-5 py-3 flex items-center gap-3 border-b-[3px] border-black bg-[#f472b6]">
        <div className="w-10 h-10 rounded-md border-[3px] border-black shadow-[2px_2px_0_0_#000] bg-[#fbbf24] flex items-center justify-center text-black font-black text-xl font-mono">
          L
        </div>
        <h1 className="font-black text-[20px] text-black tracking-tight m-0 uppercase line-clamp-1">LinkKeeper</h1>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-4 pt-6 pb-6 bg-[#f4f4f0]">
        <div>
          <h2 className="text-xs font-black text-black uppercase px-5 pb-3 font-mono tracking-widest">קטגוריות</h2>
          <div className="flex flex-col gap-2 px-4">
            {categories.map(category => (
              <CategoryItem 
                key={category.id}
                category={category}
                isActive={category.id === activeCategoryId}
                onClick={() => onSelectCategory(category.id)}
                onDelete={() => onDeleteCategory(category.id)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 border-t-[3px] border-black bg-[#f4f4f0] flex flex-col gap-3">
        <button
          onClick={onAddCategory}
          className="neo-btn bg-[#a78bfa] hover:bg-[#8b5cf6] text-black w-full py-2.5 text-sm shadow-[3px_3px_0_0_#000] hover:shadow-[5px_5px_0_0_#000] gap-2"
        >
          <Plus size={18} className="stroke-[3]" />
          <span className="font-black uppercase">קטגוריה חדשה</span>
        </button>
        {user && (
          <div className="flex items-center gap-2 pt-1">
            {user.photoURL && (
              <img src={user.photoURL} alt="" className="w-7 h-7 rounded-full border-[2px] border-black shrink-0" />
            )}
            <span className="text-xs font-bold truncate flex-1 text-black/70">{user.displayName || user.email}</span>
            <button
              onClick={signOut}
              title="יציאה"
              className="shrink-0 w-7 h-7 flex items-center justify-center border-[2px] border-black rounded-md bg-white hover:bg-red-100 cursor-pointer transition-colors"
            >
              <LogOut size={14} className="stroke-[2.5]" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function CategoryItem({ category, isActive, onClick, onDelete }: { category: Category, isActive: boolean, onClick: () => void, onDelete: () => void }) {
  const { setNodeRef, isOver } = useDroppable({
    id: category.id,
    data: { type: 'category' }
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <>
      <div className="relative group">
        <button
          ref={setNodeRef}
          onClick={onClick}
          onContextMenu={(e) => { e.preventDefault(); setShowDeleteConfirm(true); }}
          className={cn(
            "w-full flex items-center gap-2 px-3 py-2 text-[14px] font-black transition-all border-[3px] rounded-lg outline-none cursor-pointer text-black uppercase",
            isActive 
              ? "bg-[#34d399] border-black shadow-[2px_2px_0_0_#000] translate-x-[-2px] translate-y-[-2px]" 
              : "bg-white border-black hover:shadow-[2px_2px_0_0_#000] hover:translate-x-[-2px] hover:translate-y-[-2px]",
            isOver && !isActive && "ring-4 ring-black/20 bg-[#fde047]"
          )}
        >
          <div className="w-5 h-5 rounded border-[2px] border-black shrink-0" style={{ backgroundColor: category.color }} />
          <span className="flex-1 text-right truncate">{category.name}</span>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(true); }}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:text-red-600 outline-none cursor-pointer bg-transparent border-none"
          >
            <Trash2 size={14} className="stroke-[2.5]" />
          </button>
        </button>
      </div>

      <ConfirmModal
        isOpen={showDeleteConfirm}
        title="מחיקת קטגוריה?"
        message={`האם אתה בטוח שברצונך למחוק את הקטגוריה "${category.name}"? כל הלינקים שבה יימחקו לצמיתות.`}
        confirmText="כן, מחק"
        cancelText="ביטול"
        onConfirm={() => {
          onDelete();
          setShowDeleteConfirm(false);
        }}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </>
  );
}
