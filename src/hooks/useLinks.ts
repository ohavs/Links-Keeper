import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  getDocs,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Category, LinkItem } from '../types';

export function useLinks() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Real-time listener for categories
  useEffect(() => {
    const q = query(collection(db, 'categories'), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const cats: Category[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as Category[];
      setCategories(cats);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Real-time listener for links
  useEffect(() => {
    const q = query(collection(db, 'links'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: LinkItem[] = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          url: data.url,
          title: data.title,
          description: data.description || '',
          tags: data.tags || [],
          categoryId: data.categoryId,
          createdAt: data.createdAt instanceof Timestamp
            ? data.createdAt.toMillis()
            : data.createdAt,
        };
      });
      setLinks(items);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const addLink = useCallback(async (linkConfig: Omit<LinkItem, 'id' | 'createdAt'>) => {
    await addDoc(collection(db, 'links'), {
      ...linkConfig,
      createdAt: Timestamp.now(),
    });
  }, []);

  const updateLink = useCallback(async (id: string, updates: Partial<LinkItem>) => {
    const ref = doc(db, 'links', id);
    await updateDoc(ref, updates);
  }, []);

  const deleteLink = useCallback(async (id: string) => {
    const ref = doc(db, 'links', id);
    await deleteDoc(ref);
  }, []);

  const moveLink = useCallback(async (linkId: string, categoryId: string) => {
    await updateLink(linkId, { categoryId });
  }, [updateLink]);

  const addCategory = useCallback(async (name: string, color: string) => {
    const snapshot = await getDocs(collection(db, 'categories'));
    const order = snapshot.size;
    await addDoc(collection(db, 'categories'), { name, color, order });
  }, []);

  const deleteCategory = useCallback(async (categoryId: string) => {
    // Delete all links in this category
    const categoryLinks = links.filter(l => l.categoryId === categoryId);
    const batch = writeBatch(db);
    categoryLinks.forEach(link => {
      batch.delete(doc(db, 'links', link.id));
    });
    batch.delete(doc(db, 'categories', categoryId));
    await batch.commit();
  }, [links]);

  return {
    categories,
    links,
    loading,
    addCategory,
    deleteCategory,
    addLink,
    updateLink,
    deleteLink,
    moveLink,
  };
}
