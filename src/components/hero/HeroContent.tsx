
import { motion } from "framer-motion";

export const HeroContent = ({ opacity }: { opacity: any }) => {
  return (
    <motion.div style={{ opacity }} className="relative z-10 text-center text-white px-4">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-lg font-light tracking-widest mb-4"
      >
        August 30, 2025
      </motion.h2>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-6xl md:text-7xl lg:text-8xl font-serif mb-6"
      >
        Dearborne & Akin
      </motion.h1>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-lg font-light tracking-wide"
      >
        Join us for our celebration of love
      </motion.div>
    </motion.div>
  );
};
