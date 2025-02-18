
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface HeroImage {
  id: string;
  url: string;
}

export const Hero = () => {
  const ref = useRef<HTMLElement>(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [images, setImages] = useState<HeroImage[]>([]);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

  useEffect(() => {
    const fetchHeroImages = async () => {
      const { data } = await supabase
        .from('photos')
        .select('id, url')
        .eq('type', 'hero')
        .order('sort_order');
      
      setImages(data || []);
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
    <section ref={ref} className="min-h-screen relative flex items-center justify-center overflow-hidden -mx-[calc(50vw-50%)]">
      {images.map((img, index) => (
        <motion.div
          key={img.id}
          animate={{
            opacity: currentImage === index ? 1 : 0,
            scale: currentImage === index ? 1 : 1.1
          }}
          transition={{ duration: 2.5 }}
          style={{ scale }}
          className="absolute inset-0"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center brightness-50 transition-all duration-2000"
            style={{ backgroundImage: `url(${img.url})` }}
          />
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
