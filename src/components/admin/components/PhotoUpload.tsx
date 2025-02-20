
import { Input } from "@/components/ui/input";
import type { PhotoUploadProps } from "../types/photo-manager";

export const PhotoUpload = ({ type, isUploading, onFileSelect }: PhotoUploadProps) => {
  return (
    <div className="flex items-center gap-4">
      <Input
        type="file"
        accept="image/*"
        disabled={isUploading}
        onChange={(e) => onFileSelect(e.target.files, type)}
        className="max-w-sm"
      />
      {isUploading && <span>Uploading...</span>}
    </div>
  );
};
