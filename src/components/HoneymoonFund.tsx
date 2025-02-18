
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const HoneymoonFund = () => {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [venmoUsername, setVenmoUsername] = useState("u/Akin-Walker");
  const [isLoading, setIsLoading] = useState(false);

  const handleVenmoContribute = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const venmoUrl = `https://venmo.com/${venmoUsername}?txn=pay&note=${encodeURIComponent(
        `Wedding Gift: ${message}`
      )}&amount=${amount}`;
      window.open(venmoUrl, "_blank");
      toast.success("Thank you for your contribution!");
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
      <div className="container max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-serif mb-4">Honeymoon Fund</h2>
          <p className="text-muted-foreground">
            Help us create unforgettable memories on our honeymoon adventure
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Venmo Card */}
          <Card>
            <CardHeader>
              <CardTitle>Contribute via Venmo</CardTitle>
              <CardDescription>Send your gift through Venmo</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleVenmoContribute} className="space-y-6">
                <div className="space-y-2">
                  <Input
                    id="amount"
                    type="number"
                    min="1"
                    step="0.01"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="text-lg"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message (Optional)</Label>
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
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-serif text-lg py-6"
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Send Gift via Venmo"}
                </Button>

                <p className="text-sm text-center text-muted-foreground">
                  Venmo username: {venmoUsername}
                </p>
              </form>
            </CardContent>
          </Card>

          {/* Zelle Card */}
          <Card>
            <CardHeader>
              <CardTitle>Contribute via Zelle</CardTitle>
              <CardDescription>Scan the QR code to send your gift through Zelle</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <img 
                src="/lovable-uploads/f5cb6e4f-c3cb-4615-a360-4d861bb66f02.png"
                alt="Zelle QR Code"
                className="w-48 h-48 object-contain"
              />
              <p className="text-sm text-center text-muted-foreground">
                Open your Zelle app and scan this QR code to contribute
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
