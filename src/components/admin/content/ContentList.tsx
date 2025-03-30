
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageContent } from "@/hooks/useContentManagement";
import { toast } from "sonner";

interface ContentListProps {
  pages: string[];
  currentPage: string;
  pageContents: PageContent[];
  activeContentId: string | null;
  onPageChange: (page: string) => void;
  onContentSelect: (content: PageContent) => void;
  onCreateContent: (pageId: string, sectionId: string) => Promise<void>;
}

export const ContentList = ({
  pages,
  currentPage,
  pageContents,
  activeContentId,
  onPageChange,
  onContentSelect,
  onCreateContent
}: ContentListProps) => {
  // If pages don't include q-and-a and travel, we'll add them here
  const availablePages = [...new Set([...pages, 'q-and-a', 'travel'])];
  
  return (
    <div className="space-y-4">
      <div className="mb-4">
        <Label htmlFor="page-select">Select Page</Label>
        <select
          id="page-select"
          value={currentPage}
          onChange={(e) => onPageChange(e.target.value)}
          className="w-full p-2 border rounded mt-1"
        >
          {availablePages.map(page => (
            <option key={page} value={page}>
              {page.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </option>
          ))}
        </select>
      </div>
      
      <div className="space-y-2">
        <h3 className="font-medium">Content Sections</h3>
        {pageContents.length > 0 ? (
          <div className="space-y-1">
            {pageContents.map(content => (
              <Button
                key={content.id}
                variant={activeContentId === content.id ? "default" : "outline"}
                className="w-full justify-start text-left"
                onClick={() => onContentSelect(content)}
              >
                {content.section_id}
              </Button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground py-2">
            No content found for this page
          </p>
        )}
      </div>
      
      <div className="pt-4">
        <h3 className="font-medium mb-2">Add New Section</h3>
        <div className="space-y-2">
          <Input 
            id="new-section-id"
            placeholder="Section ID"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                const input = e.target as HTMLInputElement;
                if (input.value) {
                  onCreateContent(currentPage, input.value);
                  input.value = '';
                } else {
                  toast.error("Section ID is required");
                }
              }
            }}
          />
          <Button 
            className="w-full"
            onClick={() => {
              const input = document.getElementById('new-section-id') as HTMLInputElement;
              if (input.value) {
                onCreateContent(currentPage, input.value);
                input.value = '';
              } else {
                toast.error("Section ID is required");
              }
            }}
          >
            Add Section
          </Button>
        </div>
      </div>
    </div>
  );
};
