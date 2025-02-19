
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Photo, PhotoRow } from "@/types/photos";

export const WeddingParty = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const [partyMembers, setPartyMembers] = useState<Photo[]>([]);

  useEffect(() => {
    const fetchWeddingParty = async () => {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .eq('type', 'wedding-party')
        .order('sort_order');

      if (error) {
        console.error('Error fetching wedding party:', error);
        return;
      }

      console.log('Wedding party data:', data); // Debug log

      // Convert the Supabase response type to our Photo type
      const typedData = (data as PhotoRow[]).map(photo => {
        // Ensure URL is properly formatted
        const formattedUrl = photo.url.startsWith('/')
          ? photo.url
          : `/${photo.url}`;
        
        console.log('Formatted URL for photo:', formattedUrl); // Debug log
        
        return {
          ...photo,
          url: formattedUrl,
          type: photo.type as 'hero' | 'gallery' | 'wedding-party'
        };
      });

      setPartyMembers(typedData);
    };

    fetchWeddingParty();
  }, []);

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
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <div className="aspect-[3/4] overflow-hidden bg-gray-100">
                <img
                  src={member.url}
                  alt={member.title || ''}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    console.error('Image failed to load:', member.url);
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-serif">{member.title}</h3>
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
