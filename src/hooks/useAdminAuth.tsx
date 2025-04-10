
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAdminAuth = (onAuthenticated: () => void) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsCheckingAuth(true);
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }
        
        if (!session) {
          // Only navigate if we're not already on the login page
          if (location.pathname !== '/login') {
            navigate('/login');
          }
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error('Profile fetch error:', profileError);
          // Only show toast if we're not on login page
          if (location.pathname !== '/login') {
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

        onAuthenticated();
        
      } catch (error: any) {
        console.error('Auth check error:', error);
        
        // Only show toast if we're not on login page
        if (location.pathname !== '/login') {
          toast.error("Please log in to continue");
          navigate('/login');
        }
      } finally {
        setIsCheckingAuth(false);
      }
    };

    // Initial auth check
    checkAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session && location.pathname !== '/login') {
        navigate('/login');
      } else if (session) {
        // If we have a session and we're on the login page, navigate to admin
        if (location.pathname === '/login') {
          navigate('/admin');
        }
      }
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, onAuthenticated, location.pathname]);
  
  return { isCheckingAuth };
};
