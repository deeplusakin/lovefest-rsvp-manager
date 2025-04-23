
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
          <p className="text-gray-600 mb-8">
            For the convenience of all our guests, we've compiled answers to some frequently asked questions:
          </p>
          
          <div className="space-y-8">
            <div>
              <h3 className="font-semibold text-xl mb-2">When is the RSVP deadline?</h3>
              <p className="text-gray-600">Please RSVP by June 13, 2025.</p>
            </div>

            <div>
              <h3 className="font-semibold text-xl mb-2">Can I bring a date?</h3>
              <p className="text-gray-600">We kindly request that only the individuals that populate when you enter your invitation code attend. Our guest list is carefully curated, and we appreciate your understanding.</p>
            </div>

            <div>
              <h3 className="font-semibold text-xl mb-2">Are kids welcome?</h3>
              <p className="text-gray-600">While we adore your children, our ceremony and reception are adult-only events. We hope you enjoy this evening as a personal night out.</p>
            </div>

            <div>
              <h3 className="font-semibold text-xl mb-2">What will the weather be like?</h3>
              <p className="text-gray-600">Late August in Ellicott City, Maryland, is typically hot and mostly cloudy, with average high temperatures ranging from 82°F to 86°F. We recommend dressing accordingly. The dress code is formal.</p>
            </div>

            <div>
              <h3 className="font-semibold text-xl mb-2">Where should I park?</h3>
              <p className="text-gray-600">The best parking is in Lot D located in front of the venue.</p>
            </div>

            <div>
              <h3 className="font-semibold text-xl mb-2">Are the ceremony and reception locations wheelchair accessible?</h3>
              <p className="text-gray-600">Yes, both the ceremony and reception venues are fully wheelchair accessible.</p>
            </div>

            <div>
              <h3 className="font-semibold text-xl mb-2">What should I wear?</h3>
              <p className="text-gray-600">The dress code for our wedding is formal attire. We look forward to seeing everyone in their elegant best.</p>
            </div>

            <div>
              <h3 className="font-semibold text-xl mb-2">Is the wedding indoors or outdoors?</h3>
              <p className="text-gray-600">The ceremony and reception are indoor, and the cocktail hour is both indoor and outdoor.</p>
            </div>

            <div>
              <h3 className="font-semibold text-xl mb-2">Is it okay to take pictures with our phones and cameras during the wedding?</h3>
              <p className="text-gray-600">Please allow our photographers to capture professional shots without obstructing their view. We kindly request that NO pictures or videos are shared on social media. We appreciate your respect for our privacy.</p>
            </div>

            <div>
              <h3 className="font-semibold text-xl mb-2">Will you be providing room blocks for accommodations?</h3>
              <p className="text-gray-600">
                Yes! We have a room block for guests at the DoubleTree by Hilton Hotel in Columbia. <a href="https://www.hilton.com/en/attend-my-event/bwichdt-92q-58896d92-1264-420f-8b61-193e3496d6d9/" className="text-accent underline" target="_blank" rel="noopener noreferrer">Click here</a> to book. 
                Alternatively, you can call the Hilton reservation line at 1-800-455-8667 and use the SRP code C-92Q for the "Walker Wedding Block". 
                Please note, the cutoff date for booking at the discounted rate is August 8, 2025, until 11:59 PM.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-xl mb-2">Whom should I contact with questions?</h3>
              <p className="text-gray-600">If you have additional questions, please reach out to our coordinator, Rena Bullard, at rena@eventsulove.com; 516-754-5378.</p>
            </div>
          </div>

          <p className="text-gray-600 mt-8">We hope this information helps you prepare for our special day. We can't wait to celebrate with you!</p>
        </div>
      </div>
    </motion.div>
  );
};

export default QAndA;

