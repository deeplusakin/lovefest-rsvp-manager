
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Photo } from "@/types/photos";
import { localGalleryImages } from "@/constants/localPhotos";
import { formatPhotoData } from "@/utils/photoUtils";

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
          const typedData = formatPhotoData(data);
          setPhotos(typedData);
        } else {
          // If no data from Supabase, use local images
          setPhotos(localGalleryImages);
        }
      } catch (error) {
        console.error('Error fetching photos:', error);
        // Fallback to local images
        setPhotos(localGalleryImages);
      } finally {
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
