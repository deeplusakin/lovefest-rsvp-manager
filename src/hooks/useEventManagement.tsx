
import { useState } from "react";
import { Event, EventFormData } from "@/types/admin";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
      onSuccess();
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
      onSuccess();
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
