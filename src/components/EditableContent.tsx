
import { useState } from "react";
import { usePageContent } from "@/hooks/usePageContent";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Loader2, Edit, Check, X } from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { motion } from "framer-motion";

interface EditableContentProps {
  pageId: string;
  sectionId: string;
  className?: string;
  renderMarkdown?: boolean;
}

export const EditableContent: React.FC<EditableContentProps> = ({
  pageId,
  sectionId,
  className = "",
  renderMarkdown = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableContent, setEditableContent] = useState("");
  const { content, isLoading, isSaving, updateContent } = usePageContent(pageId, sectionId);
  const [isAdmin, setIsAdmin] = useState(false);

  // Use the admin auth hook to check if the user is an admin
  useAdminAuth(() => {
    setIsAdmin(true);
  });

  const startEditing = () => {
    setEditableContent(content);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
  };

  const saveContent = async () => {
    await updateContent(editableContent);
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  // Display mode - show content without edit buttons on frontend
  if (!isEditing) {
    return (
      <div className={`${className}`}>
        {renderMarkdown ? (
          <div className="prose prose-lg max-w-none">
            {content.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        ) : (
          <div>{content}</div>
        )}
      </div>
    );
  }

  // Edit mode - show textarea with save/cancel buttons
  return (
    <Card className="p-4">
      <Textarea
        value={editableContent}
        onChange={(e) => setEditableContent(e.target.value)}
        className="min-h-[200px] mb-4"
      />
      <div className="flex justify-end gap-2">
        <Button
          onClick={cancelEditing}
          variant="outline"
          size="sm"
          disabled={isSaving}
        >
          <X className="h-4 w-4 mr-1" />
          Cancel
        </Button>
        <Button
          onClick={saveContent}
          size="sm"
          disabled={isSaving}
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin mr-1" />
          ) : (
            <Check className="h-4 w-4 mr-1" />
          )}
          Save
        </Button>
      </div>
    </Card>
  );
};
