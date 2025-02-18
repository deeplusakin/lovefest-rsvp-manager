
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

        try {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            throw profileError;
          }

          if (!profile?.is_admin) {
            await supabase.auth.signOut();
            toast.error("Unauthorized access: Admin privileges required");
            navigate('/login');
            return;
          }

          onAuthenticated();
        } catch (error: any) {
          console.error('Error checking admin status:', error);
          toast.error("Error verifying admin access");
          navigate('/login');
        }
      } catch (error: any) {
        console.error('Error checking auth:', error);
        toast.error("Please log in to continue");
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate, onAuthenticated]);
};
