
import { motion } from "framer-motion";
import { useState } from "react";
import type { Photo } from "@/types/photos";
import { PhotoGallery } from "@/components/photos/PhotoGallery";
import { PhotoViewer } from "@/components/photos/PhotoViewer";
import { usePhotoGallery } from "@/hooks/usePhotoGallery";

const Photos = () => {
  const { photos, isLoading } = usePhotoGallery();
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const openPhotoViewer = (photo: Photo) => {
    setSelectedPhoto(photo);
    document.body.style.overflow = 'hidden';
  };

  const closePhotoViewer = () => {
    setSelectedPhoto(null);
    document.body.style.overflow = '';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse text-2xl text-gray-500">Loading gallery...</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-white py-24"
    >
      <div className="container max-w-7xl">
        <h1 className="text-4xl md:text-5xl font-serif text-center mb-12">Our Photos</h1>
        <PhotoGallery photos={photos} onPhotoClick={openPhotoViewer} />
      </div>

      <PhotoViewer 
        isOpen={selectedPhoto !== null}
        photos={photos}
        onClose={closePhotoViewer}
      />
    </motion.div>
  );
};

export default Photos;
