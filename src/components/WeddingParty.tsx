
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Bridesmaids } from "./wedding-party/Bridesmaids";
import { Groomsmen } from "./wedding-party/Groomsmen";

export const WeddingParty = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section ref={ref} className="relative overflow-hidden">
      <motion.div style={{ y }}>
        <div className="py-12 bg-accent/10">
          <div className="container max-w-6xl">
            <h2 className="text-4xl md:text-5xl font-serif text-center mb-16">Wedding Party</h2>
            <p className="text-lg text-center text-gray-600 max-w-3xl mx-auto mb-12">
              Meet the amazing people who will be standing by our side on our special day. We are blessed to have such wonderful friends and family supporting us.
            </p>
          </div>
        </div>
        
        {/* Bridesmaids section */}
        <Bridesmaids />
        
        {/* Groomsmen section */}
        <Groomsmen />
      </motion.div>
    </section>
  );
};
