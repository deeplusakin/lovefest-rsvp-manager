
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAdminAuth = (onAuthenticated: () => void) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  useEffect(() => {
    let isMounted = true; // Track component mount state
    console.time('auth-check'); // Start measuring auth check time
    
    const checkAuth = async () => {
      try {
        console.log('Starting auth check...');
        setIsCheckingAuth(true);
        
        // Get session with a timeout to prevent hanging
        const sessionPromise = supabase.auth.getSession();
        const { data: { session }, error: sessionError } = await sessionPromise;
        
        if (!isMounted) return; // Exit if component unmounted
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          throw sessionError;
        }
        
        if (!session) {
          console.log('No session found, redirecting to login');
          // Only navigate if we're not already on the login page
          if (location.pathname !== '/login') {
            navigate('/login');
          }
          return;
        }

        console.log('Session found, checking admin status');
        const profileStart = performance.now();
        
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();

        if (!isMounted) return; // Exit if component unmounted
        
        const profileEnd = performance.now();
        console.log(`Profile fetch took ${profileEnd - profileStart}ms`);

        if (profileError) {
          console.error('Profile fetch error:', profileError);
          // Only show toast if we're not on login page
          if (location.pathname !== '/login') {
            toast.error("Error verifying admin access", {
              id: "admin-verify-error",
            });
          }
          await supabase.auth.signOut();
          navigate('/login');
          return;
        }

        if (!profile?.is_admin) {
          console.log('User is not an admin');
          toast.error("Unauthorized access: Admin privileges required", {
            id: "admin-unauthorized",
          });
          await supabase.auth.signOut();
          navigate('/login');
          return;
        }

        console.log('Admin verification successful');
        // Only call onAuthenticated if we're on the admin page
        if (location.pathname === '/admin') {
          onAuthenticated();
        }
        
      } catch (error: any) {
        if (!isMounted) return; // Exit if component unmounted
        
        console.error('Auth check error:', error);
        
        // Only show toast if we're not on login page
        if (location.pathname !== '/login') {
          toast.error("Please log in to continue", {
            id: "auth-required",
          });
          navigate('/login');
        }
      } finally {
        if (isMounted) {
          setIsCheckingAuth(false);
          console.timeEnd('auth-check'); // Log total auth check time
        }
      }
    };

    // Initial auth check
    checkAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event);
      
      if (!session && location.pathname !== '/login') {
        navigate('/login');
      } else if (session) {
        // If we have a session and we're on the login page, navigate to admin
        if (location.pathname === '/login') {
          navigate('/admin');
        }
      }
    });

    // Cleanup function
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, onAuthenticated, location.pathname]);
  
  return { isCheckingAuth };
};
