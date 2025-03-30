
import { motion } from "framer-motion";
import type { Photo } from "@/types/photos";

interface PhotoGalleryProps {
  photos: Photo[];
  onPhotoClick: (photo: Photo) => void;
}

export const PhotoGallery = ({ photos, onPhotoClick }: PhotoGalleryProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {photos.map((photo, index) => (
        <motion.div
          key={photo.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer"
          onClick={() => onPhotoClick(photo)}
        >
          <img
            src={photo.url}
            alt={photo.title || ''}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </motion.div>
      ))}
    </div>
  );
};
