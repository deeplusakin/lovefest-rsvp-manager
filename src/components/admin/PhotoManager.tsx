
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Photo, PhotoRow } from "@/types/photos";
import { ImageCropper } from "./ImageCropper";

interface CropState {
  file: File;
  preview: string;
  type: 'hero' | 'gallery';
}

export const PhotoManager = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [cropState, setCropState] = useState<CropState | null>(null);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    const { data, error } = await supabase
      .from('photos')
      .select('*')
      .order('sort_order');

    if (error) {
      toast.error("Error fetching photos");
      return;
    }

    if (data) {
      const typedData = data.filter(
        (photo: PhotoRow): photo is Photo => 
          photo.type === 'hero' || photo.type === 'gallery'
      );
      setPhotos(typedData);
    }
  };

  const handleFileSelect = (files: FileList | null, type: 'hero' | 'gallery') => {
    if (!files || files.length === 0) return;

    const file = files[0];
    const preview = URL.createObjectURL(file);
    setCropState({ file, preview, type });
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    if (!cropState) return;
    
    const { type, file } = cropState;
    const croppedFile = new File([croppedBlob], file.name, { type: file.type });
    await handleUpload(croppedFile, type);
    setCropState(null);
  };

  const handleUpload = async (file: File, type: 'hero' | 'gallery') => {
    setIsUploading(true);

    try {
      // Upload to storage
      const fileExt = file.name.split('.').pop();
      const filePath = `${type}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('photos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('photos')
        .getPublicUrl(filePath);

      // Save to database
      const { error: dbError } = await supabase
        .from('photos')
        .insert({
          url: publicUrl,
          type,
          storage_path: filePath,
          title: file.name.split('.')[0],
          sort_order: photos.filter(p => p.type === type).length
        });

      if (dbError) throw dbError;

      toast.success("Photo uploaded successfully");
      fetchPhotos();
    } catch (error: any) {
      toast.error("Error uploading photo: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (photo: Photo) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('photos')
        .remove([photo.storage_path]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('photos')
        .delete()
        .eq('id', photo.id);

      if (dbError) throw dbError;

      toast.success("Photo deleted successfully");
      fetchPhotos();
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
        </TabsList>

        <TabsContent value="hero" className="space-y-6">
          <div className="flex items-center gap-4">
            <Input
              type="file"
              accept="image/*"
              disabled={isUploading}
              onChange={(e) => handleFileSelect(e.target.files, 'hero')}
              className="max-w-sm"
            />
            {isUploading && <span>Uploading...</span>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {photos
              .filter(photo => photo.type === 'hero')
              .map(photo => (
                <div key={photo.id} className="relative group">
                  <img
                    src={photo.url}
                    alt={photo.title || ''}
                    className="w-full aspect-video object-cover rounded-md"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDelete(photo)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="gallery" className="space-y-6">
          <div className="flex items-center gap-4">
            <Input
              type="file"
              accept="image/*"
              disabled={isUploading}
              onChange={(e) => handleFileSelect(e.target.files, 'gallery')}
              className="max-w-sm"
            />
            {isUploading && <span>Uploading...</span>}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos
              .filter(photo => photo.type === 'gallery')
              .map(photo => (
                <div key={photo.id} className="relative group">
                  <img
                    src={photo.url}
                    alt={photo.title || ''}
                    className="w-full aspect-square object-cover rounded-md"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDelete(photo)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {cropState && (
        <ImageCropper
          imageUrl={cropState.preview}
          aspectRatio={cropState.type === 'hero' ? 16 / 9 : 1}
          onCropComplete={handleCropComplete}
          onCancel={() => setCropState(null)}
          open={true}
        />
      )}
    </Card>
  );
};
