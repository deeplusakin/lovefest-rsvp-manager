
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const RsvpForm = () => {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Authenticate as the guest using their invitation code
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: `${code}@guest.wedding.com`,
        password: code,
      });

      if (authError) {
        throw new Error("Invalid invitation code");
      }

      // Fetch guest details
      const { data: guestData, error: guestError } = await supabase
        .from("guests")
        .select(`
          id,
          first_name,
          last_name,
          household_id,
          events!guest_events (
            event_id,
            is_attending,
            events (
              name,
              date,
              location
            )
          )
        `)
        .eq("invitation_code", code)
        .single();

      if (guestError || !guestData) {
        throw new Error("Failed to fetch guest details");
      }

      // Store guest data in local storage for the session
      localStorage.setItem("guestData", JSON.stringify(guestData));

      // Show success message
      toast.success("Welcome! You can now RSVP to the events.");

      // TODO: Redirect to RSVP details page
      // This will be implemented in the next iteration

    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-24 bg-primary text-white">
      <div className="container max-w-md text-center">
        <h2 className="text-4xl md:text-5xl font-serif mb-8">RSVP</h2>
        <p className="text-gray-300 mb-8">
          Please enter your unique code to RSVP for our wedding celebration.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="code">Invitation Code</Label>
            <Input
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              placeholder="Enter your code"
              disabled={isLoading}
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-white text-primary hover:bg-white/90"
            disabled={isLoading}
          >
            {isLoading ? "Verifying..." : "Continue"}
          </Button>
        </form>
      </div>
    </section>
  );
};
