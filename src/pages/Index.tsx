
import { Hero } from "@/components/Hero";
import { WeddingDetails } from "@/components/WeddingDetails";
import { RsvpForm } from "@/components/RsvpForm";
import { HoneymoonFund } from "@/components/HoneymoonFund";
import { ContributionWall } from "@/components/ContributionWall";

const Index = () => {
  return (
    <main>
      <Hero />
      <WeddingDetails />
      <RsvpForm />
      <HoneymoonFund />
      <ContributionWall />
    </main>
  );
};

export default Index;
