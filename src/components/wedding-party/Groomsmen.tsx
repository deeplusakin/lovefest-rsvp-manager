
import { motion } from "framer-motion";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// Updated data for groomsmen with the new images and corrected information
const groomsmen = [
  {
    id: 3,
    name: "James",
    role: "Best Man",
    image: "/lovable-uploads/cbabbf3b-60a7-4aca-a5dd-308937677595.png",
    description: "Groom's cousin"
  },
  {
    id: 1,
    name: "Willie",
    role: "Groomsman",
    image: "/lovable-uploads/4bfd7ea2-6667-414e-8d10-0a25a7f257b9.png",
    description: "Groom's brother-in-law"
  },
  {
    id: 2,
    name: "Jay",
    role: "Groomsman",
    image: "/lovable-uploads/a5470348-9227-41da-a7c5-f994b923d02d.png",
    description: "Groom's brother-in-law"
  },
  {
    id: 4,
    name: "Joharri",
    role: "Groomsman",
    image: "/lovable-uploads/3a14f142-3298-466c-a01d-0e8e323d2fb2.png",
    description: "Close friend of the groom"
  },
  {
    id: 8,
    name: "Cody",
    role: "Groomsman",
    image: "/lovable-uploads/13cc9513-29be-4573-8c43-9afaea39e3ae.png",
    description: "Close friend of the groom"
  },
  {
    id: 9,
    name: "Djibril",
    role: "Groomsman",
    image: "/lovable-uploads/583f0616-7458-45cc-95a9-65cbeb479773.png",
    description: "Brother-in-law of the groom"
  },
  {
    id: 10,
    name: "Moses",
    role: "Groomsman",
    image: "/lovable-uploads/ceaf1077-d65b-430c-9270-58fde1c429ab.png",
    description: "Close friend of the groom"
  },
  {
    id: 11,
    name: "Wesley",
    role: "Groomsman",
    image: "/lovable-uploads/e33316e6-3358-464a-82b2-f696a5b47661.png",
    description: "Groom's friend"
  }
];

export const Groomsmen = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container max-w-7xl">
        <h2 className="text-3xl md:text-4xl font-serif text-center mb-12">Groomsmen</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {groomsmen.map((groomsman, index) => (
            <motion.div
              key={groomsman.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={groomsman.image}
                  alt={groomsman.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <h3 className="text-2xl font-serif text-white">{groomsman.name}</h3>
                <p className="text-lg font-light text-gray-200">{groomsman.role}</p>
                <p className="text-sm text-gray-300 mt-2">{groomsman.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
