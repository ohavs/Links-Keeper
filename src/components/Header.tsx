import React from 'react';
import { LayoutGrid, LayoutList, Plus } from 'lucide-react';
import { ViewMode } from '../types';
import { cn } from '../lib/utils';

interface HeaderProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onAddClick: () => void;
}

export default function Header({ viewMode, onViewModeChange, onAddClick }: HeaderProps) {
  return (
    <header className="bg-[#facc15] border-b-[3px] border-black px-4 md:px-6 py-3 flex items-center justify-between gap-3 sticky top-0 z-30 shadow-[0_4px_0_0_#000]">
      {/* Mobile brand branding */}
      <div className="flex items-center gap-2 md:hidden">
        <div className="w-8 h-8 rounded border-[2.5px] border-black shadow-[1.5px_1.5px_0_0_#000] bg-white flex items-center justify-center text-black font-black text-sm">
          L
        </div>
        <h1 className="font-black text-base text-black tracking-tight m-0 uppercase">LinkKeeper</h1>
      </div>

      <div className="flex items-center justify-end gap-3 mr-auto md:mr-0 w-full md:w-auto">
        <div className="flex items-center bg-white border-[3px] border-black rounded-md overflow-hidden shadow-[2px_2px_0_0_#000]">
          <button
            onClick={() => onViewModeChange('grid')}
            className={cn(
              "px-3 py-1.5 flex items-center justify-center transition-colors border-none outline-none cursor-pointer", 
              viewMode === 'grid' ? "bg-black text-white" : "bg-white text-black hover:bg-gray-200"
            )}
            title="תצוגה מפורטת (גריד)"
          >
            <LayoutGrid size={18} className={viewMode === 'grid' ? "stroke-[3]" : "stroke-[2.5]"} />
          </button>
          <div className="w-[3px] bg-black self-stretch"></div>
          <button
            onClick={() => onViewModeChange('list')}
            className={cn(
              "px-3 py-1.5 flex items-center justify-center transition-colors border-none outline-none cursor-pointer", 
              viewMode === 'list' ? "bg-black text-white" : "bg-white text-black hover:bg-gray-200"
            )}
            title="תצוגה קומפקטית (רשימה)"
          >
            <LayoutList size={18} className={viewMode === 'list' ? "stroke-[3]" : "stroke-[2.5]"} />
          </button>
        </div>
        
        <button 
          onClick={onAddClick}
          className="neo-btn bg-[#22d3ee] text-black p-0 w-10 h-10 shadow-[2px_2px_0_0_#000] hover:shadow-[4px_4px_0_0_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] flex items-center justify-center shrink-0"
          title="הוסף לינק"
          aria-label="הוסף לינק"
        >
          <Plus size={22} className="stroke-[2.5]" />
        </button>
      </div>
    </header>
  );
}
