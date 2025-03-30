
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save } from "lucide-react";
import { PageContent } from "@/hooks/useContentManagement";

interface ContentEditorProps {
  activeContent: PageContent | null;
  editedContent: string;
  isSaving: boolean;
  onContentChange: (content: string) => void;
  onSave: () => Promise<void>;
}

export const ContentEditor = ({
  activeContent,
  editedContent,
  isSaving,
  onContentChange,
  onSave
}: ContentEditorProps) => {
  if (!activeContent) {
    return (
      <div className="flex justify-center items-center h-[400px] bg-muted/20 rounded-lg">
        <p className="text-muted-foreground">
          Select a content section to edit or create a new one
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h3 className="text-lg font-medium">
          Editing: {activeContent.page_id} / {activeContent.section_id}
        </h3>
        <Button
          onClick={onSave}
          disabled={isSaving}
          className="gap-1"
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save Changes
        </Button>
      </div>
      
      <Textarea
        value={editedContent}
        onChange={(e) => onContentChange(e.target.value)}
        className="min-h-[400px] font-mono text-sm"
      />
      
      <div className="text-sm text-muted-foreground">
        Last updated: {activeContent.last_updated 
          ? new Date(activeContent.last_updated).toLocaleString() 
          : 'Never'}
      </div>
    </div>
  );
};
