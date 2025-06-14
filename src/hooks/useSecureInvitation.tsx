
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface InvitationAttempt {
  ip: string;
  timestamp: number;
  attempts: number;
}

const MAX_INVITATION_ATTEMPTS = 10;
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute

export const useSecureInvitation = () => {
  const [invitationAttempts, setInvitationAttempts] = useState<Map<string, InvitationAttempt>>(new Map());

  const isRateLimited = (): boolean => {
    const ip = 'client'; // In a real app, you'd get the actual IP
    const attempt = invitationAttempts.get(ip);
    if (!attempt) return false;
    
    const timeSinceFirstAttempt = Date.now() - attempt.timestamp;
    if (timeSinceFirstAttempt > RATE_LIMIT_WINDOW) {
      // Reset attempts after rate limit window
      invitationAttempts.delete(ip);
      setInvitationAttempts(new Map(invitationAttempts));
      return false;
    }
    
    return attempt.attempts >= MAX_INVITATION_ATTEMPTS;
  };

  const recordInvitationAttempt = () => {
    const ip = 'client';
    const now = Date.now();
    const current = invitationAttempts.get(ip);
    
    if (current && now - current.timestamp < RATE_LIMIT_WINDOW) {
      current.attempts += 1;
    } else {
      invitationAttempts.set(ip, { ip, timestamp: now, attempts: 1 });
    }
    
    setInvitationAttempts(new Map(invitationAttempts));
  };

  const validateInvitationCode = async (code: string): Promise<string | null> => {
    if (isRateLimited()) {
      toast.error("Too many attempts. Please try again in a minute.");
      return null;
    }

    recordInvitationAttempt();

    // Sanitize input
    const sanitizedCode = code.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    
    if (sanitizedCode.length < 6 || sanitizedCode.length > 8) {
      toast.error("Invalid invitation code format");
      return null;
    }

    try {
      const { data, error } = await supabase.rpc('validate_invitation_code', {
        code: sanitizedCode
      });

      if (error || !data) {
        console.warn(`Invalid invitation code attempt: ${sanitizedCode} at ${new Date().toISOString()}`);
        toast.error("Invalid invitation code");
        return null;
      }

      console.info(`Valid invitation code used: ${sanitizedCode} at ${new Date().toISOString()}`);
      toast.success("Welcome! You can now RSVP for your household.");
      return data;
    } catch (error) {
      console.error('Invitation validation error:', error);
      toast.error("Error validating invitation code");
      return null;
    }
  };

  return { validateInvitationCode };
};
