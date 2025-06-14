
import { useInputValidation } from "./useInputValidation";
import { useSecurityLogger } from "./useSecurityLogger";
import { toast } from "sonner";

export const useSecureFileUpload = () => {
  const { validateFileUpload, validateCSVContent } = useInputValidation();
  const { logSecurityEvent } = useSecurityLogger();

  const validateImageUpload = async (file: File): Promise<boolean> => {
    const validation = validateFileUpload(file, ['jpeg', 'jpg', 'png', 'webp'], 10);
    
    if (!validation.valid) {
      toast.error(validation.error);
      await logSecurityEvent('file_upload', {
        status: 'rejected',
        filename: file.name,
        size: file.size,
        type: file.type,
        reason: validation.error
      });
      return false;
    }

    await logSecurityEvent('file_upload', {
      status: 'accepted',
      filename: file.name,
      size: file.size,
      type: file.type
    });
    
    return true;
  };

  const validateCSVUpload = async (file: File): Promise<{ valid: boolean; content?: string }> => {
    // First validate the file itself
    const fileValidation = validateFileUpload(file, ['csv'], 1);
    
    if (!fileValidation.valid) {
      toast.error(fileValidation.error);
      await logSecurityEvent('file_upload', {
        status: 'rejected',
        filename: file.name,
        size: file.size,
        type: file.type,
        reason: fileValidation.error
      });
      return { valid: false };
    }

    try {
      // Read and validate file content
      const content = await file.text();
      const contentValidation = validateCSVContent(content);
      
      if (!contentValidation.valid) {
        toast.error(contentValidation.error);
        await logSecurityEvent('file_upload', {
          status: 'rejected',
          filename: file.name,
          size: file.size,
          type: file.type,
          reason: contentValidation.error
        });
        return { valid: false };
      }

      await logSecurityEvent('file_upload', {
        status: 'accepted',
        filename: file.name,
        size: file.size,
        type: file.type,
        rows: content.split('\n').length
      });
      
      return { valid: true, content };
    } catch (error) {
      toast.error("Error reading file content");
      return { valid: false };
    }
  };

  return {
    validateImageUpload,
    validateCSVUpload
  };
};
