
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
              We have a room block for guests at the DoubleTree by Hilton Hotel in Columbia. 
              <a href="https://www.hilton.com/en/attend-my-event/bwichdt-92q-58896d92-1264-420f-8b61-193e3496d6d9/" className="text-accent underline ml-1" target="_blank" rel="noopener noreferrer">
                Click here
              </a> to book. Alternatively, you can call the Hilton reservation line at 1-800-455-8667 and use the SRP code C-92Q for the "Walker Wedding Block".
            </p>
            <p className="text-gray-600 mb-4 font-medium">
              Please note, the cutoff date for booking at the discounted rate is August 8, 2025, until 11:59 PM.
            </p>
            <p className="text-gray-600 mb-6 font-medium">
              The discounted room rates range from $145 to $185 per night.
            </p>
            <p className="text-gray-600 mb-4">
              Here are some other quality, affordable accommodation options near the venue:
            </p>
            <ul className="space-y-4">
              <li className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">DoubleTree by Hilton Columbia</h3>
                <p className="text-gray-600">8 minutes from venue</p>
                <p className="text-gray-600">On-site restaurant and indoor pool</p>
                <p className="text-gray-600">Discounted wedding rates from $145-185/night</p>
              </li>
              <li className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Turf Valley Resort</h3>
                <p className="text-gray-600">10 minutes from venue</p>
                <p className="text-gray-600">Spacious rooms with resort amenities</p>
                <p className="text-gray-600">Average rates from $150-200/night</p>
              </li>
              <li className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Residence Inn by Marriott</h3>
                <p className="text-gray-600">11 minutes from venue</p>
                <p className="text-gray-600">All-suite hotel with full kitchens</p>
                <p className="text-gray-600">Average rates from $160-190/night</p>
              </li>
              <li className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Sonesta ES Suites Columbia</h3>
                <p className="text-gray-600">12 minutes from venue</p>
                <p className="text-gray-600">Apartment-style suites with kitchens</p>
                <p className="text-gray-600">Average rates from $130-170/night</p>
              </li>
              <li className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Courtyard by Marriott</h3>
                <p className="text-gray-600">14 minutes from venue</p>
                <p className="text-gray-600">Modern business-friendly amenities</p>
                <p className="text-gray-600">Average rates from $130-170/night</p>
              </li>
              <li className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Hampton Inn Columbia</h3>
                <p className="text-gray-600">15 minutes from venue</p>
                <p className="text-gray-600">Complimentary breakfast included</p>
                <p className="text-gray-600">Average rates from $120-160/night</p>
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
