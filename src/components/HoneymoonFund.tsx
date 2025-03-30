
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Gift, DollarSign, Heart } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const HoneymoonFund = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [venmoUsername] = useState("u/Akin-Walker");
  const [honeyfundUrl] = useState("https://www.honeyfund.com/site/walker-allen-08-30-2025");

  const handleVenmoContribute = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const venmoUrl = `https://venmo.com/${venmoUsername}?txn=pay`;
      window.open(venmoUrl, "_blank");
      toast.success("Thank you for your contribution!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHoneyfundContribute = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      window.open(honeyfundUrl, "_blank");
      toast.success("Thank you for visiting our Honeyfund!");
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

        <div className="grid md:grid-cols-3 gap-8">
          {/* Venmo Card */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Contribute via Venmo</CardTitle>
              <CardDescription>Send your gift through Venmo</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-center items-center">
              <form onSubmit={handleVenmoContribute} className="space-y-6 w-full flex flex-col items-center">
                <Button
                  type="submit"
                  className="w-36 h-36 rounded-full bg-accent hover:bg-accent/90 text-accent-foreground font-serif text-lg shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl flex flex-col items-center justify-center text-center px-4 gap-2"
                  disabled={isLoading}
                >
                  <DollarSign size={32} />
                  {isLoading ? "Processing..." : "Venmo"}
                </Button>

                <p className="text-sm text-center text-muted-foreground mt-4">
                  Venmo username: {venmoUsername}
                </p>
              </form>
            </CardContent>
          </Card>

          {/* Honeyfund Card */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Contribute via Honeyfund</CardTitle>
              <CardDescription>Visit our Honeyfund registry</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-center items-center">
              <form onSubmit={handleHoneyfundContribute} className="space-y-6 w-full flex flex-col items-center">
                <Button
                  type="submit"
                  className="w-36 h-36 rounded-full bg-[#D6BCFA] hover:bg-[#D6BCFA]/90 text-primary font-serif text-lg shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl flex flex-col items-center justify-center text-center px-4 gap-2"
                  disabled={isLoading}
                >
                  <Heart size={32} fill="#9b87f5" />
                  {isLoading ? "Processing..." : "Honeyfund"}
                </Button>

                <p className="text-sm text-center text-muted-foreground mt-4">
                  Our dedicated Honeyfund registry
                </p>
              </form>
            </CardContent>
          </Card>

          {/* Zelle Card */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Contribute via Zelle</CardTitle>
              <CardDescription>Scan the QR code to send your gift through Zelle</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center space-y-4">
              <div className="w-36 h-36 flex justify-center items-center">
                <img 
                  src="/lovable-uploads/f5cb6e4f-c3cb-4615-a360-4d861bb66f02.png"
                  alt="Zelle QR Code"
                  className="w-full h-full object-contain"
                />
              </div>
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
