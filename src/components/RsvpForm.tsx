
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const RsvpForm = () => {
  const [code, setCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.info("RSVP functionality coming soon!");
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
            />
          </div>
          <Button type="submit" className="w-full bg-white text-primary hover:bg-white/90">
            Continue
          </Button>
        </form>
      </div>
    </section>
  );
};
