
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Photo, PhotoRow } from "@/types/photos";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const Photos = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Local images for fallback/initial display while Supabase loads
  const localImages: Photo[] = [
    {
      id: "local-1",
      url: "/lovable-uploads/a2cec386-bddb-4776-b915-5f10f11af18a.png",
      title: "Engagement Photo 1",
      type: "gallery",
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
      type: "gallery",
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
      type: "gallery",
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
      type: "gallery",
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
      type: "gallery",
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
      type: "gallery",
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
      type: "gallery",
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
      type: "gallery",
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
      type: "gallery",
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
      type: "gallery",
      storage_path: "",
      sort_order: 9,
      created_at: "",
      role: null,
      description: null
    }
  ];

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const { data } = await supabase
          .from('photos')
          .select('*')
          .eq('type', 'gallery')
          .order('sort_order');
        
        if (data && data.length > 0) {
          // Filter and validate the data to ensure type compatibility
          const typedData = data
            .filter((photo: PhotoRow) => photo.type === 'gallery')
            .map((photo: PhotoRow): Photo => ({
              ...photo,
              type: 'gallery', // Explicitly cast to the valid union type
              role: photo.role,
              description: photo.description
            }));
          
          setPhotos(typedData);
          setIsLoading(false);
        } else {
          // If no data from Supabase, use local images
          setPhotos(localImages);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching photos:', error);
        // Fallback to local images
        setPhotos(localImages);
        setIsLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  const openPhotoViewer = (photo: Photo) => {
    setSelectedPhoto(photo);
    document.body.style.overflow = 'hidden';
  };

  const closePhotoViewer = () => {
    setSelectedPhoto(null);
    document.body.style.overflow = '';
  };

  if (isLoading) {
    return <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="animate-pulse text-2xl text-gray-500">Loading gallery...</div>
    </div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-white py-24"
    >
      <div className="container max-w-7xl">
        <h1 className="text-4xl md:text-5xl font-serif text-center mb-12">Our Photos</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              onClick={() => openPhotoViewer(photo)}
            >
              <img
                src={photo.url}
                alt={photo.title || ''}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Full-screen photo viewer */}
      {selectedPhoto && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={closePhotoViewer}
        >
          <div className="relative w-full max-w-6xl" onClick={(e) => e.stopPropagation()}>
            <button
              className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white rounded-full p-2"
              onClick={closePhotoViewer}
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
      )}
    </motion.div>
  );
};

export default Photos;
