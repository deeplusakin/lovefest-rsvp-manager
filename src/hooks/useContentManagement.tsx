
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface PageContent {
  id: string;
  page_id: string;
  section_id: string;
  content: string;
  last_updated: string | null;
}

export const useContentManagement = () => {
  const [contents, setContents] = useState<PageContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeContent, setActiveContent] = useState<PageContent | null>(null);
  const [editedContent, setEditedContent] = useState("");
  const [currentPage, setCurrentPage] = useState("our-story");
  // Initialize with common pages, including q-and-a and travel
  const [pages, setPages] = useState<string[]>(["our-story", "q-and-a", "travel"]);

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
        
        // Extract unique page_ids and ensure q-and-a and travel are included
        const uniquePages = Array.from(new Set([
          ...data.map(item => item.page_id),
          'q-and-a',
          'travel'
        ]));
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

  useEffect(() => {
    fetchContent();
  }, []);

  return {
    contents,
    pageContents,
    pages,
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
  };
};
