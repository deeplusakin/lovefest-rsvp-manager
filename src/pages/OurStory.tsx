
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
            From the tender age of eight, our paths intertwined in the most unexpected ways. Shortly after moving from Silver Spring to Gaithersburg, my sister and I spent a memorable summer under the care of my fiancée's grandmother, who had recently emigrated from Liberia. Even then, a special bond began to form: she found joy in watching me conquer video game levels, while I was drawn to her calm and sweet demeanor.
          </p>

          <p>
            After that summer, life took us on separate journeys, though we remained just miles apart. Years later, fate orchestrated a remarkable reunion. Upon returning from teaching English abroad, I applied for a job, only to discover she was a fellow applicant. We exchanged numbers, and for nearly two years, we were inseparable, rekindling the deep friendship we had as children.
          </p>

          <p>
            Life's twists and turns led us in different directions, but the memory of our bond never faded. Eventually, our paths crossed once more, and this time, we embraced the connection that had always been there.
          </p>

          <p>
            One of our most cherished memories is our first dance together at an African restaurant called The Kitchen Near You. Despite my conservative boarding school background and her vibrant collegiate experiences, she was unaware of my dancing skills. That evening, as we moved to the rhythm, we playfully challenged each other on how low we could go, laughing and feeling an electrifying chemistry that spoke volumes about our connection.
          </p>

          <p>
            When it came time to propose, I wanted it to be as unique as our story. We were in the midst of launching a podcast celebrating diverse cultures, which required a photoshoot. Seizing the opportunity, I conspired with the photographer to turn the session into a surprise proposal. Given her detective-like intuition, the only way to keep it a secret was to have her unknowingly help plan her own proposal. The look of astonishment and joy on her face when I got down on one knee is a moment we'll both treasure forever.
          </p>

          <p>
            Our journey, marked by serendipitous meetings and heartfelt reconnections, is a testament to the fun, loving, and refreshing relationship we cherish today.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default OurStory;
