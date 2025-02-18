
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, PlusCircle } from "lucide-react";
import { EventForm } from "@/components/admin/EventForm";
import { EventsList } from "@/components/admin/EventsList";
import { RSVPList } from "@/components/admin/RSVPList";
import { GuestForm } from "@/components/admin/GuestForm";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useAdminData } from "@/hooks/useAdminData";
import { useEventManagement } from "@/hooks/useEventManagement";
import { getEventStats } from "@/utils/eventStats";
import { downloadCSV } from "@/utils/csvExport";
import { useCallback, useState } from "react";

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

  useAdminAuth(fetchData);

  const handleTabChange = useCallback((value: string) => {
    if (value === "events") {
      fetchEvents();
    }
  }, [fetchEvents]);

  const exportEventGuests = useCallback((eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return;

    const guestData = event.guest_events.map(ge => ({
      first_name: ge.guest.first_name,
      last_name: ge.guest.last_name,
      email: ge.guest.email || '',
      status: ge.status,
      response_date: ge.response_date || '',
      dietary_restrictions: ge.guest.dietary_restrictions || ''
    }));

    downloadCSV(guestData, `${event.name}-guest-list`);
  }, [events]);

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
              onExportGuests={exportEventGuests}
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
              {showGuestForm && (
                <GuestForm onSuccess={() => fetchData()} />
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
