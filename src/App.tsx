import React, { useState, useMemo } from 'react';
import { DndContext, DragEndEvent, pointerWithin, useSensor, useSensors, PointerSensor, KeyboardSensor } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useLinks } from './hooks/useLinks';
import { ViewMode } from './types';
import Sidebar from './components/Sidebar';
import LinkList from './components/LinkList';
import Header from './components/Header';
import AddLinkModal from './components/AddLinkModal';
import { cn } from './lib/utils';

export default function App() {
  const { categories, links, addLink, updateLink, deleteLink, moveLink } = useLinks();
  
  const [activeCategoryId, setActiveCategoryId] = useState<string>(categories[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && over.id && over.data.current?.type === 'category') {
      const linkId = active.id as string;
      const targetCategoryId = over.id as string;
      
      const link = links.find(l => l.id === linkId);
      if (link && link.categoryId !== targetCategoryId) {
        moveLink(linkId, targetCategoryId);
      }
    }
  };

  const filteredLinks = useMemo(() => {
    return links
      .filter(link => link.categoryId === activeCategoryId)
      .filter(link => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
          link.title.toLowerCase().includes(q) ||
          link.description.toLowerCase().includes(q) ||
          link.url.toLowerCase().includes(q) ||
          link.tags.some(tag => tag.toLowerCase().includes(q))
        );
      });
  }, [links, activeCategoryId, searchQuery]);

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={pointerWithin} 
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-[100dvh] overflow-hidden bg-[#f4f4f0] text-black selection:bg-black selection:text-white">
        <Sidebar 
          categories={categories} 
          activeCategoryId={activeCategoryId} 
          onSelectCategory={setActiveCategoryId} 
        />
        
        <div className="flex-1 flex flex-col min-w-0 h-full">
          <Header 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onAddClick={() => setIsAddModalOpen(true)}
          />
          
          <div className="md:hidden overflow-x-auto whitespace-nowrap px-3 py-2 bg-[#facc15] border-b-[3px] border-black flex items-center gap-2 hide-scrollbar shrink-0 shadow-[0_2px_0_0_#000] z-20">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategoryId(category.id)}
                className={cn(
                  "flex-shrink-0 px-4 py-1.5 text-xs font-black transition-all border-[3px] border-black rounded-md outline-none cursor-pointer uppercase",
                  activeCategoryId === category.id 
                    ? "bg-black text-white shadow-[2px_2px_0_0_#000] translate-x-[-2px] translate-y-[-2px]" 
                    : "bg-white text-black hover:shadow-[2px_2px_0_0_#000] hover:translate-x-[-2px] hover:translate-y-[-2px]"
                )}
              >
                {category.name}
              </button>
            ))}
          </div>

          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-6 flex flex-col gap-4 relative bg-[radial-gradient(#d4d4d0_1px,transparent_1px)] [background-size:16px_16px]">
             <div className="flex justify-between items-center z-10 sticky top-0 md:static mb-1">
               <h2 className="m-0 text-[20px] md:text-[24px] font-black text-black font-mono uppercase bg-[#a7f3d0] px-4 py-1 border-[3px] border-black shadow-[2px_2px_0_0_#000] inline-block -rotate-1 hover:rotate-0 transition-transform">
                 {categories.find(c => c.id === activeCategoryId)?.name || 'קטגוריה'}
               </h2>
             </div>
            <LinkList 
              links={filteredLinks}  
              viewMode={viewMode} 
              categories={categories}
              onMove={moveLink}
              onDelete={deleteLink}
              onEdit={(id) => { /* Edit modal integration later */ }}
              onAddClick={() => setIsAddModalOpen(true)}
            />
          </main>
        </div>
      </div>

      {isAddModalOpen && (
        <AddLinkModal 
          categories={categories}
          defaultCategoryId={activeCategoryId}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={addLink}
        />
      )}
    </DndContext>
  );
}
