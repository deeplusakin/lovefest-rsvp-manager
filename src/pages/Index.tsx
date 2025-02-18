
import { Hero } from "@/components/Hero";
import { WeddingDetails } from "@/components/WeddingDetails";
import { WeddingParty } from "@/components/WeddingParty";
import { RsvpForm } from "@/components/RsvpForm";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <WeddingDetails />
      <WeddingParty />
      <RsvpForm />
    </div>
  );
};

export default Index;
