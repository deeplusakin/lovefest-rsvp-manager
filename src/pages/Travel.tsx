
import { motion } from "framer-motion";
import { Car, Hotel, Plane } from "lucide-react";
import { EditableContent } from "@/components/EditableContent";

const Travel = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-white py-24"
    >
      <div className="container max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-serif text-center mb-12">Travel</h1>
        <div className="space-y-12">
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Plane className="w-6 h-6 text-accent" />
              <h2 className="text-2xl font-serif">Flying In</h2>
            </div>
            <EditableContent 
              pageId="travel" 
              sectionId="flying-in"
              renderMarkdown={true}
              className="text-gray-600"
            />
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4">
              <Hotel className="w-6 h-6 text-accent" />
              <h2 className="text-2xl font-serif">Where to Stay</h2>
            </div>
            <EditableContent 
              pageId="travel" 
              sectionId="accommodations-intro"
              renderMarkdown={true}
              className="text-gray-600 mb-4"
            />
            <ul className="space-y-4">
              <li className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">DoubleTree by Hilton Columbia</h3>
                <EditableContent 
                  pageId="travel" 
                  sectionId="hotel-1"
                  className="text-gray-600"
                />
              </li>
              <li className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Turf Valley Resort</h3>
                <EditableContent 
                  pageId="travel" 
                  sectionId="hotel-2"
                  className="text-gray-600"
                />
              </li>
              <li className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Residence Inn by Marriott</h3>
                <EditableContent 
                  pageId="travel" 
                  sectionId="hotel-3"
                  className="text-gray-600"
                />
              </li>
              <li className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Sonesta ES Suites Columbia</h3>
                <EditableContent 
                  pageId="travel" 
                  sectionId="hotel-4"
                  className="text-gray-600"
                />
              </li>
              <li className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Courtyard by Marriott</h3>
                <EditableContent 
                  pageId="travel" 
                  sectionId="hotel-5"
                  className="text-gray-600"
                />
              </li>
              <li className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Hampton Inn Columbia</h3>
                <EditableContent 
                  pageId="travel" 
                  sectionId="hotel-6"
                  className="text-gray-600"
                />
              </li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4">
              <Car className="w-6 h-6 text-accent" />
              <h2 className="text-2xl font-serif">Getting Around</h2>
            </div>
            <EditableContent 
              pageId="travel" 
              sectionId="transportation"
              renderMarkdown={true}
              className="text-gray-600"
            />
          </section>
        </div>
      </div>
    </motion.div>
  );
};

export default Travel;
