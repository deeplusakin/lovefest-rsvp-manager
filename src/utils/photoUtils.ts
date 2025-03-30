
import type { Photo, PhotoRow } from "@/types/photos";

// Helper function to convert Supabase data to Photo type
export const formatPhotoData = (data: PhotoRow[]): Photo[] => {
  if (!data || data.length === 0) return [];
  
  // Filter and validate the data to ensure type compatibility
  return data
    .filter((photo: PhotoRow) => photo.type === 'gallery')
    .map((photo: PhotoRow): Photo => ({
      ...photo,
      type: 'gallery', // Explicitly cast to the valid union type
      role: photo.role,
      description: photo.description
    }));
};
