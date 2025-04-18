
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
                <h3 className="text-2xl font-serif">Ceremony & Reception</h3>
              </div>
              <p className="text-secondary mb-2">Saturday, August 30, 2025</p>
              <p className="text-secondary">5:00 PM - 11:00 PM</p>
            </div>
            <div className="p-8 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4 mb-4">
                <MapPin className="w-6 h-6 text-accent" />
                <h3 className="text-2xl font-serif">Venue</h3>
              </div>
              <p className="text-secondary mb-2">Main Street Ballroom</p>
              <p className="text-secondary mb-4">8390 Main Street, Ellicott City, MD 21043</p>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="text-lg font-serif mb-2">Parking Information</h4>
                <p className="text-secondary">Complimentary parking is available in the venue's main lot. Put 'Lot D Ellicott City' in the GPS.</p>
              </div>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative h-[400px] md:h-full"
          >
            <img
              src="/lovable-uploads/db7566be-e769-4bdd-9440-f835bee825c8.png"
              alt="Main Street Ballroom venue exterior"
              className="absolute inset-0 w-full h-full object-cover rounded-lg"
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};
