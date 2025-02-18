
import { motion } from "framer-motion";

const Registry = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-white py-24"
    >
      <div className="container max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-serif text-center mb-12">Registry</h1>
        <div className="space-y-8">
          {/* Add registry content here */}
        </div>
      </div>
    </motion.div>
  );
};

export default Registry;
