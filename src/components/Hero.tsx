
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export const Hero = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

  return (
    <section ref={ref} className="relative min-h-screen flex">
      <motion.div 
        style={{ scale }}
        className="fixed top-0 left-0 w-1/2 h-screen bg-[url('https://images.unsplash.com/photo-1469474968028-56623f02e42e')] 
        bg-cover bg-center brightness-50"
      />
      <motion.div 
        style={{ opacity }} 
        className="fixed top-1/2 left-[25%] -translate-x-1/2 -translate-y-1/2 text-center text-white z-10"
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-lg font-light tracking-widest mb-4"
        >
          September 21, 2024
        </motion.h2>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-6xl md:text-7xl lg:text-8xl font-serif mb-6"
        >
          Sarah & Michael
        </motion.h1>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg font-light tracking-wide"
        >
          Join us for our celebration of love
        </motion.div>
      </motion.div>
    </section>
  );
};
