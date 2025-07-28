
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRsvpCode } from "@/hooks/useRsvpCode";

interface RsvpFormProps {
  onHouseholdFound: (householdId: string) => void;
}

export const RsvpForm = ({ onHouseholdFound }: RsvpFormProps) => {
  return (
    <section className="py-24 bg-primary text-white">
      <div className="container max-w-md text-center">
        <h2 className="text-4xl md:text-5xl font-serif mb-8">RSVP</h2>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 space-y-4">
          <div className="text-center">
            <h3 className="text-2xl font-semibold mb-4">RSVP Period Has Ended</h3>
            <p className="text-gray-300 mb-6">
              Thank you for your interest in RSVPing to our wedding celebration. 
              The RSVP period has now closed and we are no longer accepting responses.
            </p>
            <p className="text-gray-300">
              If you have any urgent questions or concerns, please contact us directly.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
