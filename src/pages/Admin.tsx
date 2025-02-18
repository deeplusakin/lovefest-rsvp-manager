
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, PlusCircle } from "lucide-react";
import { EventForm } from "@/components/admin/EventForm";
import { EventsList } from "@/components/admin/EventsList";
import { RSVPList } from "@/components/admin/RSVPList";
import { ContributionsList } from "@/components/admin/ContributionsList";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useAdminData } from "@/hooks/useAdminData";
import { useEventManagement } from "@/hooks/useEventManagement";
import { getEventStats } from "@/utils/eventStats";

export const Admin = () => {
  const { events, contributions, totalContributions, isLoading, fetchData } = useAdminData();
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

  useAdminAuth(fetchData);

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
