
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface GuestEvent {
  guest: {
    first_name: string;
    last_name: string;
    email: string;
    dietary_restrictions: string | null;
  };
  is_attending: boolean | null;
  response_date: string | null;
}

interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  description: string | null;
  guest_events: GuestEvent[];
}

interface Contribution {
  id: string;
  amount: number;
  message: string | null;
  created_at: string;
  guests: {
    first_name: string;
    last_name: string;
  };
}

interface EventFormData {
  name: string;
  date: string;
  location: string;
  description: string;
}

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

        // Check if user is admin
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
      // Fetch events with guest RSVPs
      const { data: eventsData, error: eventsError } = await supabase
        .from("events")
        .select(`
          id,
          name,
          date,
          location,
          description,
          guest_events (
            is_attending,
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

      // Fetch contributions
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

      // Calculate total contributions
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const getEventStats = (event: Event) => {
    const totalInvited = event.guest_events.length;
    const responded = event.guest_events.filter(g => g.is_attending !== null).length;
    const attending = event.guest_events.filter(g => g.is_attending === true).length;
    const notAttending = event.guest_events.filter(g => g.is_attending === false).length;

    return { totalInvited, responded, attending, notAttending };
  };

  const EventForm = () => (
    <form onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Event Name</Label>
        <Input
          id="name"
          value={eventFormData.name}
          onChange={(e) => setEventFormData(prev => ({ ...prev, name: e.target.value }))}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="date">Date and Time</Label>
        <Input
          id="date"
          type="datetime-local"
          value={eventFormData.date}
          onChange={(e) => setEventFormData(prev => ({ ...prev, date: e.target.value }))}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={eventFormData.location}
          onChange={(e) => setEventFormData(prev => ({ ...prev, location: e.target.value }))}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={eventFormData.description}
          onChange={(e) => setEventFormData(prev => ({ ...prev, description: e.target.value }))}
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit">
          {editingEvent ? "Update Event" : "Create Event"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setShowEventForm(false);
            setEditingEvent(null);
            setEventFormData({ name: "", date: "", location: "", description: "" });
          }}
        >
          Cancel
        </Button>
      </div>
    </form>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-7xl">
        <h1 className="text-4xl font-serif mb-8">Wedding Admin Dashboard</h1>

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
                <EventForm />
              ) : (
                <div className="space-y-4">
                  {events.map(event => (
                    <Card key={event.id} className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-semibold">{event.name}</h3>
                          <p className="text-gray-600">
                            {new Date(event.date).toLocaleDateString()} at{" "}
                            {new Date(event.date).toLocaleTimeString()}
                          </p>
                          <p className="text-gray-600">{event.location}</p>
                          {event.description && (
                            <p className="text-gray-600 mt-2">{event.description}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => startEditEvent(event)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteEvent(event.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="rsvps" className="space-y-8">
            {events.map(event => {
              const stats = getEventStats(event);
              
              return (
                <Card key={event.id} className="p-6">
                  <h3 className="text-2xl font-serif mb-4">{event.name}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="text-2xl font-bold">{stats.totalInvited}</div>
                      <div className="text-sm text-gray-600">Total Invited</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="text-2xl font-bold">{stats.responded}</div>
                      <div className="text-sm text-gray-600">Responses</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="text-2xl font-bold text-green-600">
                        {stats.attending}
                      </div>
                      <div className="text-sm text-gray-600">Attending</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="text-2xl font-bold text-red-600">
                        {stats.notAttending}
                      </div>
                      <div className="text-sm text-gray-600">Not Attending</div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Guest</th>
                          <th className="text-left p-2">Email</th>
                          <th className="text-left p-2">Status</th>
                          <th className="text-left p-2">Response Date</th>
                          <th className="text-left p-2">Dietary Restrictions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {event.guest_events.map((g, i) => (
                          <tr key={i} className="border-b">
                            <td className="p-2">
                              {g.guest.first_name} {g.guest.last_name}
                            </td>
                            <td className="p-2">{g.guest.email || "-"}</td>
                            <td className="p-2">
                              {g.is_attending === null
                                ? "No Response"
                                : g.is_attending
                                ? "Attending"
                                : "Not Attending"}
                            </td>
                            <td className="p-2">
                              {g.response_date
                                ? new Date(g.response_date).toLocaleDateString()
                                : "-"}
                            </td>
                            <td className="p-2">
                              {g.guest.dietary_restrictions || "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="contributions" className="space-y-8">
            <Card className="p-6">
              <h3 className="text-2xl font-serif mb-4">Honeymoon Fund</h3>
              <div className="bg-white p-4 rounded-lg shadow-sm inline-block mb-6">
                <div className="text-sm text-gray-600">Total Contributions</div>
                <div className="text-3xl font-bold">
                  ${totalContributions.toFixed(2)}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Guest</th>
                      <th className="text-left p-2">Amount</th>
                      <th className="text-left p-2">Message</th>
                      <th className="text-left p-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contributions.map((contribution) => (
                      <tr key={contribution.id} className="border-b">
                        <td className="p-2">
                          {contribution.guests.first_name} {contribution.guests.last_name}
                        </td>
                        <td className="p-2">${contribution.amount}</td>
                        <td className="p-2">{contribution.message || "-"}</td>
                        <td className="p-2">
                          {new Date(contribution.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
