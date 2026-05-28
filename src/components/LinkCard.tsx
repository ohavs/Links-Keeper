import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { FolderInput, Trash2, GripVertical, Settings } from 'lucide-react';
import { LinkItem, ViewMode, Category } from '../types';
import { cn } from '../lib/utils';

interface LinkCardProps {
  link: LinkItem;
  viewMode: ViewMode;
  categories: Category[];
  onMove: (linkId: string, categoryId: string) => void;
  onDelete: (id: string) => void;
}

export default function LinkCard({ link, viewMode, categories, onMove, onDelete }: LinkCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: link.id,
    data: { type: 'link', link }
  });

  const [showMenu, setShowMenu] = useState(false);

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: isDragging ? 50 : undefined,
  } : undefined;

  const isGrid = viewMode === 'grid';

  const hostname = React.useMemo(() => {
    try { return new URL(link.url).hostname; } catch(e) { return link.url; }
  }, [link.url]);

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative bg-white border-[3px] border-black rounded-xl transition-all cursor-grab active:cursor-grabbing hover:shadow-[8px_8px_0_0_#000] hover:translate-x-[-2px] hover:translate-y-[-2px]",
        isDragging ? "shadow-[12px_12px_0_0_#000] scale-[1.02] bg-yellow-50" : "shadow-[4px_4px_0_0_#000]",
        isGrid ? "p-5 flex flex-col h-full gap-4" : "p-4 flex sm:items-center flex-col sm:flex-row gap-5"
      )}
    >
      <div className={cn("flex-1 min-w-0 flex flex-col gap-3", isGrid ? "" : "")} >
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 overflow-hidden">
            <h3 className="font-black text-[20px] text-black m-0 leading-tight">
              {link.title}
            </h3>
            <a 
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[14px] text-white bg-black px-2 py-0.5 font-bold no-underline hover:bg-[#34d399] hover:text-black transition-colors inline-block mt-2 max-w-full truncate border-2 border-black relative z-10"
              onPointerDown={(e) => e.stopPropagation()}
            >
              🔗 {hostname}
            </a>
          </div>
          
          <div className="relative shrink-0 flex items-start gap-2">
            <button 
              {...listeners} 
              {...attributes}
              className="text-black bg-[#fbbf24] p-2 border-[3px] border-black rounded-lg cursor-grab touch-none opacity-0 group-hover:opacity-100 transition-all hidden sm:inline-flex md:hidden lg:inline-flex outline-none shadow-[2px_2px_0_0_#000] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] relative z-10"
            >
              <GripVertical size={20} className="stroke-[3]" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
              onPointerDown={(e) => e.stopPropagation()}
              className="w-11 h-11 inline-flex items-center justify-center rounded-lg border-[3px] border-black shadow-[2px_2px_0_0_#000] bg-[#c084fc] text-black font-black cursor-pointer hover:bg-[#a855f7] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all relative z-10"
            >
              <Settings size={22} className="stroke-[2.5] hover:animate-spin" />
            </button>
            
            {showMenu && (
              <div 
                className="absolute left-0 sm:right-0 sm:left-auto top-full mt-2 w-64 bg-white border-[3px] border-black shadow-[6px_6px_0_0_#000] p-1.5 z-50 flex flex-col gap-1.5 rounded-xl origin-top-left sm:origin-top-right animate-in fade-in zoom-in duration-200"
                onMouseLeave={() => setShowMenu(false)}
                onPointerDown={(e) => e.stopPropagation()}
              >
                <div className="px-3 py-2 text-sm font-black text-black uppercase tracking-widest bg-yellow-300 border-[3px] border-black rounded-md text-center">פעולות</div>
                <div className="px-3 py-1 mt-1 text-xs font-black text-slate-500 uppercase tracking-widest text-right">העבר לקטגוריה:</div>
                
                <div className="max-h-48 overflow-y-auto flex flex-col gap-1 pr-1 hide-scrollbar">
                  {categories.filter(c => c.id !== link.categoryId).map(cat => (
                    <button
                      key={cat.id}
                      onClick={(e) => { e.stopPropagation(); onMove(link.id, cat.id); setShowMenu(false); }}
                      className="w-full text-right px-3 py-2.5 font-bold text-black bg-[#f1f5f9] hover:bg-[#a7f3d0] border-[2px] border-black rounded-md flex items-center gap-3 bg-transparent outline-none cursor-pointer transition-all hover:shadow-[2px_2px_0_0_#000] hover:translate-x-[-2px] hover:translate-y-[-2px]"
                    >
                      <FolderInput size={18} className="stroke-[2.5]" /> {cat.name}
                    </button>
                  ))}
                  {categories.filter(c => c.id !== link.categoryId).length === 0 && (
                    <div className="px-3 py-2 text-sm text-center font-bold text-slate-400">אין קטגוריות נוספות</div>
                  )}
                </div>

                <div className="w-full h-[3px] bg-black my-1 rounded-full"></div>
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(link.id); setShowMenu(false); }}
                  className="w-full text-right px-3 py-2.5 font-black text-white bg-red-500 hover:bg-red-600 border-[3px] border-black rounded-md flex items-center gap-3 cursor-pointer outline-none transition-all shadow-[2px_2px_0_0_#000] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
                >
                  <Trash2 size={20} className="stroke-[2.5]" /> מחק לינק לצמיתות
                </button>
              </div>
            )}
          </div>
        </div>
        
        {link.tags && link.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {link.tags.map(tag => (
              <span key={tag} className="bg-[#fef08a] border-[2px] border-black text-black px-2.5 py-1 font-mono text-[13px] font-black tracking-wider shadow-[2px_2px_0_0_#000]">
                #{tag}
              </span>
            ))}
          </div>
        )}
        
        {link.description && (
          <div className="text-[15px] text-black font-semibold leading-[1.6] bg-[#e2e8f0] border-[3px] border-black p-3.5 m-0 shadow-[inset_2px_2px_0px_rgba(0,0,0,0.1)] rounded-lg">
            {link.description}
          </div>
        )}
      </div>
      
      {!isGrid && (
        <div className="flex items-center gap-3 shrink-0 mt-4 sm:mt-0 relative z-10">
           <div className="flex items-center gap-3 w-full sm:w-auto">
              <button onClick={(e) => { e.stopPropagation(); onDelete(link.id); }} className="neo-btn bg-red-400 p-3 h-auto w-full sm:w-auto text-black" title="מחק">
                <Trash2 size={20} className="stroke-[3]" /> <span className="sm:hidden font-black block mr-2">מחק</span>
              </button>
           </div>
        </div>
      )}
      
      {isGrid && (
        <div className="flex gap-3 mt-auto pt-5 border-t-[3px] border-black border-dashed relative z-10">
          <button onClick={(e) => { e.stopPropagation(); onDelete(link.id); }} className="neo-btn bg-red-400 flex-1 py-2 text-sm shrink-0" title="מחק">
            <Trash2 size={20} className="ml-2 inline-block stroke-[3]" /> <span className="mr-2">מחק לינק</span>
          </button>
        </div>
      )}
    </div>
  );
}
