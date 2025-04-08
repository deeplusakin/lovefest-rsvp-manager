
import { motion } from "framer-motion";
import { RsvpContainer } from "@/components/rsvp/RsvpContainer";
import { ContributionWall } from "@/components/ContributionWall";

const Rsvp = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen"
    >
      <RsvpContainer />
      <ContributionWall />
    </motion.div>
  );
};

export default Rsvp;
