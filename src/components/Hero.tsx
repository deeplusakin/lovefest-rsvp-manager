
import { useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useHeroImages } from "@/hooks/useHeroImages";
import { HeroContent } from "@/components/hero/HeroContent";
import { HeroSlideshow } from "@/components/hero/HeroSlideshow";
import { HeroLoading } from "@/components/hero/HeroLoading";

export const Hero = () => {
  const ref = useRef<HTMLElement>(null);
  const { images, isLoading, currentImage } = useHeroImages();
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
    layoutEffect: false // Fix for the hydration warning
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

  if (isLoading) {
    return <HeroLoading />;
  }

  if (images.length === 0) {
    return null;
  }

  return (
    <section 
      ref={ref} 
      className="min-h-screen relative flex items-center justify-center overflow-hidden -mx-[calc(50vw-50%)]"
    >
      <HeroSlideshow 
        images={images} 
        currentImage={currentImage} 
        scale={scale} 
      />
      <HeroContent opacity={opacity} />
    </section>
  );
};
