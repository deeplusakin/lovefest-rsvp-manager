
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAdminAuth = (onAuthenticated?: () => void) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        setError(null);
        
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
            const errorMsg = "Network error: Unable to verify admin status. Please check your connection.";
            setError(errorMsg);
            toast.error(errorMsg);
          } else {
            const errorMsg = "Error verifying admin access";
            setError(errorMsg);
            toast.error(errorMsg);
          }
          
          await supabase.auth.signOut();
          navigate('/login');
          return;
        }

        if (!profile?.is_admin) {
          const errorMsg = "Unauthorized access: Admin privileges required";
          setError(errorMsg);
          toast.error(errorMsg);
          await supabase.auth.signOut();
          navigate('/login');
          return;
        }

        // If we get here, the user is authenticated and is an admin
        if (onAuthenticated) {
          onAuthenticated();
        }
        
      } catch (error: any) {
        console.error('Auth check error:', error);
        
        // Handle network errors specifically
        if (error.message === 'Failed to fetch') {
          const errorMsg = "Network error: Please check your connection";
          setError(errorMsg);
          toast.error(errorMsg);
        } else {
          const errorMsg = "Please log in to continue";
          setError(errorMsg);
          toast.error(errorMsg);
        }
        
        navigate('/login');
      } finally {
        setLoading(false);
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

  return { loading, error };
};
