
export interface Photo {
  id: string;
  url: string;
  title: string | null;
  type: 'hero' | 'gallery' | 'wedding-party';
  storage_path: string;
  sort_order: number;
  created_at: string;
  role: string | null;
  description: string | null;
}

// Add this type to properly type the Supabase response
export interface PhotoRow {
  created_at: string;
  id: string;
  sort_order: number | null;
  storage_path: string;
  title: string | null;
  type: string;
  url: string;
  role: string | null;
  description: string | null;
}
