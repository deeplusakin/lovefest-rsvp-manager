
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SecureLoginForm } from "@/components/SecureLoginForm";

export const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/admin');
      }
    };
    
    checkAuth();
  }, [navigate]);

  const handleLoginSuccess = () => {
    navigate('/admin');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 p-4">
      <SecureLoginForm onSuccess={handleLoginSuccess} />
    </div>
  );
};

export default Login;
