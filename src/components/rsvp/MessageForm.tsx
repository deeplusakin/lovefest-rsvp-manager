
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface MessageFormProps {
  message: string;
  isSubmitting: boolean;
  onMessageChange: (value: string) => void;
  onSubmit: () => void;
}

export const MessageForm = ({ message, isSubmitting, onMessageChange, onSubmit }: MessageFormProps) => {
  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">Share a Message</h3>
      <div className="space-y-4">
        <Textarea
          placeholder="Write a message for the couple..."
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          className="min-h-[100px]"
        />
        <Button 
          onClick={onSubmit}
          disabled={isSubmitting || !message.trim()}
          className="w-full"
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </Button>
      </div>
    </Card>
  );
};
