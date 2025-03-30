
import { motion } from "framer-motion";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// Bridesmaid data with the uploaded images
const bridesmaids = [
  {
    id: 1,
    name: "Kendra",
    role: "Maid of Honor",
    image: "/lovable-uploads/cef65e5e-a3c7-44a3-8f57-d7fc0830e24c.png",
    description: "Friend since college"
  },
  {
    id: 2,
    name: "Tia",
    role: "Bridesmaid",
    image: "/lovable-uploads/e2904cc0-c103-44d5-b314-c353f0e2cf6a.png",
    description: "Childhood friend"
  },
  {
    id: 3,
    name: "Tasha",
    role: "Bridesmaid",
    image: "/lovable-uploads/49ff2d0a-afeb-46a3-87fd-6ea0c0942a62.png",
    description: "Cousin of the bride"
  },
  {
    id: 4,
    name: "Ashley",
    role: "Bridesmaid",
    image: "/lovable-uploads/0fe0d02a-a702-4bc0-aed6-99a1b0ce3c59.png",
    description: "College roommate"
  },
  {
    id: 5,
    name: "Brittany",
    role: "Bridesmaid",
    image: "/lovable-uploads/7031ec37-7517-4ced-8586-c04a4a727524.png",
    description: "Bride's sister"
  },
  {
    id: 6,
    name: "Krystal",
    role: "Bridesmaid",
    image: "/lovable-uploads/5c4399a8-8df6-46e7-a8c7-895ccd0dfa6d.png",
    description: "Friend from work"
  }
];

export const Bridesmaids = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container max-w-7xl">
        <h2 className="text-3xl md:text-4xl font-serif text-center mb-12">Bridesmaids</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bridesmaids.map((bridesmaid, index) => (
            <motion.div
              key={bridesmaid.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={bridesmaid.image}
                  alt={bridesmaid.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-serif">{bridesmaid.name}</h3>
                  <p className="text-lg font-light text-gray-200">{bridesmaid.role}</p>
                  <p className="text-sm text-gray-300 mt-2">{bridesmaid.description}</p>
                </div>
              </div>
              
              {/* Name tag at the bottom */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 py-3 px-4 text-white">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 border-2 border-primary">
                    <AvatarImage src={bridesmaid.image} alt={bridesmaid.name} />
                    <AvatarFallback>{bridesmaid.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="text-sm font-medium">{bridesmaid.name}</h4>
                    <p className="text-xs text-gray-300">{bridesmaid.role}</p>
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
