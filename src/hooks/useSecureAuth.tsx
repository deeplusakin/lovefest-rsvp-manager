
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface LoginAttempt {
  email: string;
  timestamp: number;
  attempts: number;
}

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

export const useSecureAuth = () => {
  const [loginAttempts, setLoginAttempts] = useState<Map<string, LoginAttempt>>(new Map());

  const isAccountLocked = (email: string): boolean => {
    const attempt = loginAttempts.get(email);
    if (!attempt) return false;
    
    const timeSinceLastAttempt = Date.now() - attempt.timestamp;
    if (timeSinceLastAttempt > LOCKOUT_DURATION) {
      // Reset attempts after lockout period
      loginAttempts.delete(email);
      setLoginAttempts(new Map(loginAttempts));
      return false;
    }
    
    return attempt.attempts >= MAX_LOGIN_ATTEMPTS;
  };

  const recordFailedAttempt = (email: string) => {
    const now = Date.now();
    const current = loginAttempts.get(email);
    
    if (current && now - current.timestamp < LOCKOUT_DURATION) {
      current.attempts += 1;
      current.timestamp = now;
    } else {
      loginAttempts.set(email, { email, timestamp: now, attempts: 1 });
    }
    
    setLoginAttempts(new Map(loginAttempts));
  };

  const clearFailedAttempts = (email: string) => {
    loginAttempts.delete(email);
    setLoginAttempts(new Map(loginAttempts));
  };

  const secureSignIn = async (email: string, password: string) => {
    if (isAccountLocked(email)) {
      const remainingTime = Math.ceil((LOCKOUT_DURATION - (Date.now() - loginAttempts.get(email)!.timestamp)) / 60000);
      toast.error(`Account temporarily locked. Try again in ${remainingTime} minutes.`);
      return { error: { message: "Account locked" } };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password
      });

      if (error) {
        recordFailedAttempt(email);
        // Log security event
        console.warn(`Failed login attempt for ${email} at ${new Date().toISOString()}`);
        
        const attemptsLeft = MAX_LOGIN_ATTEMPTS - (loginAttempts.get(email)?.attempts || 0);
        if (attemptsLeft > 0) {
          toast.error(`Invalid credentials. ${attemptsLeft} attempts remaining.`);
        }
        return { error };
      }

      clearFailedAttempts(email);
      // Log successful login
      console.info(`Successful login for ${email} at ${new Date().toISOString()}`);
      return { data };
    } catch (error) {
      recordFailedAttempt(email);
      return { error };
    }
  };

  return {
    secureSignIn,
    isAccountLocked
  };
};
