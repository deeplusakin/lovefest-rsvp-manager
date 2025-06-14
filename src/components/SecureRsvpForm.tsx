
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSecureInvitation } from "@/hooks/useSecureInvitation";
import { useInputValidation } from "@/hooks/useInputValidation";
import { useSecurityLogger } from "@/hooks/useSecurityLogger";
import { Shield, CheckCircle } from "lucide-react";

interface SecureRsvpFormProps {
  onValidCode: (householdId: string) => void;
}

export const SecureRsvpForm = ({ onValidCode }: SecureRsvpFormProps) => {
  const [invitationCode, setInvitationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { validateInvitationCode } = useSecureInvitation();
  const { sanitizeText } = useInputValidation();
  const { logSecurityEvent } = useSecurityLogger();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const sanitizedCode = sanitizeText(invitationCode, 8);
    
    if (!sanitizedCode) {
      setIsLoading(false);
      return;
    }

    try {
      const householdId = await validateInvitationCode(sanitizedCode);
      
      if (householdId) {
        await logSecurityEvent('invitation_used', {
          invitation_code: sanitizedCode,
          household_id: householdId
        });
        onValidCode(householdId);
      }
    } catch (error) {
      console.error('RSVP validation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-center mb-2">
          <CheckCircle className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl text-center">RSVP Access</CardTitle>
        <CardDescription className="text-center">
          Enter your invitation code to access the RSVP form
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">Invitation Code</Label>
            <Input
              id="code"
              type="text"
              placeholder="ABC123XY"
              value={invitationCode}
              onChange={(e) => setInvitationCode(e.target.value.toUpperCase())}
              required
              maxLength={8}
              className="uppercase tracking-wider"
            />
            <p className="text-sm text-muted-foreground">
              Enter the 6-8 character code from your invitation
            </p>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Validating..." : "Access RSVP"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
