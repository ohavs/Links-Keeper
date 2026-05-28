export type ViewMode = 'grid' | 'list';

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface LinkItem {
  id: string;
  url: string;
  title: string;
  description: string;
  tags: string[];
  categoryId: string;
  createdAt: number;
}
