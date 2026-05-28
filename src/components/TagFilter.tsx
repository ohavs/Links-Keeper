import React from 'react';
import { Tag } from 'lucide-react';
import { cn } from '../lib/utils';

interface TagFilterProps {
  allTags: string[];
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
  onClearTags: () => void;
}

export default function TagFilter({ allTags, selectedTags, onToggleTag, onClearTags }: TagFilterProps) {
  if (allTags.length === 0) return null;

  return (
    <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar py-2 z-10 shrink-0">
      <div className="flex items-center gap-1.5 shrink-0 ml-1">
        <Tag size={16} className="stroke-[3] text-black" />
        <span className="text-xs font-black text-black uppercase tracking-wider hidden sm:inline">פילטר:</span>
      </div>
      
      <button
        onClick={onClearTags}
        className={cn(
          "flex-shrink-0 px-3 py-1.5 text-xs font-black transition-all border-[2.5px] border-black rounded-full outline-none cursor-pointer",
          selectedTags.length === 0
            ? "bg-black text-white shadow-[2px_2px_0_0_#facc15]"
            : "bg-white text-black hover:bg-gray-100 shadow-[1px_1px_0_0_#000]"
        )}
      >
        הכל
      </button>

      {allTags.map(tag => (
        <button
          key={tag}
          onClick={() => onToggleTag(tag)}
          className={cn(
            "flex-shrink-0 px-3 py-1.5 text-xs font-bold transition-all border-[2.5px] border-black rounded-full outline-none cursor-pointer",
            selectedTags.includes(tag)
              ? "bg-[#fef08a] text-black shadow-[2px_2px_0_0_#000] font-black"
              : "bg-white text-black hover:bg-gray-50 shadow-[1px_1px_0_0_#000]"
          )}
        >
          #{tag}
        </button>
      ))}
    </div>
  );
}
