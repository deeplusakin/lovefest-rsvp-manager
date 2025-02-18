
import { motion } from "framer-motion";

const partyMembers = [
  {
    name: "Emma Thompson",
    role: "Maid of Honor",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
  },
  {
    name: "James Wilson",
    role: "Best Man",
    image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b",
  },
];

export const WeddingParty = () => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container max-w-6xl">
        <h2 className="text-4xl md:text-5xl font-serif text-center mb-16">Wedding Party</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {partyMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-lg"
            >
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl font-serif">{member.name}</h3>
                  <p className="text-sm font-light">{member.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
