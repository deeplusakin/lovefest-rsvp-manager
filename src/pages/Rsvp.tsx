
import { motion } from "framer-motion";
import { RsvpForm } from "@/components/RsvpForm";
import { ContributionWall } from "@/components/ContributionWall";

const Rsvp = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen"
    >
      <RsvpForm />
      <ContributionWall />
    </motion.div>
  );
};

export default Rsvp;
