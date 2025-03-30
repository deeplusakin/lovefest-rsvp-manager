
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Photo, PhotoRow } from "@/types/photos";

export const Hero = () => {
  const ref = useRef<HTMLElement>(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [images, setImages] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
    layoutEffect: false // Fix for the hydration warning
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

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
    },
    {
      id: "local-4",
      url: "/lovable-uploads/9914d26f-de37-4821-a0af-bdcbf64867a6.png",
      title: "Formal Portrait",
      type: "hero",
      storage_path: "",
      sort_order: 3,
      created_at: "",
      role: null,
      description: null
    }
  ];

  // Preload images
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
      setIsLoading(false);
    } catch (error) {
      console.error('Error preloading images:', error);
      setIsLoading(false);
    }
  };

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
          preloadImages(typedData.map(img => img.url));
        } else {
          // If no data from Supabase, use local images
          setImages(localImages);
          preloadImages(localImages.map(img => img.url));
        }
      } catch (error) {
        console.error('Error fetching hero images:', error);
        // Fallback to local images
        setImages(localImages);
        preloadImages(localImages.map(img => img.url));
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

  if (isLoading) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="animate-pulse text-2xl text-gray-500">Loading beautiful moments...</div>
    </div>;
  }

  if (images.length === 0) {
    return null;
  }

  return (
    <section 
      ref={ref} 
      className="min-h-screen relative flex items-center justify-center overflow-hidden -mx-[calc(50vw-50%)]"
    >
      {images.map((img, index) => (
        <motion.div
          key={img.id}
          animate={{
            opacity: currentImage === index ? 1 : 0,
            scale: currentImage === index ? 1 : 1.1
          }}
          initial={false}
          transition={{ duration: 1.5 }}
          style={{ scale }}
          className="absolute inset-0"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center brightness-50 transition-all duration-1000"
            style={{ 
              backgroundImage: `url(${img.url})`,
              willChange: 'transform'
            }}
            aria-label={img.title || 'Hero image'}
            role="img"
          >
            {/* Hidden image for preloading */}
            <img 
              src={img.url} 
              alt="" 
              className="hidden" 
              loading="eager"
              aria-hidden="true"
            />
          </div>
        </motion.div>
      ))}
      <motion.div style={{ opacity }} className="relative z-10 text-center text-white px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-lg font-light tracking-widest mb-4"
        >
          August 30, 2025
        </motion.h2>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-6xl md:text-7xl lg:text-8xl font-serif mb-6"
        >
          Dearborne & Akin
        </motion.h1>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg font-light tracking-wide"
        >
          Join us for our celebration of love
        </motion.div>
      </motion.div>
    </section>
  );
};
