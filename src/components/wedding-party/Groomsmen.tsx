
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
    id: 7,
    name: "Taurean",
    role: "Groomsman",
    image: "/lovable-uploads/3f0413f8-b63c-4f28-9edf-fb2935ab2cdc.png",
    description: "Brother of the groom"
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
    id: 5,
    name: "Robert",
    role: "Groomsman",
    image: "/placeholder.svg",
    description: "Cousin of the groom"
  },
  {
    id: 6,
    name: "Daniel",
    role: "Groomsman",
    image: "/placeholder.svg",
    description: "Friend from work"
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-serif">{groomsman.name}</h3>
                  <p className="text-lg font-light text-gray-200">{groomsman.role}</p>
                  <p className="text-sm text-gray-300 mt-2">{groomsman.description}</p>
                </div>
              </div>
              
              {/* Name tag at the bottom */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 py-3 px-4 text-white">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 border-2 border-primary">
                    <AvatarImage src={groomsman.image} alt={groomsman.name} />
                    <AvatarFallback>{groomsman.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="text-sm font-medium">{groomsman.name}</h4>
                    <p className="text-xs text-gray-300">{groomsman.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
