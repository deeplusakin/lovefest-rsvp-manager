
import { useState, useRef } from 'react';
import ReactCrop, { type Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface PhotoEditorProps {
  file: File;
  onComplete: (croppedFile: File) => void;
  onCancel: () => void;
  open: boolean;
}

export const PhotoEditor = ({ file, onComplete, onCancel, open }: PhotoEditorProps) => {
  const [crop, setCrop] = useState<Crop>();
  const [imageSrc, setImageSrc] = useState<string>('');
  const imageRef = useRef<HTMLImageElement>(null);

  // Load image when file changes
  useState(() => {
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  });

  const handleCropComplete = async () => {
    if (!imageRef.current || !crop) {
      toast.error("Please make a crop selection first");
      return;
    }

    const canvas = document.createElement('canvas');
    const scaleX = imageRef.current.naturalWidth / imageRef.current.width;
    const scaleY = imageRef.current.naturalHeight / imageRef.current.height;
    
    canvas.width = crop.width;
    canvas.height = crop.height;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      toast.error("Could not initialize canvas context");
      return;
    }

    ctx.drawImage(
      imageRef.current,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    // Convert canvas to blob
    canvas.toBlob((blob) => {
      if (!blob) {
        toast.error("Could not process the image");
        return;
      }
      
      // Create new file from blob
      const croppedFile = new File([blob], file.name, {
        type: file.type,
        lastModified: Date.now(),
      });

      onComplete(croppedFile);
    }, file.type);
  };

  return (
    <Dialog open={open} onOpenChange={() => onCancel()}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Edit Photo</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="max-h-[60vh] overflow-auto">
            <ReactCrop
              crop={crop}
              onChange={c => setCrop(c)}
              aspect={undefined}
            >
              <img
                ref={imageRef}
                src={imageSrc}
                alt="Upload preview"
                className="max-w-full"
              />
            </ReactCrop>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={handleCropComplete}>
              Apply Crop
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
