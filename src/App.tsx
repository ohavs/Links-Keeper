import React, { useState, useMemo } from 'react';
import { DndContext, DragEndEvent, pointerWithin, useSensor, useSensors, PointerSensor, KeyboardSensor } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useLinks } from './hooks/useLinks';
import { ViewMode, LinkItem } from './types';
import Sidebar from './components/Sidebar';
import LinkList from './components/LinkList';
import Header from './components/Header';
import AddLinkModal from './components/AddLinkModal';
import AddCategoryModal from './components/AddCategoryModal';
import TagFilter from './components/TagFilter';
import { cn } from './lib/utils';
import { Loader2, Plus } from 'lucide-react';

export default function App() {
  const { 
    categories, 
    links, 
    loading, 
    addLink, 
    updateLink, 
    deleteLink, 
    moveLink, 
    addCategory, 
    deleteCategory 
  } = useLinks();
  
  const [activeCategoryId, setActiveCategoryId] = useState<string>('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sharedData, setSharedData] = useState<{ url: string; title: string; description: string } | null>(null);

  // Set active category to first one when categories load
  React.useEffect(() => {
    if (categories.length > 0 && !activeCategoryId) {
      setActiveCategoryId(categories[0].id);
    }
  }, [categories, activeCategoryId]);

  // Parse share target parameters on startup
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const params = new URLSearchParams(window.location.search);
    const sharedUrl = params.get('url');
    const sharedTitle = params.get('title');
    const sharedText = params.get('text');

    if (sharedUrl || sharedTitle || sharedText) {
      let finalUrl = '';
      let finalTitle = sharedTitle || '';
      let finalDescription = '';

      // 1. Check if 'url' parameter contains a valid link
      if (sharedUrl && (sharedUrl.startsWith('http://') || sharedUrl.startsWith('https://'))) {
        finalUrl = sharedUrl;
        if (sharedText) finalDescription = sharedText;
      }
      // 2. If not, check if 'text' contains a link
      else if (sharedText) {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const match = sharedText.match(urlRegex);
        if (match) {
          finalUrl = match[0];
          // Use remaining text as description or title
          const remainingText = sharedText.replace(finalUrl, '').trim();
          if (remainingText) {
            if (!finalTitle) {
              finalTitle = remainingText;
            } else {
              finalDescription = remainingText;
            }
          }
        } else if (sharedText.startsWith('http://') || sharedText.startsWith('https://')) {
          finalUrl = sharedText;
        } else {
          finalDescription = sharedText;
        }
      }

      if (finalUrl) {
        setSharedData({
          url: finalUrl,
          title: finalTitle || 'לינק משותף',
          description: finalDescription
        });
        setIsAddModalOpen(true);
      }

      // Clear search query parameters from browser address bar without reloading
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

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

  // Get links for active category
  const categoryLinks = useMemo(() => {
    return links.filter(link => link.categoryId === activeCategoryId);
  }, [links, activeCategoryId]);

  // Extract unique tags from category links
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    categoryLinks.forEach(link => {
      link.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [categoryLinks]);

  // Reset selected tags when switching category
  React.useEffect(() => {
    setSelectedTags([]);
  }, [activeCategoryId]);

  const handleToggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // Filter ONLY by selected tags (search query removed)
  const filteredLinks = useMemo(() => {
    return categoryLinks
      .filter(link => {
        // Tag filter: if tags are selected, link must have at least one of them
        if (selectedTags.length > 0) {
          return selectedTags.some(tag => link.tags.includes(tag));
        }
        return true;
      });
  }, [categoryLinks, selectedTags]);

  if (loading) {
    return (
      <div className="flex h-[100dvh] items-center justify-center bg-[#f4f4f0]">
        <div className="flex flex-col items-center gap-6">
          <div className="w-20 h-20 bg-[#facc15] border-[4px] border-black shadow-[6px_6px_0_0_#000] rounded-xl flex items-center justify-center animate-bounce">
            <span className="text-3xl font-black font-mono">L</span>
          </div>
          <div className="flex items-center gap-3">
            <Loader2 size={24} className="animate-spin stroke-[3]" />
            <span className="text-lg font-black uppercase">טוען...</span>
          </div>
        </div>
      </div>
    );
  }

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
          onAddCategory={() => setIsCategoryModalOpen(true)}
          onDeleteCategory={deleteCategory}
        />
        
        <div className="flex-1 flex flex-col min-w-0 h-full">
          <Header 
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onAddClick={() => setIsAddModalOpen(true)}
          />
          
          <div className="md:hidden overflow-x-auto whitespace-nowrap px-3 py-2 bg-[#facc15] border-b-[3px] border-black flex items-center gap-2 hide-scrollbar shrink-0 shadow-[0_2px_0_0_#000] z-20">
            {/* Category Plus Button for Mobile */}
            <button
              onClick={() => setIsCategoryModalOpen(true)}
              className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-white hover:bg-slate-100 border-[3px] border-black rounded-md outline-none cursor-pointer shadow-[2px_2px_0_0_#000] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all ml-1"
              title="קטגוריה חדשה"
            >
              <Plus size={16} className="stroke-[3]" />
            </button>
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

          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-6 flex flex-col gap-3 relative bg-[radial-gradient(#d4d4d0_1px,transparent_1px)] [background-size:16px_16px]">
             <div className="flex justify-between items-center z-10 sticky top-0 md:static mb-0">
               <h2 className="m-0 text-[18px] md:text-[22px] font-black text-black font-mono uppercase bg-[#a7f3d0] px-4 py-1 border-[3px] border-black shadow-[2px_2px_0_0_#000] inline-block -rotate-1 hover:rotate-0 transition-transform">
                 {categories.find(c => c.id === activeCategoryId)?.name || 'קטגוריה'}
               </h2>
             </div>

             <TagFilter
               allTags={allTags}
               selectedTags={selectedTags}
               onToggleTag={handleToggleTag}
               onClearTags={() => setSelectedTags([])}
             />

            <LinkList 
              links={filteredLinks}  
              viewMode={viewMode} 
              categories={categories}
              onMove={moveLink}
              onDelete={deleteLink}
              onEdit={(link) => setEditingLink(link)}
              onAddClick={() => setIsAddModalOpen(true)}
            />
          </main>
        </div>
      </div>

      {isAddModalOpen && (
        <AddLinkModal 
          categories={categories}
          defaultCategoryId={activeCategoryId}
          onClose={() => {
            setIsAddModalOpen(false);
            setSharedData(null);
          }}
          onAdd={addLink}
          initialUrl={sharedData?.url}
          initialTitle={sharedData?.title}
          initialDescription={sharedData?.description}
        />
      )}

      {editingLink && (
        <AddLinkModal 
          categories={categories}
          defaultCategoryId={activeCategoryId}
          linkToEdit={editingLink}
          onClose={() => setEditingLink(null)}
          onUpdate={updateLink}
        />
      )}

      {isCategoryModalOpen && (
        <AddCategoryModal 
          onClose={() => setIsCategoryModalOpen(false)}
          onAdd={addCategory}
        />
      )}
    </DndContext>
  );
}
