
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import type { Photo } from "@/types/photos";
import type { WeddingPartyPhotoData } from "./types/photo-manager";
import { PhotoUpload } from "./components/PhotoUpload";
import { PhotoGrid } from "./components/PhotoGrid";
import { WeddingPartyForm } from "./components/WeddingPartyForm";
import { fetchPhotos, uploadPhoto, deletePhoto } from "./utils/photo-utils";

export const PhotoManager = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [weddingPartyData, setWeddingPartyData] = useState<WeddingPartyPhotoData>({
    title: '',
    role: '',
    description: ''
  });

  useEffect(() => {
    const loadPhotos = async () => {
      const fetchedPhotos = await fetchPhotos();
      setPhotos(fetchedPhotos);
    };
    loadPhotos();
  }, []);

  const handleFileSelect = async (files: FileList | null, type: 'hero' | 'gallery' | 'wedding-party') => {
    if (!files || files.length === 0) return;
    const file = files[0];
    setIsUploading(true);

    try {
      await uploadPhoto(
        file, 
        type, 
        photos, 
        type === 'wedding-party' ? weddingPartyData : undefined
      );

      toast.success("Photo uploaded successfully");
      const updatedPhotos = await fetchPhotos();
      setPhotos(updatedPhotos);
      
      if (type === 'wedding-party') {
        setWeddingPartyData({
          title: '',
          role: '',
          description: ''
        });
      }
    } catch (error: any) {
      toast.error("Error uploading photo: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (photo: Photo) => {
    try {
      await deletePhoto(photo);
      toast.success("Photo deleted successfully");
      const updatedPhotos = await fetchPhotos();
      setPhotos(updatedPhotos);
    } catch (error: any) {
      toast.error("Error deleting photo: " + error.message);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-serif mb-6">Manage Photos</h2>
      
      <Tabs defaultValue="hero" className="space-y-6">
        <TabsList>
          <TabsTrigger value="hero">Hero Images</TabsTrigger>
          <TabsTrigger value="gallery">Photo Gallery</TabsTrigger>
          <TabsTrigger value="wedding-party">Wedding Party</TabsTrigger>
        </TabsList>

        <TabsContent value="hero" className="space-y-6">
          <PhotoUpload 
            type="hero"
            isUploading={isUploading}
            onFileSelect={handleFileSelect}
          />
          <PhotoGrid
            photos={photos}
            type="hero"
            onDelete={handleDelete}
          />
        </TabsContent>

        <TabsContent value="gallery" className="space-y-6">
          <PhotoUpload 
            type="gallery"
            isUploading={isUploading}
            onFileSelect={handleFileSelect}
          />
          <PhotoGrid
            photos={photos}
            type="gallery"
            onDelete={handleDelete}
          />
        </TabsContent>

        <TabsContent value="wedding-party" className="space-y-6">
          <div className="grid gap-6">
            <WeddingPartyForm
              data={weddingPartyData}
              onChange={setWeddingPartyData}
              isUploading={isUploading}
              onFileSelect={handleFileSelect}
            />
            <PhotoGrid
              photos={photos}
              type="wedding-party"
              onDelete={handleDelete}
            />
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};
