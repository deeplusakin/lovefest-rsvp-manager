
import { useState } from "react";
import { Event, EventFormData } from "@/types/admin";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { formatInTimeZone, toZonedTime } from "date-fns-tz";

export const useEventManagement = (onSuccess: () => void) => {
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [eventFormData, setEventFormData] = useState<EventFormData>({
    name: "",
    date: "",
    location: "",
    description: "",
  });

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
      onSuccess();
    } catch (error: any) {
      toast.error("Error creating event: " + error.message);
      console.error("Create event error:", error);
    }
  };

  const handleUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) {
      toast.error("No event selected for editing");
      return;
    }

    try {
      console.log("Updating event with ID:", editingEvent.id);
      console.log("Form data:", eventFormData);
      
      const { error } = await supabase
        .from('events')
        .update(eventFormData)
        .eq('id', editingEvent.id);

      if (error) throw error;

      toast.success("Event updated successfully");
      setEditingEvent(null);
      setEventFormData({ name: "", date: "", location: "", description: "" });
      setShowEventForm(false);
      onSuccess();
    } catch (error: any) {
      toast.error("Error updating event: " + error.message);
      console.error("Update event error:", error);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm("Are you sure you want to delete this event? This will also delete all associated RSVPs.")) {
      return;
    }

    try {
      // First delete all guest_events records for this event
      const { error: guestEventError } = await supabase
        .from('guest_events')
        .delete()
        .eq('event_id', eventId);

      if (guestEventError) {
        console.error("Error deleting guest events:", guestEventError);
        throw guestEventError;
      }

      // Then delete the event itself
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;

      toast.success("Event deleted successfully");
      onSuccess();
    } catch (error: any) {
      console.error("Delete error:", error);
      toast.error("Error deleting event: " + error.message);
    }
  };

  const startEditEvent = (event: Event) => {
    console.log("Starting edit for event:", event);
    setEditingEvent(event);
    
    // Format the date for datetime-local input
    // The date from the database is in UTC format
    let formattedDate = "";
    if (event.date) {
      try {
        // Parse the UTC date string from the database
        const utcDate = new Date(event.date);
        console.log("Original UTC date from DB:", utcDate.toISOString());
        
        // Convert to local timezone for the input field (which needs YYYY-MM-DDThh:mm format)
        formattedDate = utcDate.toISOString().slice(0, 16);
        console.log("Formatted local date for input:", formattedDate);
      } catch (error) {
        console.error("Error formatting date:", error);
        formattedDate = "";
      }
    }
    
    setEventFormData({
      name: event.name || "",
      date: formattedDate,
      location: event.location || "",
      description: event.description || "",
    });
  };

  return {
    showEventForm,
    setShowEventForm,
    editingEvent,
    eventFormData,
    setEventFormData,
    handleCreateEvent,
    handleUpdateEvent,
    handleDeleteEvent,
    startEditEvent,
  };
};
