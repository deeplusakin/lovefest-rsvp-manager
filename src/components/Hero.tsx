
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
      const { data } = await supabase
        .from('photos')
        .select('*')
        .eq('type', 'hero')
        .order('sort_order');
      
      if (data) {
        const typedData = data.filter(
          (photo: PhotoRow): photo is Photo => 
            photo.type === 'hero' || photo.type === 'gallery'
        );
        
        // Add the new uploaded image to the images array
        const newImage: Photo = {
          id: 'uploaded-hero-image',
          url: '/lovable-uploads/6a440240-ea36-4ac2-8b65-920a5e6c5620.png',
          title: 'Dearborne & Akin Formal Portrait',
          type: 'hero',
          storage_path: '',
          sort_order: 0,
          created_at: new Date().toISOString(),
          role: null,
          description: 'Elegant formal portrait of the couple in black attire'
        };
        
        // Place the new image at the beginning of the carousel
        const updatedImages = [newImage, ...typedData];
        setImages(updatedImages);
        
        // Preload images after fetching
        preloadImages(updatedImages.map(img => img.url));
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
