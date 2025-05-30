import { motion } from "framer-motion";

// Bridesmaid data with the uploaded images
const bridesmaids = [
  {
    id: 8,
    name: "Dyrolyn",
    role: "Maid of Honor",
    image: "/lovable-uploads/baa31bf1-4749-4853-a841-9dbe8b612e5d.png",
    description: "Bride's sister"
  },
  {
    id: 1,
    name: "Tarlough",
    role: "Bridesmaid",
    image: "/lovable-uploads/cef65e5e-a3c7-44a3-8f57-d7fc0830e24c.png",
    description: "Cousin of the bride"
  },
  {
    id: 2,
    name: "Dekontee",
    role: "Maid of Honor",
    image: "/lovable-uploads/166860cc-b572-4417-9637-a8fbf73eee46.png",
    description: "Bride's sister"
  },
  {
    id: 3,
    name: "Hectorlyne",
    role: "Bridesmaid",
    image: "/lovable-uploads/49ff2d0a-afeb-46a3-87fd-6ea0c0942a62.png",
    description: "Childhood friend"
  },
  {
    id: 4,
    name: "Naweh",
    role: "Bridesmaid",
    image: "/lovable-uploads/0fe0d02a-a702-4bc0-aed6-99a1b0ce3c59.png",
    description: "Bride's cousin"
  },
  {
    id: 5,
    name: "Pamgrace",
    role: "Bridesmaid",
    image: "/lovable-uploads/7031ec37-7517-4ced-8586-c04a4a727524.png",
    description: "Childhood friend"
  },
  {
    id: 6,
    name: "Charlene",
    role: "Bridesmaid",
    image: "/lovable-uploads/92910388-2f73-4a82-b1c7-5487df58bfb6.png",
    description: "Friend since college"
  },
  {
    id: 7,
    name: "Onike",
    role: "Bridesmaid",
    image: "/lovable-uploads/9d486789-1af7-4c16-bad9-c2f74eb96d45.png",
    description: "Bride's sister-in-law"
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <h3 className="text-2xl font-serif text-white">{bridesmaid.name}</h3>
                <p className="text-lg font-light text-gray-200">{bridesmaid.role}</p>
                <p className="text-sm text-gray-300 mt-2">{bridesmaid.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
