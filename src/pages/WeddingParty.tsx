
import { motion } from "framer-motion";
import { WeddingParty as WeddingPartyComponent } from "@/components/WeddingParty";

const WeddingParty = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-white"
    >
      <WeddingPartyComponent />
    </motion.div>
  );
};

export default WeddingParty;
