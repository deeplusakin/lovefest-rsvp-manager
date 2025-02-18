
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const partyMembers = [
  {
    name: "Emma Thompson",
    role: "Maid of Honor",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    description: "Best friend since college"
  },
  {
    name: "James Wilson",
    role: "Best Man",
    image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b",
    description: "Brother and closest friend"
  },
  {
    name: "Sarah Parker",
    role: "Bridesmaid",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    description: "Childhood friend"
  },
  {
    name: "Michael Chen",
    role: "Groomsman",
    image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b",
    description: "College roommate"
  },
  {
    name: "Laura Martinez",
    role: "Bridesmaid",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    description: "Sister of the bride"
  },
  {
    name: "David Thompson",
    role: "Groomsman",
    image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b",
    description: "Brother of the groom"
  }
];

export const WeddingParty = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section ref={ref} className="py-24 bg-gray-50 relative overflow-hidden">
      <motion.div 
        style={{ y }}
        className="container max-w-6xl"
      >
        <h2 className="text-4xl md:text-5xl font-serif text-center mb-16">Wedding Party</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {partyMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <div className="aspect-[3/4] overflow-hidden bg-gray-100">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-serif">{member.name}</h3>
                  <p className="text-lg font-light text-gray-200">{member.role}</p>
                  <p className="text-sm text-gray-300 mt-2">{member.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};
