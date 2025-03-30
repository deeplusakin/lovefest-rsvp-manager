
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Save, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PageContent {
  id: string;
  page_id: string;
  section_id: string;
  content: string;
  last_updated: string | null;
}

export const ContentManager = () => {
  const [contents, setContents] = useState<PageContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeContent, setActiveContent] = useState<PageContent | null>(null);
  const [editedContent, setEditedContent] = useState("");
  const [currentPage, setCurrentPage] = useState("our-story");
  const [pages, setPages] = useState<string[]>([]);

  const fetchContent = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("page_content")
        .select("*")
        .order("page_id")
        .order("section_id");

      if (error) throw error;

      if (data) {
        setContents(data);
        
        // Extract unique page_ids
        const uniquePages = Array.from(new Set(data.map(item => item.page_id)));
        setPages(uniquePages);
        
        if (uniquePages.length > 0 && !uniquePages.includes(currentPage)) {
          setCurrentPage(uniquePages[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching content:", error);
      toast.error("Failed to load content");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleSelectContent = (content: PageContent) => {
    setActiveContent(content);
    setEditedContent(content.content);
  };

  const handleSaveContent = async () => {
    if (!activeContent) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("page_content")
        .update({
          content: editedContent,
          last_updated: new Date().toISOString(),
        })
        .eq("id", activeContent.id);

      if (error) throw error;

      // Update the local state
      setContents(prevContents => 
        prevContents.map(content => 
          content.id === activeContent.id 
            ? { ...content, content: editedContent } 
            : content
        )
      );
      
      setActiveContent(prev => prev ? {...prev, content: editedContent} : null);
      toast.success("Content updated successfully");
    } catch (error) {
      console.error("Error updating content:", error);
      toast.error("Failed to update content");
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleCreateContent = async (pageId: string, sectionId: string, initialContent: string = '') => {
    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from("page_content")
        .insert({
          page_id: pageId,
          section_id: sectionId,
          content: initialContent,
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setContents(prev => [...prev, data]);
        setActiveContent(data);
        setEditedContent(data.content);
        toast.success("New content section created");
      }
    } catch (error) {
      console.error("Error creating content:", error);
      toast.error("Failed to create content section");
    } finally {
      setIsSaving(false);
      fetchContent(); // Refresh the content list
    }
  };

  const pageContents = contents.filter(c => c.page_id === currentPage);

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
          <div className="space-y-4">
            <div className="mb-4">
              <Label htmlFor="page-select">Select Page</Label>
              <select
                id="page-select"
                value={currentPage}
                onChange={(e) => setCurrentPage(e.target.value)}
                className="w-full p-2 border rounded mt-1"
              >
                {pages.map(page => (
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
                      variant={activeContent?.id === content.id ? "default" : "outline"}
                      className="w-full justify-start text-left"
                      onClick={() => handleSelectContent(content)}
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
                      handleCreateContent(currentPage, input.value);
                      input.value = '';
                    }
                  }}
                />
                <Button 
                  className="w-full"
                  onClick={() => {
                    const input = document.getElementById('new-section-id') as HTMLInputElement;
                    if (input.value) {
                      handleCreateContent(currentPage, input.value);
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
          
          <div>
            {activeContent ? (
              <div className="space-y-4">
                <div className="flex justify-between">
                  <h3 className="text-lg font-medium">
                    Editing: {activeContent.page_id} / {activeContent.section_id}
                  </h3>
                  <Button
                    onClick={handleSaveContent}
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
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="min-h-[400px] font-mono text-sm"
                />
                
                <div className="text-sm text-muted-foreground">
                  Last updated: {activeContent.last_updated 
                    ? new Date(activeContent.last_updated).toLocaleString() 
                    : 'Never'}
                </div>
              </div>
            ) : (
              <div className="flex justify-center items-center h-[400px] bg-muted/20 rounded-lg">
                <p className="text-muted-foreground">
                  Select a content section to edit or create a new one
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};
