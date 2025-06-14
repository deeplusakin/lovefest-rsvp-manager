
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GuestManagement } from "@/components/admin/GuestManagement";
import { EventsList } from "@/components/admin/EventsList";
import { RSVPList } from "@/components/admin/RSVPList";
import { EventStatistics } from "@/components/admin/EventStatistics";
import { PhotoManager } from "@/components/admin/PhotoManager";
import { ProfileSettings } from "@/components/admin/ProfileSettings";
import { ContributionsList } from "@/components/admin/ContributionsList";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useAdminData } from "@/hooks/useAdminData";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { exportGuestsToCSV } from "@/utils/csvExport";

const Admin = () => {
  const { loading: authLoading, error: authError } = useAdminAuth();
  const { events, guests, loading: dataLoading } = useAdminData();

  if (authLoading || dataLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-600">{authError}</p>
      </div>
    );
  }

  const handleExportGuests = () => {
    exportGuestsToCSV(guests);
  };

  // Calculate statistics with proper type checking
  const calculateEventStats = (eventId: string) => {
    if (!guests || guests.length === 0) return { attending: 0, notAttending: 0 };
    
    let attending = 0;
    let notAttending = 0;
    
    guests.forEach(guest => {
      if (guest.guest_events) {
        const guestEvent = guest.guest_events.find(ge => ge.event_id === eventId);
        if (guestEvent) {
          if (guestEvent.status === 'attending') {
            attending++;
          } else if (guestEvent.status === 'declined') {
            notAttending++;
          }
        }
      }
    });
    
    return { attending, notAttending };
  };

  const eventsWithStats = events?.map(event => {
    // Only process actual events with all required properties
    if (event && typeof event === 'object' && 'id' in event && 'name' in event) {
      const stats = calculateEventStats(event.id);
      return {
        ...event,
        guest_events: undefined, // Remove the guest_events array that's causing type issues
        ...stats
      };
    }
    return null;
  }).filter(Boolean) || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto p-6 space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Wedding Admin Dashboard</h1>
        <Button onClick={handleExportGuests} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Guests
        </Button>
      </div>

      <Tabs defaultValue="guests" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="guests">Guests</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="rsvp">RSVP</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
          <TabsTrigger value="photos">Photos</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="guests">
          <Card>
            <CardHeader>
              <CardTitle>Guest Management</CardTitle>
              <CardDescription>
                Manage wedding guests and their information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GuestManagement />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>Wedding Events</CardTitle>
              <CardDescription>
                Create and manage wedding events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EventsList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rsvp">
          <Card>
            <CardHeader>
              <CardTitle>RSVP Responses</CardTitle>
              <CardDescription>
                View and manage guest RSVP responses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RSVPList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>Event Statistics</CardTitle>
              <CardDescription>
                View attendance statistics for all events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EventStatistics events={eventsWithStats} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="photos">
          <Card>
            <CardHeader>
              <CardTitle>Photo Management</CardTitle>
              <CardDescription>
                Upload and manage wedding photos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PhotoManager />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>
                Manage your admin profile and settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileSettings />
            </CardContent>
          </Card>
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Contributions</CardTitle>
              <CardDescription>
                View honeymoon fund contributions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContributionsList />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default Admin;
