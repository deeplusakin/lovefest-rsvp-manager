
import { motion } from "framer-motion";
import type { Photo } from "@/types/photos";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface PhotoViewerProps {
  isOpen: boolean;
  photos: Photo[];
  onClose: () => void;
}

export const PhotoViewer = ({ isOpen, photos, onClose }: PhotoViewerProps) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="relative w-full max-w-6xl" onClick={(e) => e.stopPropagation()}>
        <button
          className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white rounded-full p-2"
          onClick={onClose}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <Carousel className="w-full">
          <CarouselContent>
            {photos.map((photo) => (
              <CarouselItem key={photo.id}>
                <div className="flex justify-center items-center h-[80vh]">
                  <img
                    src={photo.url}
                    alt={photo.title || ''}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
      </div>
    </motion.div>
  );
};
