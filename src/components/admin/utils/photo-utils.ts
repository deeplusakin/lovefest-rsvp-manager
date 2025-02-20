
import { supabase } from "@/integrations/supabase/client";
import type { Photo, PhotoRow } from "@/types/photos";
import { toast } from "sonner";
import type { WeddingPartyPhotoData } from "../types/photo-manager";

export const fetchPhotos = async (): Promise<Photo[]> => {
  const { data, error } = await supabase
    .from('photos')
    .select('*')
    .order('sort_order');

  if (error) {
    toast.error("Error fetching photos");
    return [];
  }

  if (data) {
    return data.filter(
      (photo: PhotoRow): photo is Photo => 
        photo.type === 'hero' || photo.type === 'gallery' || photo.type === 'wedding-party'
    );
  }

  return [];
};

export const uploadPhoto = async (
  file: File, 
  type: 'hero' | 'gallery' | 'wedding-party',
  photos: Photo[],
  weddingPartyData?: WeddingPartyPhotoData
) => {
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
      title: type === 'wedding-party' ? weddingPartyData?.title : file.name.split('.')[0],
      role: type === 'wedding-party' ? weddingPartyData?.role : null,
      description: type === 'wedding-party' ? weddingPartyData?.description : null,
      sort_order: photos.filter(p => p.type === type).length
    });

  if (dbError) throw dbError;
};

export const deletePhoto = async (photo: Photo) => {
  const { error: storageError } = await supabase.storage
    .from('photos')
    .remove([photo.storage_path]);

  if (storageError) throw storageError;

  const { error: dbError } = await supabase
    .from('photos')
    .delete()
    .eq('id', photo.id);

  if (dbError) throw dbError;
};
