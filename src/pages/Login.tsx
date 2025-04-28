
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

// Session check timeout (10 seconds)
const SESSION_CHECK_TIMEOUT = 10000;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [sessionCheckFailed, setSessionCheckFailed] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let isMounted = true;
    
    const checkSession = async () => {
      try {
        setSessionCheckFailed(false);
        
        // Create a timeout promise
        const timeoutPromise = new Promise<null>((_, reject) => {
          timeoutId = setTimeout(() => {
            if (isMounted) {
              setSessionCheckFailed(true);
              reject(new Error('Session check timed out'));
            }
          }, SESSION_CHECK_TIMEOUT);
        });
        
        const sessionPromise = supabase.auth.getSession();
        
        // Race the session check with the timeout
        const { data: { session } } = await Promise.race([
          sessionPromise,
          timeoutPromise
        ]);
        
        // Clear timeout since we got a response
        clearTimeout(timeoutId);
        
        if (session && isMounted) {
          console.log("Session found, checking admin status");
          
          // Check if user is admin before redirecting
          const adminCheckPromise = supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', session.user.id)
            .single();
            
          const adminTimeoutPromise = new Promise<null>((_, reject) => {
            timeoutId = setTimeout(() => {
              if (isMounted) {
                setSessionCheckFailed(true);
                reject(new Error('Admin check timed out'));
              }
            }, SESSION_CHECK_TIMEOUT);
          });
          
          try {
            const { data: profileData } = await Promise.race([
              adminCheckPromise,
              adminTimeoutPromise
            ]);
            
            // Clear timeout since we got a response
            clearTimeout(timeoutId);
              
            if (profileData?.is_admin && isMounted) {
              navigate('/admin');
              return;
            }
          } catch (error) {
            console.error("Admin status check failed:", error);
            // Continue to login page if admin check fails
          }
        }
      } catch (error) {
        console.error('Session check error:', error);
        // Just continue to login page on error
      } finally {
        clearTimeout(timeoutId);
        if (isMounted) {
          setCheckingSession(false);
        }
      }
    };
    
    checkSession();
    
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Configure auth to ensure proper persistence
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Check if user is admin
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', data.user.id)
        .single();

      if (profileError) throw profileError;

      if (!profileData?.is_admin) {
        await supabase.auth.signOut();
        throw new Error("Unauthorized access: Admin privileges required");
      }

      toast.success("Login successful", {
        id: "login-success"
      });
      navigate('/admin');
    } catch (error: any) {
      toast.error(error.message, {
        id: "login-error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      toast.error("Please enter your email address", {
        id: "reset-email-required"
      });
      return;
    }
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      toast.success("Password reset instructions have been sent to your email", {
        id: "reset-success"
      });
    } catch (error: any) {
      toast.error(error.message, {
        id: "reset-error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetrySessionCheck = () => {
    setCheckingSession(true);
    setSessionCheckFailed(false);
    window.location.reload();
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p>Checking authentication...</p>
          {sessionCheckFailed && (
            <div className="mt-4">
              <p className="text-amber-500 mb-2">Session check is taking longer than expected</p>
              <Button variant="outline" onClick={handleRetrySessionCheck}>
                Retry
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <Link 
            to="/" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Return to Home
          </Link>
          <h1 className="text-2xl font-serif text-center">Admin Portal</h1>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              minLength={6}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
              </>
            ) : "Login"}
          </Button>
          <Button
            type="button"
            variant="link"
            className="w-full"
            onClick={handlePasswordReset}
            disabled={isLoading}
          >
            Forgot Password?
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Login;
