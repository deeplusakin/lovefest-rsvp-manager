
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Photo, PhotoRow } from "@/types/photos";

// Local images for fallback/initial display while Supabase loads
const localImages: Photo[] = [
  {
    id: "local-1",
    url: "/lovable-uploads/a40a98cc-1d0a-455b-af47-5bfc109411e4.png",
    title: "Engagement Photo 1",
    type: "hero",
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
    type: "hero",
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
    type: "hero",
    storage_path: "",
    sort_order: 2,
    created_at: "",
    role: null,
    description: null
  }
];

// Preload images utility
const preloadImages = async (imageUrls: string[]) => {
  const loadImage = (url: string) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve(url);
      img.onerror = reject;
    });
  };

  try {
    await Promise.all(imageUrls.map(url => loadImage(url)));
    return true;
  } catch (error) {
    console.error('Error preloading images:', error);
    return false;
  }
};

export const useHeroImages = () => {
  const [images, setImages] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const fetchHeroImages = async () => {
      try {
        const { data } = await supabase
          .from('photos')
          .select('*')
          .eq('type', 'hero')
          .order('sort_order');
        
        if (data && data.length > 0) {
          // Filter and validate the data to ensure type compatibility
          const typedData = data
            .filter((photo: PhotoRow) => photo.type === 'hero')
            .map((photo: PhotoRow): Photo => ({
              ...photo,
              type: 'hero', // Explicitly cast to the valid union type
              role: photo.role,
              description: photo.description
            }));
          
          setImages(typedData);
          // Preload images after fetching
          const preloaded = await preloadImages(typedData.map(img => img.url));
          setIsLoading(!preloaded);
        } else {
          // If no data from Supabase, use local images
          setImages(localImages);
          const preloaded = await preloadImages(localImages.map(img => img.url));
          setIsLoading(!preloaded);
        }
      } catch (error) {
        console.error('Error fetching hero images:', error);
        // Fallback to local images
        setImages(localImages);
        const preloaded = await preloadImages(localImages.map(img => img.url));
        setIsLoading(!preloaded);
      }
    };

    fetchHeroImages();
  }, []);

  useEffect(() => {
    if (images.length === 0) return;
    
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 8000);
    
    return () => clearInterval(timer);
  }, [images.length]);

  return {
    images,
    isLoading,
    currentImage
  };
};
