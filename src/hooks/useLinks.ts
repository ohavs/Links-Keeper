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

export function useLinks(userId: string | null) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Combined real-time listeners scoped to user
  useEffect(() => {
    if (!userId) {
      setCategories([]);
      setLinks([]);
      setLoading(false);
      return;
    }

    const qCats = query(collection(db, 'users', userId, 'categories'), orderBy('order', 'asc'));
    const unsubscribeCats = onSnapshot(qCats, (snapshot) => {
      const cats: Category[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as Category[];
      setCategories(cats);
      setLoading(false);
    });

    const qLinks = query(collection(db, 'users', userId, 'links'), orderBy('createdAt', 'desc'));
    const unsubscribeLinks = onSnapshot(qLinks, (snapshot) => {
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
    });

    return () => {
      unsubscribeCats();
      unsubscribeLinks();
    };
  }, [userId]);

  const addLink = useCallback(async (linkConfig: Omit<LinkItem, 'id' | 'createdAt'>) => {
    if (!userId) return;
    await addDoc(collection(db, 'users', userId, 'links'), {
      ...linkConfig,
      createdAt: Timestamp.now(),
    });
  }, [userId]);

  const updateLink = useCallback(async (id: string, updates: Partial<LinkItem>) => {
    if (!userId) return;
    const ref = doc(db, 'users', userId, 'links', id);
    await updateDoc(ref, updates);
  }, [userId]);

  const deleteLink = useCallback(async (id: string) => {
    if (!userId) return;
    const ref = doc(db, 'users', userId, 'links', id);
    await deleteDoc(ref);
  }, [userId]);

  const moveLink = useCallback(async (linkId: string, categoryId: string) => {
    await updateLink(linkId, { categoryId });
  }, [updateLink]);

  const addCategory = useCallback(async (name: string, color: string): Promise<string> => {
    if (!userId) return '';
    const snapshot = await getDocs(collection(db, 'users', userId, 'categories'));
    const order = snapshot.size;
    const docRef = await addDoc(collection(db, 'users', userId, 'categories'), { name, color, order });
    return docRef.id;
  }, [userId]);

  const deleteCategory = useCallback(async (categoryId: string) => {
    if (!userId) return;
    const categoryLinks = links.filter(l => l.categoryId === categoryId);
    const batch = writeBatch(db);
    categoryLinks.forEach(link => {
      batch.delete(doc(db, 'users', userId, 'links', link.id));
    });
    batch.delete(doc(db, 'users', userId, 'categories', categoryId));
    await batch.commit();
  }, [userId, links]);

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
