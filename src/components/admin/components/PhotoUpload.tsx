
import { useState } from "react";
import { Input } from "@/components/ui/input";
import type { PhotoUploadProps } from "../types/photo-manager";
import { PhotoEditor } from "./PhotoEditor";

export const PhotoUpload = ({ type, isUploading, onFileSelect }: PhotoUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  const handleFileChange = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setSelectedFile(files[0]);
    setShowEditor(true);
  };

  const handleEditComplete = async (editedFile: File) => {
    setShowEditor(false);
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(editedFile);
    await onFileSelect(dataTransfer.files, type);
    setSelectedFile(null);
  };

  const handleEditCancel = () => {
    setShowEditor(false);
    setSelectedFile(null);
  };

  return (
    <>
      <div className="flex items-center gap-4">
        <Input
          type="file"
          accept="image/*"
          disabled={isUploading}
          onChange={(e) => handleFileChange(e.target.files)}
          className="max-w-sm"
        />
        {isUploading && <span>Uploading...</span>}
      </div>

      {selectedFile && (
        <PhotoEditor
          file={selectedFile}
          onComplete={handleEditComplete}
          onCancel={handleEditCancel}
          open={showEditor}
        />
      )}
    </>
  );
};
