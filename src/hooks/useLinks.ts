import { useState, useEffect } from 'react';
import { Category, LinkItem } from '../types';
import { generateId } from '../lib/utils';

const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'כללי', color: '#64748b' },
  { id: '2', name: 'עבודה', color: '#0ea5e9' },
  { id: '3', name: 'קריאה', color: '#10b981' },
  { id: '4', name: 'השראה', color: '#a855f7' },
];

export function useLinks() {
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('link_categories');
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });

  const [links, setLinks] = useState<LinkItem[]>(() => {
    const saved = localStorage.getItem('link_items');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('link_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('link_items', JSON.stringify(links));
  }, [links]);

  const addCategory = (name: string, color: string) => {
    setCategories([...categories, { id: generateId(), name, color }]);
  };

  const addLink = (linkConfig: Omit<LinkItem, 'id' | 'createdAt'>) => {
    const newLink: LinkItem = {
      ...linkConfig,
      id: generateId(),
      createdAt: Date.now(),
    };
    setLinks([newLink, ...links]);
  };

  const updateLink = (id: string, updates: Partial<LinkItem>) => {
    setLinks(links.map(link => link.id === id ? { ...link, ...updates } : link));
  };

  const deleteLink = (id: string) => {
    setLinks(links.filter(link => link.id !== id));
  };

  const moveLink = (linkId: string, categoryId: string) => {
    updateLink(linkId, { categoryId });
  };

  return {
    categories,
    links,
    addCategory,
    addLink,
    updateLink,
    deleteLink,
    moveLink
  };
}
