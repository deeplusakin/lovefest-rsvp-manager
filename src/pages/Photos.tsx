
import { motion } from "framer-motion";

const Photos = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-white py-24"
    >
      <div className="container max-w-7xl">
        <h1 className="text-4xl md:text-5xl font-serif text-center mb-12">Photos</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Add photo grid here */}
        </div>
      </div>
    </motion.div>
  );
};

export default Photos;
