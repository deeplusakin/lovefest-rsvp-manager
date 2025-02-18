
import { motion } from "framer-motion";

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
            For the comfort and convenience of all our guests, we've compiled answers to some frequently asked questions:
          </p>
          
          <div className="space-y-8">
            <div>
              <h3 className="font-semibold text-xl mb-2">When is the RSVP deadline?</h3>
              <p className="text-gray-600">Please RSVP by June 6, 2025.</p>
            </div>

            <div>
              <h3 className="font-semibold text-xl mb-2">Can I bring a date?</h3>
              <p className="text-gray-600">We kindly request that only the individuals explicitly named on your invitation attend. Our guest list is carefully curated, and we appreciate your understanding.</p>
            </div>

            <div>
              <h3 className="font-semibold text-xl mb-2">Are kids welcome?</h3>
              <p className="text-gray-600">While we adore your children, our ceremony and reception are adult-only events. We hope you enjoy this evening as a personal night out.</p>
            </div>

            <div>
              <h3 className="font-semibold text-xl mb-2">What will the weather be like?</h3>
              <p className="text-gray-600">Late August in Ellicott City, Maryland, is typically hot and mostly cloudy, with average high temperatures ranging from 82°F to 86°F. We recommend dressing accordingly and staying hydrated.</p>
            </div>

            <div>
              <h3 className="font-semibold text-xl mb-2">Where should I park?</h3>
              <p className="text-gray-600">Complimentary parking is available in front of the venue. Additionally, there are numerous free parking options throughout downtown Ellicott City.</p>
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
              <p className="text-gray-600">Our ceremony will take place outdoors, followed by an indoor reception in the ballroom. Please plan your footwear and attire with this in mind.</p>
            </div>

            <div>
              <h3 className="font-semibold text-xl mb-2">Is it okay to take pictures with our phones and cameras during the wedding?</h3>
              <p className="text-gray-600">While we welcome you to capture personal memories, we kindly ask that no photos be shared on social media. We appreciate your respect for our privacy.</p>
            </div>

            <div>
              <h3 className="font-semibold text-xl mb-2">Whom should I contact with questions?</h3>
              <p className="text-gray-600">If you have additional questions not addressed here, please reach out to our coordinator, Rena Bullard, at [insert contact information].</p>
            </div>
          </div>

          <p className="text-gray-600 mt-8">We hope this information helps you prepare for our special day. We can't wait to celebrate with you!</p>
        </div>
      </div>
    </motion.div>
  );
};

export default QAndA;
