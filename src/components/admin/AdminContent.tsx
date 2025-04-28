
import { RefreshCw, Loader2, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { EventsList } from "@/components/admin/EventsList";
import { EventForm } from "@/components/admin/EventForm";
import { EventStatistics } from "@/components/admin/EventStatistics";
import { RSVPList } from "@/components/admin/RSVPList";
import { PhotoManager } from "@/components/admin/PhotoManager";
import { ContributionsList } from "@/components/admin/ContributionsList";
import { ProfileSettings } from "@/components/admin/ProfileSettings";
import { GuestManagement } from "@/components/admin/GuestManagement";
import { Event, EventFormData } from "@/types/admin";
import { useState } from "react";
import { useEventManagement } from "@/hooks/useEventManagement";

interface AdminContentProps {
  currentTab: string;
  isAuthenticated: boolean;
  isLoading: boolean;
  isError: boolean;
  events: Event[];
  contributions: any[];
  totalContributions: number;
  fetchData: () => void;
  fetchEvents: () => void;
  getEventStats: (event: Event) => any;
}

export const AdminContent = ({
  currentTab,
  isAuthenticated,
  isLoading,
  isError,
  events,
  contributions,
  totalContributions,
  fetchData,
  fetchEvents,
  getEventStats
}: AdminContentProps) => {
  const [showEventForm, setShowEventForm] = useState(false);
  const {
    editingEvent,
    eventFormData,
    setEventFormData,
    handleCreateEvent,
    handleUpdateEvent,
    handleDeleteEvent,
    startEditEvent,
  } = useEventManagement(fetchEvents);

  // Create a properly typed empty event to use as fallback
  const emptyEvent: Event = {
    id: '',
    name: '',
    date: '',
    location: '',
    description: null,
    guest_events: []
  };

  const handleEventEdit = (event: Event) => {
    console.log("Editing event:", event);
    startEditEvent(event);
    setShowEventForm(true);
  };

  const handleEventFormCancel = () => {
    setShowEventForm(false);
    setEventFormData({ name: "", date: "", location: "", description: "" });
  };

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-2">Verifying authentication...</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center p-12">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p>Loading data...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            There was a problem loading the data. Please try again or check your connection.
          </AlertDescription>
        </Alert>
        <Button onClick={fetchData} variant="outline" className="mt-4">
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }

  switch (currentTab) {
    case 'events':
      return showEventForm ? (
        <div>
          <h2 className="text-2xl font-serif mb-4">{editingEvent ? 'Edit Event' : 'Create Event'}</h2>
          <EventForm 
            onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent}
            eventFormData={eventFormData}
            setEventFormData={setEventFormData}
            editingEvent={editingEvent}
            onCancel={handleEventFormCancel}
          />
        </div>
      ) : (
        <EventsList 
          events={events} 
          onEdit={handleEventEdit} 
          onDelete={handleDeleteEvent} 
        />
      );
    case 'guests':
      return <GuestManagement onGuestsChange={fetchEvents} />;
    case 'rsvps':
      return <RSVPList events={events} getEventStats={getEventStats} />;
    case 'photos':
      return <PhotoManager />;
    case 'contributions':
      return <ContributionsList contributions={contributions} totalContributions={totalContributions} />;
    case 'profile':
      return <ProfileSettings />;
    case 'statistics':
      return <EventStatistics stats={getEventStats(events[0] || emptyEvent)} />;
    default:
      return <EventStatistics stats={getEventStats(events[0] || emptyEvent)} />;
  }
};
