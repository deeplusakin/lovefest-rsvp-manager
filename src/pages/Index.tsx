
import { Hero } from "@/components/Hero";
import { WeddingDetails } from "@/components/WeddingDetails";
import { RsvpForm } from "@/components/RsvpForm";
import { HoneymoonFund } from "@/components/HoneymoonFund";
import { ContributionWall } from "@/components/ContributionWall";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <main>
      <Hero />
      <WeddingDetails />
      <RsvpForm />
      <HoneymoonFund />
      <ContributionWall />
      <footer className="py-8 text-center text-sm text-muted-foreground border-t">
        <div className="container">
          <p>© 2024 Dearborne & Akin Wedding</p>
          <Link 
            to="/admin" 
            className="mt-2 inline-block text-xs hover:underline"
          >
            Admin Access
          </Link>
        </div>
      </footer>
    </main>
  );
};

export default Index;
