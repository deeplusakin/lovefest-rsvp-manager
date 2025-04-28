
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { clearAuthCache } from './authCache';

export const useLogout = () => {
  const navigate = useNavigate();

  const logout = async (isMountedRef: React.MutableRefObject<boolean>) => {
    try {
      console.log('Logging out...');
      
      // Clear auth cache first to prevent race conditions
      clearAuthCache();
      
      // Sign out from Supabase with more robust error handling
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        toast.error("Error during logout. Please try again.");
        
        // If we get an error, reset the session manually as a fallback
        await supabase.auth.setSession({
          access_token: '',
          refresh_token: ''
        });
      }
      
      console.log('Redirecting to login after logout');
      // Make sure we're still mounted before navigating
      if (isMountedRef.current) {
        navigate('/login');
        toast.success("Logged out successfully");
      }
    } catch (error) {
      console.error('Unexpected logout error:', error);
      toast.error("An unexpected error occurred during logout");
      
      // Force navigate to login as last resort
      if (isMountedRef.current) {
        navigate('/login');
      }
    }
  };
  
  return { logout };
};
