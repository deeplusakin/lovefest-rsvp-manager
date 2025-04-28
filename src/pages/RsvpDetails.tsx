
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { HoneymoonFund } from "@/components/HoneymoonFund";

interface GuestEvent {
  event_id: string;
  is_attending: boolean | null;
  events: {
    name: string;
    date: string;
    location: string;
  };
}

interface GuestData {
  id: string;
  first_name: string;
  last_name: string;
  events: GuestEvent[];
}

export const RsvpDetails = () => {
  const navigate = useNavigate();
  const [guestData, setGuestData] = useState<GuestData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedData = localStorage.getItem("guestData");
    if (!storedData) {
      navigate("/");
      return;
    }
    setGuestData(JSON.parse(storedData));
  }, [navigate]);

  const handleRsvp = async (eventId: string, attending: boolean) => {
    if (!guestData) return;
    setIsLoading(true);

    try {
      // Update RSVP status
      const { error: updateError } = await supabase
        .from("guest_events")
        .update({
          is_attending: attending,
          response_date: new Date().toISOString()
        })
        .eq("guest_id", guestData.id)
        .eq("event_id", eventId);

      if (updateError) throw updateError;

      // Send confirmation email
      const { error: emailError } = await supabase.functions.invoke("send-rsvp-confirmation", {
        body: { guestId: guestData.id, eventId }
      });

      if (emailError) throw emailError;

      // Update local state
      setGuestData(prev => {
        if (!prev) return null;
        return {
          ...prev,
          events: prev.events.map(event => 
            event.event_id === eventId 
              ? { ...event, is_attending: attending }
              : event
          )
        };
      });

      toast.success("Your RSVP has been updated!");
    } catch (error: any) {
      toast.error("Failed to update RSVP: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!guestData) {
    return null;
  }

  // Format date for display
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary to-primary/80 text-white">
      <section className="py-24">
        <div className="container max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-serif mb-8 text-center">
            Welcome, {guestData.first_name}!
          </h1>
          
          <div className="space-y-8">
            {guestData.events.map((event) => (
              <div
                key={event.event_id}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-6 space-y-4"
              >
                <div className="space-y-2">
                  <h3 className="text-2xl font-serif">{event.events.name}</h3>
                  <p className="text-gray-300">
                    {formatEventDate(event.events.date)}
                  </p>
                  <p className="text-gray-300">{event.events.location}</p>
                </div>

                <div className="space-y-4">
                  <Label>Will you be attending?</Label>
                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      className={`flex-1 ${
                        event.is_attending === true
                          ? "bg-white text-primary"
                          : "bg-transparent"
                      }`}
                      onClick={() => handleRsvp(event.event_id, true)}
                      disabled={isLoading}
                    >
                      Yes, I'll be there
                    </Button>
                    <Button
                      variant="outline"
                      className={`flex-1 ${
                        event.is_attending === false
                          ? "bg-white text-primary"
                          : "bg-transparent"
                      }`}
                      onClick={() => handleRsvp(event.event_id, false)}
                      disabled={isLoading}
                    >
                      Sorry, can't make it
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <HoneymoonFund />
    </div>
  );
};

export default RsvpDetails;
