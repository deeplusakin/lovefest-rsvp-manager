
import { motion } from "framer-motion";
import type { Photo } from "@/types/photos";

interface HeroSlideshowProps {
  images: Photo[];
  currentImage: number;
  scale: any;
}

export const HeroSlideshow = ({ images, currentImage, scale }: HeroSlideshowProps) => {
  return (
    <>
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
            className="absolute inset-0 bg-cover bg-center brightness-[0.7] transition-all duration-1000"
            style={{ 
              backgroundImage: `url(${img.url})`,
              backgroundPosition: 'center center',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundColor: '#000',
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
    </>
  );
};
