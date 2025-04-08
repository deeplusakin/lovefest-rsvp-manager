
import { GuestData } from "../types/csv-types";

export const validateHeaders = (headers: string[]): { isValid: boolean; error: string | null } => {
  const requiredHeaders = ['first_name', 'last_name'];
  const validHeaders = ['first_name', 'last_name', 'email', 'dietary_restrictions'];
  
  // Check if all required headers are present
  if (!requiredHeaders.every(h => headers.includes(h))) {
    return {
      isValid: false,
      error: "CSV must include first_name and last_name columns"
    };
  }
  
  // Check if all headers are valid
  if (!headers.every(h => validHeaders.includes(h))) {
    return {
      isValid: false,
      error: `Invalid columns found. Valid columns are: ${validHeaders.join(', ')}`
    };
  }
  
  return { isValid: true, error: null };
};

export const parseCSV = (csvText: string): { guests: GuestData[]; error: string | null } => {
  try {
    const rows = csvText.split('\n').map(row => row.split(','));
    const headers = rows[0].map(header => header.trim().toLowerCase());
    
    const validation = validateHeaders(headers);
    if (!validation.isValid) {
      return { guests: [], error: validation.error };
    }

    const guests = rows.slice(1)
      .filter(row => row.length === headers.length && row.some(cell => cell.trim()))
      .map(row => {
        // Create the guest object with the required properties explicitly typed
        const guest: GuestData = {
          first_name: '',
          last_name: ''
        };
        
        headers.forEach((header, index) => {
          if (header === 'first_name' || header === 'last_name') {
            guest[header] = row[index].trim();
          } else if (header === 'email' || header === 'dietary_restrictions') {
            guest[header as keyof GuestData] = row[index].trim() || undefined;
          }
        });
        
        return guest;
      });

    if (guests.length === 0) {
      return { 
        guests: [], 
        error: "No valid guest data found in CSV" 
      };
    }

    return { guests, error: null };
  } catch (error: any) {
    console.error("Error parsing CSV file:", error);
    return { 
      guests: [], 
      error: `Error parsing CSV file: ${error.message}` 
    };
  }
};

export const generateInvitationCode = (): string => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};
