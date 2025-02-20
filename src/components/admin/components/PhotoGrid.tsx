
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import type { PhotoGridProps } from "../types/photo-manager";

export const PhotoGrid = ({ photos, type, onDelete }: PhotoGridProps) => {
  const gridClassNames = {
    hero: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    gallery: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
    'wedding-party': "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
  };

  const aspectClassNames = {
    hero: "aspect-video",
    gallery: "aspect-square",
    'wedding-party': "aspect-[3/4]"
  };

  const filteredPhotos = photos.filter(photo => photo.type === type);

  if (type === 'wedding-party') {
    return (
      <div className={`grid ${gridClassNames[type]} gap-4`}>
        {filteredPhotos.map(photo => (
          <div key={photo.id} className="relative group bg-gray-50 rounded-lg p-4">
            <img
              src={photo.url}
              alt={photo.title || ''}
              className={`w-full ${aspectClassNames[type]} object-cover rounded-md mb-4`}
            />
            <h3 className="font-semibold text-lg">{photo.title}</h3>
            <p className="text-accent">{photo.role}</p>
            <p className="text-gray-600 text-sm mt-2">{photo.description}</p>
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onDelete(photo)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`grid ${gridClassNames[type]} gap-4`}>
      {filteredPhotos.map(photo => (
        <div key={photo.id} className="relative group">
          <img
            src={photo.url}
            alt={photo.title || ''}
            className={`w-full ${aspectClassNames[type]} object-cover rounded-md`}
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onDelete(photo)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};
