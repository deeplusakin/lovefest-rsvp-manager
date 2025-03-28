
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
  const localImages = [
    {
      id: "local-1",
      url: "/lovable-uploads/a2cec386-bddb-4776-b915-5f10f11af18a.png",
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
      url: "/lovable-uploads/3e132b88-c31d-4c9d-a12b-dc331cfe4cc5.png",
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
      url: "/lovable-uploads/6a58f33f-48f6-4bb8-b1b7-e7db0e5484ea.png",
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
      url: "/lovable-uploads/e60696c8-133f-47bc-a36a-5b7dbff004ce.png",
      title: "Engagement Photo 4",
      type: "hero",
      storage_path: "",
      sort_order: 3,
      created_at: "",
      role: null,
      description: null
    },
    {
      id: "local-5",
      url: "/lovable-uploads/743ab683-3e6e-4eb5-85b8-f2faf98e1a38.png",
      title: "Engagement Photo 5",
      type: "hero",
      storage_path: "",
      sort_order: 4,
      created_at: "",
      role: null,
      description: null
    },
    {
      id: "local-6",
      url: "/lovable-uploads/319a4471-1baa-4c86-a8fa-224f0ff87a57.png",
      title: "Studio Photo 1",
      type: "hero",
      storage_path: "",
      sort_order: 5,
      created_at: "",
      role: null,
      description: null
    },
    {
      id: "local-7",
      url: "/lovable-uploads/51a58cbf-1022-4b19-a9f1-270c95787793.png",
      title: "Studio Photo 2",
      type: "hero",
      storage_path: "",
      sort_order: 6,
      created_at: "",
      role: null,
      description: null
    },
    {
      id: "local-8",
      url: "/lovable-uploads/b0265d99-e730-44d9-8aac-2e9205904d14.png",
      title: "Studio Photo 3",
      type: "hero",
      storage_path: "",
      sort_order: 7,
      created_at: "",
      role: null,
      description: null
    },
    {
      id: "local-9",
      url: "/lovable-uploads/6338d522-e1a2-4c44-b652-c4792fdd0bd6.png",
      title: "Brick Wall Photo 1",
      type: "hero",
      storage_path: "",
      sort_order: 8,
      created_at: "",
      role: null,
      description: null
    },
    {
      id: "local-10",
      url: "/lovable-uploads/6b31f6f2-621d-446c-829a-a70152dd8d4d.png",
      title: "Brick Wall Photo 2",
      type: "hero",
      storage_path: "",
      sort_order: 9,
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
          const typedData = data.filter(
            (photo: PhotoRow): photo is Photo => 
              photo.type === 'hero' || photo.type === 'gallery'
          );
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
