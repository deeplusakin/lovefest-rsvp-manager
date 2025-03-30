
import { motion } from "framer-motion";
import { EditableContent } from "@/components/EditableContent";

const QAndA = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-white py-24"
    >
      <div className="container max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-serif text-center mb-12">Q&A</h1>
        <div className="prose prose-lg max-w-none">
          <EditableContent 
            pageId="q-and-a" 
            sectionId="intro"
            renderMarkdown={true}
            className="text-gray-600 mb-8"
          />
          
          <div className="space-y-8">
            <div>
              <h3 className="font-semibold text-xl mb-2">When is the RSVP deadline?</h3>
              <EditableContent 
                pageId="q-and-a" 
                sectionId="rsvp-deadline"
                className="text-gray-600"
              />
            </div>

            <div>
              <h3 className="font-semibold text-xl mb-2">Can I bring a date?</h3>
              <EditableContent 
                pageId="q-and-a" 
                sectionId="plus-ones"
                className="text-gray-600"
              />
            </div>

            <div>
              <h3 className="font-semibold text-xl mb-2">Are kids welcome?</h3>
              <EditableContent 
                pageId="q-and-a" 
                sectionId="kids"
                className="text-gray-600"
              />
            </div>

            <div>
              <h3 className="font-semibold text-xl mb-2">What will the weather be like?</h3>
              <EditableContent 
                pageId="q-and-a" 
                sectionId="weather"
                className="text-gray-600"
              />
            </div>

            <div>
              <h3 className="font-semibold text-xl mb-2">Where should I park?</h3>
              <EditableContent 
                pageId="q-and-a" 
                sectionId="parking"
                className="text-gray-600"
              />
            </div>

            <div>
              <h3 className="font-semibold text-xl mb-2">Are the ceremony and reception locations wheelchair accessible?</h3>
              <EditableContent 
                pageId="q-and-a" 
                sectionId="accessibility"
                className="text-gray-600"
              />
            </div>

            <div>
              <h3 className="font-semibold text-xl mb-2">What should I wear?</h3>
              <EditableContent 
                pageId="q-and-a" 
                sectionId="dress-code"
                className="text-gray-600"
              />
            </div>

            <div>
              <h3 className="font-semibold text-xl mb-2">Is the wedding indoors or outdoors?</h3>
              <EditableContent 
                pageId="q-and-a" 
                sectionId="venue-type"
                className="text-gray-600"
              />
            </div>

            <div>
              <h3 className="font-semibold text-xl mb-2">Is it okay to take pictures with our phones and cameras during the wedding?</h3>
              <EditableContent 
                pageId="q-and-a" 
                sectionId="photography"
                className="text-gray-600"
              />
            </div>

            <div>
              <h3 className="font-semibold text-xl mb-2">Will you be providing room blocks for accommodations?</h3>
              <EditableContent 
                pageId="q-and-a" 
                sectionId="room-blocks"
                className="text-gray-600"
              />
            </div>

            <div>
              <h3 className="font-semibold text-xl mb-2">Whom should I contact with questions?</h3>
              <EditableContent 
                pageId="q-and-a" 
                sectionId="contact"
                className="text-gray-600"
              />
            </div>
          </div>

          <EditableContent 
            pageId="q-and-a" 
            sectionId="conclusion"
            renderMarkdown={true}
            className="text-gray-600 mt-8"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default QAndA;
