
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, PlusCircle } from "lucide-react";
import { EventForm } from "@/components/admin/EventForm";
import { EventsList } from "@/components/admin/EventsList";
import { RSVPList } from "@/components/admin/RSVPList";
import { GuestForm } from "@/components/admin/GuestForm";
import { GuestsTable } from "@/components/admin/GuestsTable";
import { PhotoManager } from "@/components/admin/PhotoManager";
import { ProfileSettings } from "@/components/admin/ProfileSettings";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useAdminData } from "@/hooks/useAdminData";
import { useEventManagement } from "@/hooks/useEventManagement";
import { getEventStats } from "@/utils/eventStats";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Admin = () => {
  const {
    events,
    isLoading,
    fetchData,
    fetchEvents,
  } = useAdminData();

  const {
    showEventForm,
    setShowEventForm,
    editingEvent,
    eventFormData,
    setEventFormData,
    handleCreateEvent,
    handleUpdateEvent,
    handleDeleteEvent,
    startEditEvent,
  } = useEventManagement(fetchData);

  const [showGuestForm, setShowGuestForm] = useState(false);
  const [guests, setGuests] = useState<any[]>([]);

  useAdminAuth(fetchData);

  const fetchGuests = async () => {
    const { data, error } = await supabase
      .from('guests')
      .select(`
        id,
        first_name,
        last_name,
        email,
        household:households (
          name,
          invitation_code
        )
      `)
      .order('last_name');

    if (error) {
      console.error('Error fetching guests:', error);
      return;
    }

    setGuests(data || []);
  };

  useEffect(() => {
    fetchGuests();
  }, []);

  const handleTabChange = useCallback((value: string) => {
    if (value === "events") {
      fetchEvents();
    } else if (value === "guests") {
      fetchGuests();
    }
  }, [fetchEvents]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-y-auto pt-16">
      <div className="container max-w-7xl py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-serif">Wedding Admin Dashboard</h1>
          <Link to="/">
            <Button variant="outline" className="gap-2">
              <Home className="h-4 w-4" />
              Return Home
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="events" onValueChange={handleTabChange} className="space-y-8">
          <TabsList>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="rsvps">RSVPs</TabsTrigger>
            <TabsTrigger value="guests">Guests</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
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
                    setEventFormData({
                      name: "",
                      date: "",
                      location: "",
                      description: "",
                    });
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
            <RSVPList
              events={events}
              getEventStats={getEventStats}
            />
          </TabsContent>

          <TabsContent value="guests" className="space-y-8">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-serif">Manage Guests</h2>
                <Button onClick={() => setShowGuestForm(!showGuestForm)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {showGuestForm ? 'Cancel' : 'Add Guest'}
                </Button>
              </div>
              {showGuestForm ? (
                <GuestForm onSuccess={() => {
                  fetchGuests();
                  setShowGuestForm(false);
                }} />
              ) : (
                <GuestsTable guests={guests} onDelete={fetchGuests} />
              )}
            </Card>
          </TabsContent>

          <TabsContent value="photos" className="space-y-8">
            <PhotoManager />
          </TabsContent>

          <TabsContent value="profile" className="space-y-8">
            <ProfileSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
