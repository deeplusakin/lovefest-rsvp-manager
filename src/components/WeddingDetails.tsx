
import { Calendar, MapPin, Book, Image, Users, MessageSquare, Plane, Activity, Gift } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export const WeddingDetails = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

  const sections = [
    { icon: Book, title: "Our Story", content: "The tale of how we met and fell in love..." },
    { icon: Image, title: "Photos", content: "Moments we've shared together..." },
    { icon: Users, title: "Wedding Party", content: "Meet our wonderful wedding party..." },
    { icon: MessageSquare, title: "Q&A", content: "Frequently asked questions about our special day..." },
    { icon: Plane, title: "Travel", content: "Information about getting here and accommodation..." },
    { icon: Activity, title: "Things to Do", content: "Explore the area and local attractions..." },
    { icon: Gift, title: "Registry", content: "Help us start our new life together..." }
  ];

  return (
    <section ref={ref} className="min-h-screen relative">
      <div className="absolute top-0 right-0 w-1/2 min-h-screen bg-white">
        <motion.div 
          style={{ y }}
          className="p-12 md:p-24 space-y-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif mb-16">The Details</h2>
          
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group space-y-4"
            >
              <div className="flex items-center gap-4">
                <section.icon className="w-6 h-6 text-accent" />
                <h3 className="text-2xl font-serif">{section.title}</h3>
              </div>
              <p className="text-secondary pl-10">{section.content}</p>
              <div className="h-px bg-gray-100 mt-8" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
