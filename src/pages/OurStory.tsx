
import { motion } from "framer-motion";

const OurStory = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-white py-24"
    >
      <div className="container max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-serif text-center mb-12">Our Story</h1>
        <div className="prose prose-lg max-w-none space-y-6">
          <p>
            The journey began in 1997 in Gaithersburg, MD where Akin and his sister spent a memorable summer under the care of Dearborne's grandmother. During that time, they enjoyed playing video games and hanging out with their siblings. Dee was drawn to Akin's gentleness, while Akin was drawn to Dee's calm and sweet demeanor.
          </p>

          <p>
            After that summer, their lives took separate paths, though they remained a few miles apart. Many years later in 2011, fate orchestrated a remarkable reunion. Upon returning from teaching English abroad, Akin applied for a job and discovered that Dee, who recently graduated from the University of Maryland, was a fellow applicant. They exchanged numbers and for nearly two years, were inseparable, rekindling the deep friendship they had as children. During this time, they traveled, explored, and shared endless experiences together.
          </p>

          <p>
            Again, life's twists and turns led them in different directions, but the memory of their bond never faded. Eventually their paths crossed once more in 2023 and this time, they embraced the connection that had always been there. They picked up where they left off and continued their adventures. They have realized that their spirits are drawn to, and fond of each other, and that their destinies are intertwined. They thank God for the blessing of a soulmate with whom to navigate this life.
          </p>

          <p>
            Their journey, marked by serendipitous meetings and heartfelt reconnections, is a testament to the fun, loving, and refreshing relationship they cherish today.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default OurStory;
