
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Photo, PhotoRow } from "@/types/photos";

// Local images for fallback/initial display while Supabase loads
const localImages: Photo[] = [
  {
    id: "local-1",
    url: "/lovable-uploads/a40a98cc-1d0a-455b-af47-5bfc109411e4.png",
    title: "Engagement Photo 1",
    type: "gallery",
    storage_path: "",
    sort_order: 0,
    created_at: "",
    role: null,
    description: null
  },
  {
    id: "local-2",
    url: "/lovable-uploads/0e751d32-b70e-432f-89c8-2c8365683770.png",
    title: "Engagement Photo 2",
    type: "gallery",
    storage_path: "",
    sort_order: 1,
    created_at: "",
    role: null,
    description: null
  },
  {
    id: "local-3",
    url: "/lovable-uploads/006735f7-84f2-4ff9-9c61-fb310e842b3a.png",
    title: "Engagement Photo 3",
    type: "gallery",
    storage_path: "",
    sort_order: 2,
    created_at: "",
    role: null,
    description: null
  }
];

export const usePhotoGallery = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const { data } = await supabase
          .from('photos')
          .select('*')
          .eq('type', 'gallery')
          .order('sort_order');
        
        if (data && data.length > 0) {
          // Filter and validate the data to ensure type compatibility
          const typedData = data
            .filter((photo: PhotoRow) => photo.type === 'gallery')
            .map((photo: PhotoRow): Photo => ({
              ...photo,
              type: 'gallery', // Explicitly cast to the valid union type
              role: photo.role,
              description: photo.description
            }));
          
          setPhotos(typedData);
          setIsLoading(false);
        } else {
          // If no data from Supabase, use local images
          setPhotos(localImages);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching photos:', error);
        // Fallback to local images
        setPhotos(localImages);
        setIsLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  return {
    photos,
    isLoading
  };
};
