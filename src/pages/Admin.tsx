import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Home, PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { EventForm } from "@/components/admin/EventForm";
import { EventsList } from "@/components/admin/EventsList";
import { RSVPList } from "@/components/admin/RSVPList";
import { ContributionsList } from "@/components/admin/ContributionsList";
import { Event, EventFormData, Contribution, EventStats } from "@/types/admin";

export const Admin = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [totalContributions, setTotalContributions] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [eventFormData, setEventFormData] = useState<EventFormData>({
    name: "",
    date: "",
    location: "",
    description: "",
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/login');
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();

        if (profileError || !profile?.is_admin) {
          await supabase.auth.signOut();
          navigate('/login');
          return;
        }

        fetchData();
      } catch (error) {
        console.error('Error checking auth:', error);
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const { data: eventsData, error: eventsError } = await supabase
        .from("events")
        .select(`
          id,
          name,
          date,
          location,
          description,
          guest_events (
            guest_id,
            status,
            response_date,
            guest:guests (
              first_name,
              last_name,
              email,
              dietary_restrictions
            )
          )
        `)
        .order("date");

      if (eventsError) throw eventsError;
      setEvents(eventsData || []);

      const { data: contributionsData, error: contributionsError } = await supabase
        .from("contributions")
        .select(`
          id,
          amount,
          message,
          created_at,
          guests (
            first_name,
            last_name
          )
        `)
        .order("created_at", { ascending: false });

      if (contributionsError) throw contributionsError;
      setContributions(contributionsData || []);

      const total = (contributionsData || []).reduce(
        (sum, contrib) => sum + contrib.amount,
        0
      );
      setTotalContributions(total);
    } catch (error: any) {
      console.error("Error fetching data:", error.message);
      toast.error("Error loading data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('events')
        .insert([eventFormData]);

      if (error) throw error;

      toast.success("Event created successfully");
      setShowEventForm(false);
      setEventFormData({ name: "", date: "", location: "", description: "" });
      fetchData();
    } catch (error: any) {
      toast.error("Error creating event: " + error.message);
    }
  };

  const handleUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;

    try {
      const { error } = await supabase
        .from('events')
        .update(eventFormData)
        .eq('id', editingEvent.id);

      if (error) throw error;

      toast.success("Event updated successfully");
      setEditingEvent(null);
      setEventFormData({ name: "", date: "", location: "", description: "" });
      fetchData();
    } catch (error: any) {
      toast.error("Error updating event: " + error.message);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm("Are you sure you want to delete this event? This will also delete all associated RSVPs.")) {
      return;
    }

    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;

      toast.success("Event deleted successfully");
      fetchData();
    } catch (error: any) {
      toast.error("Error deleting event: " + error.message);
    }
  };

  const startEditEvent = (event: Event) => {
    setEditingEvent(event);
    setEventFormData({
      name: event.name,
      date: new Date(event.date).toISOString().slice(0, 16),
      location: event.location,
      description: event.description || "",
    });
    setShowEventForm(true);
  };

  const getEventStats = (event: Event): EventStats => {
    const totalInvited = event.guest_events.filter(g => g.status !== 'not_invited').length;
    const responded = event.guest_events.filter(g => ['attending', 'declined'].includes(g.status)).length;
    const attending = event.guest_events.filter(g => g.status === 'attending').length;
    const notAttending = event.guest_events.filter(g => g.status === 'declined').length;

    return { totalInvited, responded, attending, notAttending };
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-serif">Wedding Admin Dashboard</h1>
          <Link to="/">
            <Button variant="outline" className="gap-2">
              <Home className="h-4 w-4" />
              Return Home
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="events">
          <TabsList>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="rsvps">RSVPs</TabsTrigger>
            <TabsTrigger value="contributions">Contributions</TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="space-y-8">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-serif">Manage Events</h2>
                {!showEventForm && (
                  <Button onClick={() => setShowEventForm(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Event
                  </Button>
                )}
              </div>
              {showEventForm ? (
                <EventForm
                  onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent}
                  eventFormData={eventFormData}
                  setEventFormData={setEventFormData}
                  editingEvent={editingEvent}
                  onCancel={() => {
                    setShowEventForm(false);
                    setEditingEvent(null);
                    setEventFormData({ name: "", date: "", location: "", description: "" });
                  }}
                />
              ) : (
                <EventsList
                  events={events}
                  onEdit={startEditEvent}
                  onDelete={handleDeleteEvent}
                />
              )}
            </Card>
          </TabsContent>

          <TabsContent value="rsvps" className="space-y-8">
            <RSVPList events={events} getEventStats={getEventStats} />
          </TabsContent>

          <TabsContent value="contributions" className="space-y-8">
            <ContributionsList
              contributions={contributions}
              totalContributions={totalContributions}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
