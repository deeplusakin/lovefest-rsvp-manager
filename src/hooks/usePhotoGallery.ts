
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Photo, PhotoRow } from "@/types/photos";

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
  },
  // New images
  {
    id: "local-11",
    url: "/lovable-uploads/edac78a0-8307-4f36-957e-f7a3d2cb74e7.png",
    title: "Formal Portrait 1",
    type: "gallery",
    storage_path: "",
    sort_order: 10,
    created_at: "",
    role: null,
    description: null
  },
  {
    id: "local-12",
    url: "/lovable-uploads/dc97e51a-018f-4803-a9c3-00071efdeaaa.png",
    title: "Formal Portrait 2",
    type: "gallery",
    storage_path: "",
    sort_order: 11,
    created_at: "",
    role: null,
    description: null
  },
  {
    id: "local-13",
    url: "/lovable-uploads/7fe05aff-f258-470c-b8b0-ac62681f49af.png",
    title: "Formal Portrait 3",
    type: "gallery",
    storage_path: "",
    sort_order: 12,
    created_at: "",
    role: null,
    description: null
  },
  {
    id: "local-14",
    url: "/lovable-uploads/9e2a3a6f-60e0-46e9-9393-9bdf329259dd.png",
    title: "Formal Portrait 4", 
    type: "gallery",
    storage_path: "",
    sort_order: 13,
    created_at: "",
    role: null,
    description: null
  },
  {
    id: "local-15",
    url: "/lovable-uploads/63f0fbaf-cbf4-4231-8c63-ede929a1ecb2.png",
    title: "Formal Portrait 5",
    type: "gallery",
    storage_path: "",
    sort_order: 14,
    created_at: "",
    role: null,
    description: null
  }
];

export const usePhotoGallery = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  return {
    photos,
    isLoading
  };
};
