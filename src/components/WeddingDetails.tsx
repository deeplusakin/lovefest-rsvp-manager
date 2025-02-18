
import { Calendar, MapPin } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export const WeddingDetails = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section ref={ref} className="py-24 bg-white relative overflow-hidden">
      <motion.div 
        style={{ y }}
        className="container max-w-5xl"
      >
        <h2 className="text-4xl md:text-5xl font-serif text-center mb-16">The Details</h2>
        <div className="grid md:grid-cols-2 gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="p-8 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4 mb-4">
                <Calendar className="w-6 h-6 text-accent" />
                <h3 className="text-2xl font-serif">Ceremony</h3>
              </div>
              <p className="text-secondary mb-2">Saturday, September 21, 2024</p>
              <p className="text-secondary">4:00 PM - 5:00 PM</p>
            </div>
            <div className="p-8 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4 mb-4">
                <MapPin className="w-6 h-6 text-accent" />
                <h3 className="text-2xl font-serif">Reception</h3>
              </div>
              <p className="text-secondary mb-2">The Grand Hotel</p>
              <p className="text-secondary">123 Elegance Way, Beverly Hills</p>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative h-[400px] md:h-full"
          >
            <img
              src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05"
              alt="Venue"
              className="absolute inset-0 w-full h-full object-cover rounded-lg"
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};
