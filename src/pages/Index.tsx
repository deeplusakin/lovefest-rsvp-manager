
import { Hero } from "@/components/Hero";
import { WeddingDetails } from "@/components/WeddingDetails";
import { RsvpForm } from "@/components/RsvpForm";
import { HoneymoonFund } from "@/components/HoneymoonFund";
import { ContributionWall } from "@/components/ContributionWall";
import Countdown from "@/components/Countdown";

const Index = () => {
  return (
    <main className="pt-16">
      <Hero />
      <Countdown />
      <WeddingDetails />
      <RsvpForm />
      <HoneymoonFund />
      <ContributionWall />
    </main>
  );
};

export default Index;
