import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Folder } from 'lucide-react';
import { cn } from '../lib/utils';
import { Category } from '../types';

interface SidebarProps {
  categories: Category[];
  activeCategoryId: string;
  onSelectCategory: (id: string) => void;
}

export default function Sidebar({ categories, activeCategoryId, onSelectCategory }: SidebarProps) {
  return (
    <div className="w-[240px] flex-shrink-0 bg-white border-l-[3px] border-black hidden md:flex flex-col z-30">
      <div className="px-5 py-3 flex items-center gap-3 border-b-[3px] border-black bg-[#f472b6]">
        <div className="w-10 h-10 rounded-md border-[3px] border-black shadow-[2px_2px_0_0_#000] bg-[#fbbf24] flex items-center justify-center text-black font-black text-xl">
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
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CategoryItem({ category, isActive, onClick }: { category: Category, isActive: boolean, onClick: () => void }) {
  const { setNodeRef, isOver } = useDroppable({
    id: category.id,
    data: { type: 'category' }
  });

  return (
    <button
      ref={setNodeRef}
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-2 px-3 py-2 text-[14px] font-black transition-all border-[3px] rounded-lg outline-none cursor-pointer text-black uppercase",
        isActive 
          ? "bg-[#34d399] border-black shadow-[2px_2px_0_0_#000] translate-x-[-2px] translate-y-[-2px]" 
          : "bg-white border-black hover:shadow-[2px_2px_0_0_#000] hover:translate-x-[-2px] hover:translate-y-[-2px]",
        isOver && !isActive && "ring-4 ring-black/20 bg-[#fde047]"
      )}
    >
      <Folder size={20} className="stroke-[3]" style={{ color: isActive ? '#000' : category.color }} />
      <span>{category.name}</span>
    </button>
  );
}
