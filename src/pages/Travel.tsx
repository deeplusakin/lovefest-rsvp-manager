
import { motion } from "framer-motion";
import { Car, Hotel, Plane } from "lucide-react";

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
            <p className="text-gray-600 mb-4">
              The closest airport is Baltimore/Washington International Thurgood Marshall Airport (BWI), 
              approximately 15 minutes from the venue. Other options include Reagan National Airport (DCA) 
              and Dulles International Airport (IAD), both about an hour away.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4">
              <Hotel className="w-6 h-6 text-accent" />
              <h2 className="text-2xl font-serif">Where to Stay</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Here are some quality, affordable accommodation options near the venue:
            </p>
            <ul className="space-y-4">
              <li className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Turf Valley Resort</h3>
                <p className="text-gray-600">10 minutes from venue</p>
                <p className="text-gray-600">Spacious rooms with resort amenities</p>
                <p className="text-gray-600">Average rates from $150-200/night</p>
              </li>
              <li className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Hampton Inn Columbia</h3>
                <p className="text-gray-600">15 minutes from venue</p>
                <p className="text-gray-600">Complimentary breakfast included</p>
                <p className="text-gray-600">Average rates from $120-160/night</p>
              </li>
              <li className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Sonesta ES Suites Columbia</h3>
                <p className="text-gray-600">12 minutes from venue</p>
                <p className="text-gray-600">Apartment-style suites with kitchens</p>
                <p className="text-gray-600">Average rates from $130-170/night</p>
              </li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4">
              <Car className="w-6 h-6 text-accent" />
              <h2 className="text-2xl font-serif">Getting Around</h2>
            </div>
            <p className="text-gray-600">
              We recommend renting a car or using ride-sharing services. Parking is available at the venue 
              and all recommended hotels. The historic district of Ellicott City is walkable from the venue.
            </p>
          </section>
        </div>
      </div>
    </motion.div>
  );
};

export default Travel;
