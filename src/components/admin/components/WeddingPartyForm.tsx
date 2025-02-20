
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { WeddingPartyPhotoData } from "../types/photo-manager";

interface WeddingPartyFormProps {
  data: WeddingPartyPhotoData;
  onChange: (data: WeddingPartyPhotoData) => void;
  isUploading: boolean;
  onFileSelect: (files: FileList | null, type: 'wedding-party') => Promise<void>;
}

export const WeddingPartyForm = ({ 
  data, 
  onChange, 
  isUploading, 
  onFileSelect 
}: WeddingPartyFormProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={data.title}
          onChange={(e) => onChange({ ...data, title: e.target.value })}
          placeholder="Enter name"
        />
      </div>
      <div>
        <Label htmlFor="role">Role</Label>
        <Input
          id="role"
          value={data.role}
          onChange={(e) => onChange({ ...data, role: e.target.value })}
          placeholder="e.g., Maid of Honor, Best Man"
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={data.description}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
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
          onChange={(e) => onFileSelect(e.target.files, 'wedding-party')}
          className="max-w-sm"
        />
      </div>
    </div>
  );
};
