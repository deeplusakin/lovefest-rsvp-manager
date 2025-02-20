
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Photo, PhotoRow } from "@/types/photos";
import { Textarea } from "../ui/textarea";

interface WeddingPartyPhotoData {
  title: string;
  role: string;
  description: string;
}

export const PhotoManager = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [weddingPartyData, setWeddingPartyData] = useState<WeddingPartyPhotoData>({
    title: '',
    role: '',
    description: ''
  });

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
          photo.type === 'hero' || photo.type === 'gallery' || photo.type === 'wedding-party'
      );
      setPhotos(typedData);
    }
  };

  const handleFileSelect = async (files: FileList | null, type: 'hero' | 'gallery' | 'wedding-party') => {
    if (!files || files.length === 0) return;
    const file = files[0];
    await handleUpload(file, type);
  };

  const handleUpload = async (file: File, type: 'hero' | 'gallery' | 'wedding-party') => {
    setIsUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${type}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('photos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('photos')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from('photos')
        .insert({
          url: publicUrl,
          type,
          storage_path: filePath,
          title: type === 'wedding-party' ? weddingPartyData.title : file.name.split('.')[0],
          role: type === 'wedding-party' ? weddingPartyData.role : null,
          description: type === 'wedding-party' ? weddingPartyData.description : null,
          sort_order: photos.filter(p => p.type === type).length
        });

      if (dbError) throw dbError;

      toast.success("Photo uploaded successfully");
      fetchPhotos();
      
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
      const { error: storageError } = await supabase.storage
        .from('photos')
        .remove([photo.storage_path]);

      if (storageError) throw storageError;

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
          <TabsTrigger value="wedding-party">Wedding Party</TabsTrigger>
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

        <TabsContent value="wedding-party" className="space-y-6">
          <div className="grid gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={weddingPartyData.title}
                  onChange={(e) => setWeddingPartyData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter name"
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  value={weddingPartyData.role}
                  onChange={(e) => setWeddingPartyData(prev => ({ ...prev, role: e.target.value }))}
                  placeholder="e.g., Maid of Honor, Best Man"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={weddingPartyData.description}
                  onChange={(e) => setWeddingPartyData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Tell us about this person"
                />
              </div>
              <div>
                <Label htmlFor="photo">Photo</Label>
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  disabled={isUploading}
                  onChange={(e) => handleFileSelect(e.target.files, 'wedding-party')}
                  className="max-w-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {photos
                .filter(photo => photo.type === 'wedding-party')
                .map(photo => (
                  <div key={photo.id} className="relative group bg-gray-50 rounded-lg p-4">
                    <img
                      src={photo.url}
                      alt={photo.title || ''}
                      className="w-full aspect-[3/4] object-cover rounded-md mb-4"
                    />
                    <h3 className="font-semibold text-lg">{photo.title}</h3>
                    <p className="text-accent">{photo.role}</p>
                    <p className="text-gray-600 text-sm mt-2">{photo.description}</p>
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
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};
