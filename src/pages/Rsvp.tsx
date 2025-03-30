
import { motion } from "framer-motion";
import { RsvpForm } from "@/components/RsvpForm";
import { ContributionWall } from "@/components/ContributionWall";
import { EditableContent } from "@/components/EditableContent";
import { Card } from "@/components/ui/card";

const Rsvp = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen"
    >
      <RsvpForm />
      <section className="py-8 bg-accent/5">
        <div className="container max-w-4xl">
          <Card className="p-6">
            <h2 className="text-3xl font-serif text-center mb-4">Registry</h2>
            <div className="text-center text-muted-foreground mb-6">
              <EditableContent 
                pageId="registry" 
                sectionId="main"
                className="max-w-2xl mx-auto" 
              />
            </div>
          </Card>
        </div>
      </section>
      <ContributionWall />
    </motion.div>
  );
};

export default Rsvp;
