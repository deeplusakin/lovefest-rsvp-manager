
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { Navigation } from "@/components/Navigation";
import Index from "@/pages/Index";
import OurStory from "@/pages/OurStory";
import Photos from "@/pages/Photos";
import WeddingParty from "@/pages/WeddingParty";
import QAndA from "@/pages/QAndA";
import Travel from "@/pages/Travel";
import ThingsToDo from "@/pages/ThingsToDo";
import Registry from "@/pages/Registry";
import RsvpDetails from "@/pages/RsvpDetails";
import Admin from "@/pages/Admin";
import NotFound from "@/pages/NotFound";

const App = () => {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/our-story" element={<OurStory />} />
        <Route path="/photos" element={<Photos />} />
        <Route path="/wedding-party" element={<WeddingParty />} />
        <Route path="/q-and-a" element={<QAndA />} />
        <Route path="/travel" element={<Travel />} />
        <Route path="/things-to-do" element={<ThingsToDo />} />
        <Route path="/registry" element={<Registry />} />
        <Route path="/rsvp" element={<RsvpDetails />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
};

export default App;
