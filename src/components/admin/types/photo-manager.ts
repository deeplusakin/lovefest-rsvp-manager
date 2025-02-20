
export interface WeddingPartyPhotoData {
  title: string;
  role: string;
  description: string;
}

export interface PhotoUploadProps {
  type: 'hero' | 'gallery' | 'wedding-party';
  isUploading: boolean;
  onFileSelect: (files: FileList | null, type: 'hero' | 'gallery' | 'wedding-party') => Promise<void>;
}

export interface PhotoGridProps {
  photos: Photo[];
  type: 'hero' | 'gallery' | 'wedding-party';
  onDelete: (photo: Photo) => Promise<void>;
}
