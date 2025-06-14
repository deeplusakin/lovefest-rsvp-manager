
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAdminAuth = (onAuthenticated: () => void) => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }
        
        if (!session) {
          navigate('/login');
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          // Log the specific error for debugging
          console.error('Profile fetch error:', profileError);
          
          // If the error is about network connectivity, show a specific message
          if (profileError.message === 'Failed to fetch') {
            toast.error("Network error: Unable to verify admin status. Please check your connection.");
          } else {
            toast.error("Error verifying admin access");
          }
          
          await supabase.auth.signOut();
          navigate('/login');
          return;
        }

        if (!profile?.is_admin) {
          toast.error("Unauthorized access: Admin privileges required");
          await supabase.auth.signOut();
          navigate('/login');
          return;
        }

        // If we get here, the user is authenticated and is an admin
        onAuthenticated();
        
      } catch (error: any) {
        console.error('Auth check error:', error);
        
        // Handle network errors specifically
        if (error.message === 'Failed to fetch') {
          toast.error("Network error: Please check your connection");
        } else {
          toast.error("Please log in to continue");
        }
        
        navigate('/login');
      }
    };

    // Initial auth check
    checkAuth();

    // Set up auth state change listener with better multi-device handling
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state change:', event, session ? 'session exists' : 'no session');
      
      // Handle different auth events more precisely
      if (event === 'SIGNED_OUT') {
        // Only navigate to login on explicit sign out
        navigate('/login');
      } else if (event === 'SIGNED_IN' && session) {
        // Re-check admin status on sign in
        checkAuth();
      } else if (event === 'TOKEN_REFRESHED' && session) {
        // Token was refreshed successfully, just log it
        console.log('Token refreshed successfully');
        // Don't do anything else - user should stay logged in
      } else if (event === 'USER_UPDATED' && session) {
        // User data was updated, but they're still authenticated
        console.log('User data updated');
      } else if (!session && event !== 'INITIAL_SESSION') {
        // Only redirect if there's no session and it's not the initial load
        // This prevents issues with multiple devices
        console.log('No session detected, checking if should redirect');
        // Add a small delay to prevent race conditions
        setTimeout(() => {
          supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
            if (!currentSession) {
              navigate('/login');
            }
          });
        }, 100);
      }
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, onAuthenticated]);
};
