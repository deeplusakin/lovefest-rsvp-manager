
import { motion } from "framer-motion";
import { Coffee, Utensils, Shop, Mountain, Music } from "lucide-react";

const ThingsToDo = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-white py-24"
    >
      <div className="container max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-serif text-center mb-12">Things to Do</h1>
        <div className="space-y-12">
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Shop className="w-6 h-6 text-accent" />
              <h2 className="text-2xl font-serif">Historic Main Street</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Explore the charming historic district of Ellicott City, featuring unique boutiques, 
              antique shops, and art galleries. The venue is located in the heart of this historic area.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4">
              <Coffee className="w-6 h-6 text-accent" />
              <h2 className="text-2xl font-serif">Local Cafes</h2>
            </div>
            <ul className="space-y-2 text-gray-600">
              <li>• Bean Hollow - Cozy coffee shop with fresh pastries</li>
              <li>• Little Market Cafe - Charming spot with outdoor seating</li>
              <li>• Cafe EZ - Modern cafe with great breakfast options</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4">
              <Utensils className="w-6 h-6 text-accent" />
              <h2 className="text-2xl font-serif">Dining</h2>
            </div>
            <ul className="space-y-2 text-gray-600">
              <li>• Phoenix Upper Main - Upscale American cuisine</li>
              <li>• Manor Hill Tavern - Craft beer and elevated pub fare</li>
              <li>• Ellicott Mills Brewing Company - Local brewery and restaurant</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4">
              <Mountain className="w-6 h-6 text-accent" />
              <h2 className="text-2xl font-serif">Outdoor Activities</h2>
            </div>
            <ul className="space-y-2 text-gray-600">
              <li>• Patapsco Valley State Park - Hiking and scenic views</li>
              <li>• B&O Railroad Museum - Historic railway exhibits</li>
              <li>• Centennial Park - Walking trails and lake views</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4">
              <Music className="w-6 h-6 text-accent" />
              <h2 className="text-2xl font-serif">Entertainment</h2>
            </div>
            <p className="text-gray-600">
              Check out live music at The Judge's Bench, catch a show at Toby's Dinner Theatre, 
              or enjoy evening entertainment at one of Main Street's various venues.
            </p>
          </section>
        </div>
      </div>
    </motion.div>
  );
};

export default ThingsToDo;
