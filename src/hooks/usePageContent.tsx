
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PageContent {
  id: string;
  page_id: string;
  section_id: string;
  content: string;
  last_updated: string | null;
}

export const usePageContent = (pageId: string, sectionId: string) => {
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("page_content")
          .select("*")
          .eq("page_id", pageId)
          .eq("section_id", sectionId)
          .single();

        if (error && error.code !== "PGRST116") {
          console.error("Error fetching page content:", error);
          toast.error("Failed to load content");
        }

        if (data) {
          setContent(data.content);
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("An error occurred while loading content");
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [pageId, sectionId]);

  const updateContent = async (newContent: string) => {
    setIsSaving(true);
    try {
      const { data: existingContent } = await supabase
        .from("page_content")
        .select("id")
        .eq("page_id", pageId)
        .eq("section_id", sectionId)
        .maybeSingle();

      let error;

      if (existingContent) {
        // Update existing content
        const { error: updateError } = await supabase
          .from("page_content")
          .update({
            content: newContent,
            last_updated: new Date().toISOString(),
          })
          .eq("id", existingContent.id);

        error = updateError;
      } else {
        // Insert new content
        const { error: insertError } = await supabase
          .from("page_content")
          .insert({
            page_id: pageId,
            section_id: sectionId,
            content: newContent,
          });

        error = insertError;
      }

      if (error) {
        throw error;
      }

      setContent(newContent);
      toast.success("Content updated successfully");
    } catch (error: any) {
      console.error("Error updating content:", error);
      toast.error(`Failed to update content: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    content,
    isLoading,
    isSaving,
    updateContent,
  };
};
