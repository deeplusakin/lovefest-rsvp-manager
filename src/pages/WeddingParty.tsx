
import { motion } from "framer-motion";
import { WeddingParty as WeddingPartyComponent } from "@/components/WeddingParty";

const WeddingParty = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-white py-24"
    >
      <div className="container">
        <h1 className="text-4xl md:text-5xl font-serif text-center mb-12">Wedding Party</h1>
        <WeddingPartyComponent />
      </div>
    </motion.div>
  );
};

export default WeddingParty;
