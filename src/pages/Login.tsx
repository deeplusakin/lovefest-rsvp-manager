
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
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
        throw new Error("Unauthorized access");
      }

      navigate('/admin');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      toast.success("Account created successfully! Please check your email to verify your account.");
      
      // Wait a moment before checking profile
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user is admin
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', data.user?.id)
        .single();

      if (profileError || !profileData?.is_admin) {
        await supabase.auth.signOut();
        throw new Error("Unauthorized access. Only admin accounts are allowed.");
      }

    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      toast.success("Password reset instructions have been sent to your email");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const AuthForm = ({ mode }: { mode: 'login' | 'signup' }) => (
    <form onSubmit={mode === 'login' ? handleLogin : handleSignUp} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={`${mode}-email`}>Email</Label>
        <Input
          id={`${mode}-email`}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${mode}-password`}>Password</Label>
        <Input
          id={`${mode}-password`}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
          minLength={6}
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Processing..." : mode === 'login' ? "Login" : "Sign Up"}
      </Button>
      {mode === 'login' && (
        <Button
          type="button"
          variant="link"
          className="w-full"
          onClick={handlePasswordReset}
          disabled={isLoading}
        >
          Forgot Password?
        </Button>
      )}
    </form>
  );

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
        <Tabs defaultValue="login" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <AuthForm mode="login" />
          </TabsContent>
          <TabsContent value="signup">
            <AuthForm mode="signup" />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Login;
