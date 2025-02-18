
import { useState, useEffect } from 'react';

const WEDDING_DATE = new Date('2024-09-21T16:00:00'); // Update this to your actual wedding date

const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = WEDDING_DATE.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="py-16 bg-gradient-to-r from-purple-50 to-pink-50">
      <div className="container max-w-4xl mx-auto px-4">
        <h2 className="text-4xl font-serif text-center mb-8 text-primary animate-fade-in">
          Counting Down to Our Special Day
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center animate-slide-up">
          {[
            { label: 'Days', value: timeLeft.days },
            { label: 'Hours', value: timeLeft.hours },
            { label: 'Minutes', value: timeLeft.minutes },
            { label: 'Seconds', value: timeLeft.seconds }
          ].map((item) => (
            <div 
              key={item.label}
              className="bg-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-200"
            >
              <div className="text-4xl md:text-5xl font-bold text-accent mb-2">
                {String(item.value).padStart(2, '0')}
              </div>
              <div className="text-sm md:text-base text-gray-600 font-medium">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Countdown;
