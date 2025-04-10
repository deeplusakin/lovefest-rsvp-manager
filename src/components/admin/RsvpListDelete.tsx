
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface RsvpListDeleteProps {
  eventId: string;
  onDeleteComplete: () => void;
}

export const RsvpListDelete = ({ eventId, onDeleteComplete }: RsvpListDeleteProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  
  const handleDelete = async () => {
    setIsDeleting(true);
    
    try {
      // Delete all guest_events records for this event
      const { error, count } = await supabase
        .from('guest_events')
        .delete()
        .eq('event_id', eventId)
        .select('count');
      
      if (error) throw error;
      
      toast.success(`Deleted all RSVP records for this event`);
      onDeleteComplete();
    } catch (error) {
      console.error('Error deleting RSVP records:', error);
      toast.error("Error deleting RSVP records");
    } finally {
      setIsDeleting(false);
      setShowConfirmDialog(false);
    }
  };
  
  return (
    <>
      <Button 
        variant="destructive"
        size="sm"
        onClick={() => setShowConfirmDialog(true)}
        disabled={isDeleting}
        className="flex items-center gap-1"
      >
        <Trash2 className="h-4 w-4" />
        Delete All RSVPs
      </Button>
      
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete all RSVP records?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. All RSVP responses for this event will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete all RSVPs"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
