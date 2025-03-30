
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Photo, PhotoRow } from "@/types/photos";
import { localHeroImages } from "@/constants/localPhotos";
import { formatPhotoData } from "@/utils/photoUtils";

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
          // Format the data using the utility function
          const typedData = formatPhotoData(data, 'hero');
          
          // Ensure we start with our featured image
          setImages(typedData);
          // Preload images after fetching
          const preloaded = await preloadImages(typedData.map(img => img.url));
          setIsLoading(!preloaded);
        } else {
          // If no data from Supabase, use local images
          setImages(localHeroImages);
          const preloaded = await preloadImages(localHeroImages.map(img => img.url));
          setIsLoading(!preloaded);
        }
      } catch (error) {
        console.error('Error fetching hero images:', error);
        // Fallback to local images
        setImages(localHeroImages);
        const preloaded = await preloadImages(localHeroImages.map(img => img.url));
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
