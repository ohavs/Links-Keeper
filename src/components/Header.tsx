import React from 'react';
import { Search, LayoutGrid, LayoutList, Plus } from 'lucide-react';
import { ViewMode } from '../types';
import { cn } from '../lib/utils';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onAddClick: () => void;
}

export default function Header({ searchQuery, onSearchChange, viewMode, onViewModeChange, onAddClick }: HeaderProps) {
  return (
    <header className="bg-[#facc15] border-b-[3px] border-black px-4 md:px-6 py-2 flex flex-col md:flex-row md:items-center justify-between gap-3 sticky top-0 z-30 shadow-[0_4px_0_0_#000]">
      <div className="relative max-w-lg w-full flex items-center">
        <div className="absolute inset-y-0 right-0 pl-3 pr-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-black stroke-[3]" />
        </div>
        <input
          type="text"
          placeholder="חיפוש לינקים, תגיות..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="neo-input w-full pr-10 py-1.5 text-black text-sm md:text-base bg-white border-[3px] border-black shadow-[2px_2px_0_0_#000] focus:shadow-[4px_4px_0_0_#000] focus:translate-x-[-2px] focus:translate-y-[-2px] rounded-md"
        />
      </div>

      <div className="flex items-center justify-between md:justify-end gap-3">
        <div className="flex items-center bg-white border-[3px] border-black rounded-md overflow-hidden shadow-[2px_2px_0_0_#000]">
          <button
            onClick={() => onViewModeChange('grid')}
            className={cn(
              "px-3 py-1.5 flex items-center justify-center transition-colors border-none outline-none cursor-pointer", 
              viewMode === 'grid' ? "bg-black text-white" : "bg-white text-black hover:bg-gray-200"
            )}
            title="תצוגת גריד"
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
            title="תצוגת רשימה"
          >
            <LayoutList size={18} className={viewMode === 'list' ? "stroke-[3]" : "stroke-[2.5]"} />
          </button>
        </div>
        
        <button 
          onClick={onAddClick}
          className="neo-btn bg-[#22d3ee] text-black py-1.5 px-4 shadow-[2px_2px_0_0_#000] hover:shadow-[4px_4px_0_0_#000] hover:translate-x-[-2px] hover:translate-y-[-2px]"
        >
          <Plus size={18} className="stroke-[4]" />
          <span className="hidden sm:inline mr-1 font-black text-base">הוסף לינק</span>
        </button>
      </div>
    </header>
  );
}
