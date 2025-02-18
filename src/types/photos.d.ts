
export interface Photo {
  id: string;
  url: string;
  title: string | null;
  type: 'hero' | 'gallery';
  storage_path: string;
  sort_order: number;
  created_at: string;
}
