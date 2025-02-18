
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Admin from "@/pages/Admin";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import ThingsToDo from "@/pages/ThingsToDo";
import OurStory from "@/pages/OurStory";
import Photos from "@/pages/Photos";
import WeddingParty from "@/pages/WeddingParty";
import QAndA from "@/pages/QAndA";
import Travel from "@/pages/Travel";
import Registry from "@/pages/Registry";
import { Navigation } from "@/components/Navigation";
import "@/App.css";

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/our-story" element={<OurStory />} />
            <Route path="/photos" element={<Photos />} />
            <Route path="/wedding-party" element={<WeddingParty />} />
            <Route path="/q-and-a" element={<QAndA />} />
            <Route path="/travel" element={<Travel />} />
            <Route path="/things-to-do" element={<ThingsToDo />} />
            <Route path="/registry" element={<Registry />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
