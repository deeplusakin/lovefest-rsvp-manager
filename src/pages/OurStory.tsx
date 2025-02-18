
import { motion } from "framer-motion";

const OurStory = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-white py-24"
    >
      <div className="container max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-serif text-center mb-12">Our Story</h1>
        <div className="prose prose-lg max-w-none">
          <p>
            Our journey began in the heart of the city, where a chance encounter at a local café
            sparked what would become an incredible love story...
          </p>
          {/* Add more story content here */}
        </div>
      </div>
    </motion.div>
  );
};

export default OurStory;
