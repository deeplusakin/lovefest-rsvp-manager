
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
            Akin and Dee's journey began at the tender age of eight. Shortly after Akin moved from Silver Spring to Gaithersburg, he and his sister spent a memorable summer under the care of Dee's grandmother. Dee had recently emigrated from Liberia, and during this time, a special bond formed between them: Dee found joy in watching Akin play video games, while Akin was drawn to Dee's calm and sweet demeanor.
          </p>

          <p>
            After that summer, their lives took separate paths, though they remained just miles apart. Years later, fate orchestrated a remarkable reunion. Upon returning from teaching English abroad, Akin applied for a job and discovered that Dee was a fellow applicant. They exchanged numbers and, for nearly two years, were inseparable, rekindling the deep friendship they had as children.
          </p>

          <p>
            Life's twists and turns led them in different directions, but the memory of their bond never faded. Eventually, their paths crossed once more, and this time, they embraced the connection that had always been there.
          </p>

          <p>
            One of their most cherished memories is their first dance together at an African restaurant called The Kitchen Near You. Despite Akin's conservative boarding school background and Dee's vibrant collegiate experiences, she was unaware of his dancing skills. That evening, as they moved to the rhythm, they playfully challenged each other on how low they could go, laughing and feeling an electrifying chemistry that spoke volumes about their connection.
          </p>

          <p>
            When it came time to propose, Akin wanted it to be as unique as their story. They were in the midst of launching a podcast celebrating diverse cultures, which required a photoshoot. Seizing the opportunity, Akin conspired with the photographer to turn the session into a surprise proposal. Given Dee's detective-like intuition, the only way to keep it a secret was to have her unknowingly help plan her own proposal. The look of astonishment and joy on her face when Akin got down on one knee is a moment they'll both treasure forever.
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
