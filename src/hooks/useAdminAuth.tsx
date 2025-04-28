
import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AdminAuthCache {
  isAdmin: boolean;
  userId: string | null;
  lastChecked: number;
}

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;
// Supabase request timeout (8 seconds)
const REQUEST_TIMEOUT = 8000;

// In-memory cache shared between hook instances
let authCache: AdminAuthCache | null = null;

export const useAdminAuth = (onAuthenticated: () => void) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Function to check if the cache is still valid
  const isCacheValid = () => {
    return authCache && (Date.now() - authCache.lastChecked < CACHE_DURATION);
  };
  
  useEffect(() => {
    let isMounted = true;
    console.time('auth-check');
    
    // Clear any existing timeout
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    const checkAuth = async () => {
      try {
        console.log('Starting auth check...');
        setIsCheckingAuth(true);
        
        // Check if we have a valid cache first
        if (isCacheValid()) {
          console.log('Using cached auth data');
          if (authCache?.isAdmin) {
            console.log('Cached data confirms admin status');
            if (location.pathname === '/admin') {
              onAuthenticated();
            }
            setIsCheckingAuth(false);
            return;
          } else if (!authCache?.isAdmin && location.pathname === '/admin') {
            console.log('Cached data indicates not admin, redirecting');
            navigate('/login');
            return;
          }
        }
        
        // Set timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) => {
          timerRef.current = setTimeout(() => {
            reject(new Error('Authentication check timed out'));
          }, REQUEST_TIMEOUT);
        });
        
        // Race the session check with a timeout
        const sessionPromise = supabase.auth.getSession();
        const { data: { session }, error: sessionError } = await Promise.race([
          sessionPromise,
          timeoutPromise as Promise<any>
        ]);
        
        if (!isMounted) return;
        
        // Clear the timeout since we got a response
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          throw sessionError;
        }
        
        if (!session) {
          console.log('No session found, redirecting to login');
          // Update cache
          authCache = {
            isAdmin: false,
            userId: null,
            lastChecked: Date.now()
          };
          
          // Only navigate if we're not already on the login page
          if (location.pathname !== '/login') {
            navigate('/login');
          }
          return;
        }

        console.log('Session found, checking admin status');
        const profileStart = performance.now();
        
        // Set another timeout for profile fetch
        const profileTimeoutPromise = new Promise((_, reject) => {
          timerRef.current = setTimeout(() => {
            reject(new Error('Profile fetch timed out'));
          }, REQUEST_TIMEOUT);
        });
        
        const profilePromise = supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();
          
        const { data: profile, error: profileError } = await Promise.race([
          profilePromise,
          profileTimeoutPromise as Promise<any>
        ]);

        if (!isMounted) return;
        
        // Clear the timeout since we got a response
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
        
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
          
          // Update cache as not admin
          authCache = {
            isAdmin: false,
            userId: null,
            lastChecked: Date.now()
          };
          
          await supabase.auth.signOut();
          navigate('/login');
          return;
        }

        // Update the cache with the result
        authCache = {
          isAdmin: !!profile?.is_admin,
          userId: session.user.id,
          lastChecked: Date.now()
        };

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
        if (!isMounted) return;
        
        console.error('Auth check error:', error);
        
        // Reset the cache on error
        authCache = null;
        
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
          console.timeEnd('auth-check');
        }
        
        // Clear any remaining timeout
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
      }
    };

    // Initial auth check
    checkAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event);
      
      // Clear cache on auth state change
      authCache = null;
      
      if (!session && location.pathname !== '/login') {
        navigate('/login');
      } else if (session && event !== 'INITIAL_SESSION') {
        // Only run check if this isn't the initial session
        checkAuth();
      }
    });

    // Cleanup function
    return () => {
      isMounted = false;
      subscription.unsubscribe();
      
      // Clear any timeout on unmount
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [navigate, onAuthenticated, location.pathname]);
  
  return { isCheckingAuth };
};
