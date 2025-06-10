
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSecureAuth } from "@/hooks/useSecureAuth";
import { useInputValidation } from "@/hooks/useInputValidation";
import { useSecurityLogger } from "@/hooks/useSecurityLogger";
import { Eye, EyeOff, Shield } from "lucide-react";

interface SecureLoginFormProps {
  onSuccess: () => void;
}

export const SecureLoginForm = ({ onSuccess }: SecureLoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { secureSignIn, isAccountLocked } = useSecureAuth();
  const { sanitizeEmail } = useInputValidation();
  const { logSecurityEvent } = useSecurityLogger();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const sanitizedEmail = sanitizeEmail(email);
    
    if (!sanitizedEmail || !password) {
      setIsLoading(false);
      return;
    }

    if (isAccountLocked(sanitizedEmail)) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await secureSignIn(sanitizedEmail, password);
      
      if (error) {
        await logSecurityEvent('login_failure', {
          email: sanitizedEmail,
          error: error.message
        });
      } else {
        await logSecurityEvent('login_success', {
          email: sanitizedEmail
        });
        onSuccess();
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-center mb-2">
          <Shield className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl text-center">Secure Login</CardTitle>
        <CardDescription className="text-center">
          Enter your credentials to access the admin panel
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
