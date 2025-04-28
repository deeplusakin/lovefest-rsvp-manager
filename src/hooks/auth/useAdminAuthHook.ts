
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getAuthCache, setAuthCache, isCacheValid, REQUEST_TIMEOUT } from "./authCache";
import { useLogout } from "./logoutUtils";

export const useAdminAuthHook = (onAuthenticated: () => void) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const authAttemptRef = useRef(0);
  const isMountedRef = useRef(true);
  const { logout: logoutUtil } = useLogout();
  
  const logout = async () => {
    // Clear any pending timers first
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    await logoutUtil(isMountedRef);
  };
  
  useEffect(() => {
    isMountedRef.current = true;
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
          const authCache = getAuthCache();
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
        
        // Increment attempt counter for potential backoff
        authAttemptRef.current += 1;
        
        // Apply exponential backoff if we've had multiple attempts
        const backoffTime = Math.min(Math.pow(2, authAttemptRef.current - 1) * 1000, 8000);
        if (authAttemptRef.current > 1) {
          console.log(`Applying backoff of ${backoffTime}ms before auth check`);
          await new Promise(resolve => setTimeout(resolve, backoffTime));
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
        
        if (!isMountedRef.current) return;
        
        // Clear the timeout since we got a response
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
        
        // Reset attempt counter on successful response
        authAttemptRef.current = 0;
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          throw sessionError;
        }
        
        if (!session) {
          console.log('No session found, redirecting to login');
          // Update cache
          setAuthCache({
            isAdmin: false,
            userId: null,
            session: null,
            lastChecked: Date.now()
          });
          
          // Only navigate if we're not already on the login page
          if (location.pathname !== '/login') {
            navigate('/login');
          }
          setIsCheckingAuth(false);
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

        if (!isMountedRef.current) return;
        
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
          setAuthCache({
            isAdmin: false,
            userId: null,
            session: null,
            lastChecked: Date.now()
          });
          
          await logout();
          return;
        }

        // Update the cache with the result
        setAuthCache({
          isAdmin: !!profile?.is_admin,
          userId: session.user.id,
          session: session,
          lastChecked: Date.now()
        });

        if (!profile?.is_admin) {
          console.log('User is not an admin');
          toast.error("Unauthorized access: Admin privileges required", {
            id: "admin-unauthorized",
          });
          await logout();
          return;
        }

        console.log('Admin verification successful');
        // Only call onAuthenticated if we're on the admin page
        if (location.pathname === '/admin') {
          onAuthenticated();
        }
        
      } catch (error: any) {
        if (!isMountedRef.current) return;
        
        console.error('Auth check error:', error);
        
        // Reset the cache on error
        setAuthCache(null);
        
        // Only show toast if we're not on login page
        if (location.pathname !== '/login') {
          toast.error("Please log in to continue", {
            id: "auth-required",
          });
          navigate('/login');
        }
      } finally {
        if (isMountedRef.current) {
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
      setAuthCache(null);
      
      if (!session && location.pathname !== '/login') {
        navigate('/login');
      } else if (session && event !== 'INITIAL_SESSION') {
        // Only run check if this isn't the initial session
        checkAuth();
      }
    });

    // Cleanup function
    return () => {
      isMountedRef.current = false;
      subscription.unsubscribe();
      
      // Clear any timeout on unmount
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [navigate, onAuthenticated, location.pathname]);
  
  return { isCheckingAuth, logout };
};
