
import { Hero } from "@/components/Hero";
import { WeddingDetails } from "@/components/WeddingDetails";
import { HoneymoonFund } from "@/components/HoneymoonFund";
import Countdown from "@/components/Countdown";

const Index = () => {
  return (
    <main className="pt-16">
      <Hero />
      <Countdown />
      <WeddingDetails />
      <HoneymoonFund />
    </main>
  );
};

export default Index;
