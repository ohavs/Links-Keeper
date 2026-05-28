import React from 'react';
import { LinkItem, ViewMode, Category } from '../types';
import LinkCard from './LinkCard';
import { Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

interface LinkListProps {
  links: LinkItem[];
  viewMode: ViewMode;
  categories: Category[];
  onMove: (linkId: string, categoryId: string) => void;
  onDelete: (id: string) => void;
  onEdit: (link: LinkItem) => void;
  onAddClick?: () => void;
}

export default function LinkList({ links, viewMode, categories, onMove, onDelete, onEdit, onAddClick }: LinkListProps) {
  if (links.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 md:p-16 bg-white border-[4px] border-black shadow-[8px_8px_0_0_#000] text-black mt-4 rounded-xl z-10 w-full max-w-2xl mx-auto">
        <Sparkles size={80} className="stroke-[2] text-[#f472b6] mb-8" />
        <h3 className="text-2xl md:text-3xl font-black mb-4 uppercase text-center bg-[#fde047] px-6 py-2 border-[3px] border-black shadow-[4px_4px_0_0_#000] -rotate-2">הקטגוריה ריקה</h3>
        <p className="text-lg font-bold text-center mt-4">אין כאן לינקים. גרור לכאן לינקים או הוסף חדשים!</p>
        {onAddClick && (
          <button onClick={onAddClick} className="neo-btn bg-[#818cf8] text-white mt-10 text-xl px-10 py-4 w-full max-w-sm rounded-xl">
            <span className="font-black">לחץ להוספת לינק חדש!</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={cn(
      "gap-4 md:gap-6 z-10",
      viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4" : "flex flex-col max-w-4xl mx-auto w-full"
    )}>
      {links.map(link => (
        <LinkCard 
          key={link.id} 
          link={link} 
          viewMode={viewMode}
          categories={categories}
          onMove={onMove}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
      {viewMode === 'grid' && onAddClick && (
        <button 
          onClick={onAddClick}
          className="neo-card bg-[#e2e8f0] flex flex-col items-center justify-center cursor-pointer min-h-[240px] hover:bg-[#cbd5e1] border-dashed border-[4px] transition-all outline-none"
        >
          <div className="w-20 h-20 bg-[#fbbf24] border-[3px] border-black shadow-[4px_4px_0_0_#000] rounded-full text-black flex items-center justify-center mb-6 hover:scale-110 transition-transform">
            <span className="text-5xl font-black mb-1">+</span>
          </div>
          <div className="text-2xl font-black text-black uppercase">הוסף לינק מהיר</div>
        </button>
      )}
    </div>
  );
}
