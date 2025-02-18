
import { Hero } from "@/components/Hero";
import { WeddingDetails } from "@/components/WeddingDetails";
import { WeddingParty } from "@/components/WeddingParty";
import { RsvpForm } from "@/components/RsvpForm";
import { HoneymoonFund } from "@/components/HoneymoonFund";
import { ContributionWall } from "@/components/ContributionWall";

const Index = () => {
  return (
    <main className="relative">
      <div className="flex">
        <Hero />
        <WeddingDetails />
      </div>
      <div className="relative z-10 bg-white">
        <WeddingParty />
        <RsvpForm />
        <HoneymoonFund />
        <ContributionWall />
      </div>
    </main>
  );
};

export default Index;
