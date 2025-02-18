
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const HoneymoonFund = () => {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [venmoUsername, setVenmoUsername] = useState("@Akin-Walker");
  const [isLoading, setIsLoading] = useState(false);

  const handleContribute = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Open Venmo in a new tab
      const venmoUrl = `https://venmo.com/${venmoUsername}?txn=pay&note=${encodeURIComponent(
        `Wedding Gift: ${message}`
      )}&amount=${amount}`;
      window.open(venmoUrl, "_blank");

      // Show success message
      toast.success("Thank you for your contribution!");
      
      // Reset form
      setAmount("");
      setMessage("");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-12 bg-gradient-to-b from-primary/10 to-background">
      <div className="container max-w-md">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-serif mb-4">Honeymoon Fund</h2>
          <p className="text-muted-foreground">
            Help us create unforgettable memories on our honeymoon adventure
          </p>
        </div>

        <form onSubmit={handleContribute} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="amount">Contribution Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              min="1"
              step="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="text-lg"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Add a Message (Optional)</Label>
            <Input
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message here"
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Contribute via Venmo"}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>All contributions will be processed through Venmo.</p>
          <p>Our Venmo username: {venmoUsername}</p>
        </div>
      </div>
    </section>
  );
};
