
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export type SecurityEventType = 
  | 'login_success' 
  | 'login_failure' 
  | 'admin_action' 
  | 'suspicious_activity' 
  | 'data_access'
  | 'invitation_used'
  | 'file_upload';

export const useSecurityLogger = () => {
  const logSecurityEvent = useCallback(async (
    eventType: SecurityEventType,
    details: Record<string, any>,
    userId?: string
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const currentUserId = userId || user?.id;

      const logData = {
        event_type: eventType,
        user_id: currentUserId,
        details: JSON.stringify(details),
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent,
        url: window.location.href
      };

      // In a production environment, you would send this to a secure logging service
      // For now, we'll use console logging with structured data
      console.info('SECURITY_EVENT:', logData);

      // You could also store these in a separate audit_logs table if needed
      // const { error } = await supabase.from('audit_logs').insert(logData);
      
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }, []);

  const logAdminAction = useCallback(async (action: string, targetResource: string, details?: any) => {
    await logSecurityEvent('admin_action', {
      action,
      target_resource: targetResource,
      ...details
    });
  }, [logSecurityEvent]);

  const logSuspiciousActivity = useCallback(async (activity: string, details?: any) => {
    await logSecurityEvent('suspicious_activity', {
      activity,
      ...details
    });
  }, [logSecurityEvent]);

  return {
    logSecurityEvent,
    logAdminAction,
    logSuspiciousActivity
  };
};
