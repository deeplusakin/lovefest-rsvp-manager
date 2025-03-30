
import { motion } from "framer-motion";
import { RsvpForm } from "@/components/RsvpForm";

const Rsvp = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen"
    >
      <RsvpForm />
    </motion.div>
  );
};

export default Rsvp;
