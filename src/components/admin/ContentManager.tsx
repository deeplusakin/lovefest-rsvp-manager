
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import { useContentManagement } from "@/hooks/useContentManagement";
import { ContentList } from "./content/ContentList";
import { ContentEditor } from "./content/ContentEditor";

export const ContentManager = () => {
  const {
    pages,
    pageContents,
    isLoading,
    isSaving,
    activeContent,
    editedContent,
    currentPage,
    setCurrentPage,
    setEditedContent,
    fetchContent,
    handleSelectContent,
    handleSaveContent,
    handleCreateContent
  } = useContentManagement();

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif">Content Management</h2>
        <Button 
          variant="outline" 
          onClick={fetchContent} 
          disabled={isLoading}
          className="gap-1"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid md:grid-cols-[250px_1fr] gap-6">
          <ContentList
            pages={pages}
            currentPage={currentPage}
            pageContents={pageContents}
            activeContentId={activeContent?.id || null}
            onPageChange={setCurrentPage}
            onContentSelect={handleSelectContent}
            onCreateContent={handleCreateContent}
          />
          
          <ContentEditor
            activeContent={activeContent}
            editedContent={editedContent}
            isSaving={isSaving}
            onContentChange={setEditedContent}
            onSave={handleSaveContent}
          />
        </div>
      )}
    </Card>
  );
};
