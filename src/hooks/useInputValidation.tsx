
import { useMemo } from "react";

export const useInputValidation = () => {
  const sanitizeText = (input: string, maxLength: number = 255): string => {
    if (!input || typeof input !== 'string') return '';
    
    return input
      .trim()
      .slice(0, maxLength)
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocols
      .replace(/on\w+\s*=/gi, ''); // Remove event handlers
  };

  const sanitizeEmail = (email: string): string => {
    if (!email || typeof email !== 'string') return '';
    
    return email
      .trim()
      .toLowerCase()
      .slice(0, 254) // Max email length
      .replace(/[<>]/g, '');
  };

  const sanitizePhone = (phone: string): string => {
    if (!phone || typeof phone !== 'string') return '';
    
    return phone
      .trim()
      .replace(/[^\d\-\+\(\)\s]/g, '') // Only allow digits, dashes, plus, parentheses, spaces
      .slice(0, 20);
  };

  const validateFileUpload = (file: File, allowedTypes: string[], maxSizeMB: number = 10): { valid: boolean; error?: string } => {
    if (!file) {
      return { valid: false, error: "No file selected" };
    }

    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return { valid: false, error: `File size must be less than ${maxSizeMB}MB` };
    }

    // Check file type
    const fileType = file.type.toLowerCase();
    const fileName = file.name.toLowerCase();
    
    const isValidType = allowedTypes.some(type => 
      fileType.includes(type) || fileName.endsWith(`.${type}`)
    );

    if (!isValidType) {
      return { valid: false, error: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}` };
    }

    // Check for suspicious file names
    const suspiciousPatterns = ['.exe', '.bat', '.cmd', '.scr', '.vbs', '.js'];
    if (suspiciousPatterns.some(pattern => fileName.includes(pattern))) {
      return { valid: false, error: "File type not allowed for security reasons" };
    }

    return { valid: true };
  };

  const validateCSVContent = (content: string): { valid: boolean; error?: string } => {
    if (!content || content.length === 0) {
      return { valid: false, error: "CSV file is empty" };
    }

    // Check file size (max 1MB for CSV)
    if (content.length > 1024 * 1024) {
      return { valid: false, error: "CSV file is too large (max 1MB)" };
    }

    // Basic CSV structure validation
    const lines = content.split('\n');
    if (lines.length < 2) {
      return { valid: false, error: "CSV must have at least a header and one data row" };
    }

    // Check for suspicious content
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /onclick=/i,
      /onerror=/i,
      /<iframe/i
    ];

    if (suspiciousPatterns.some(pattern => pattern.test(content))) {
      return { valid: false, error: "CSV contains potentially dangerous content" };
    }

    return { valid: true };
  };

  return {
    sanitizeText,
    sanitizeEmail,
    sanitizePhone,
    validateFileUpload,
    validateCSVContent
  };
};
