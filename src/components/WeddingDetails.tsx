
import { Calendar, MapPin } from "lucide-react";

export const WeddingDetails = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container max-w-5xl">
        <h2 className="text-4xl md:text-5xl font-serif text-center mb-16">The Details</h2>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="p-8 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4 mb-4">
                <Calendar className="w-6 h-6 text-accent" />
                <h3 className="text-2xl font-serif">Ceremony</h3>
              </div>
              <p className="text-secondary mb-2">Saturday, September 21, 2024</p>
              <p className="text-secondary">4:00 PM - 5:00 PM</p>
            </div>
            <div className="p-8 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4 mb-4">
                <MapPin className="w-6 h-6 text-accent" />
                <h3 className="text-2xl font-serif">Reception</h3>
              </div>
              <p className="text-secondary mb-2">The Grand Hotel</p>
              <p className="text-secondary">123 Elegance Way, Beverly Hills</p>
            </div>
          </div>
          <div className="relative h-[400px] md:h-full">
            <img
              src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05"
              alt="Venue"
              className="absolute inset-0 w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
