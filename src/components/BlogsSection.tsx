import { motion } from "framer-motion";

const testimonials = [
  { id: 1, name: "Dinara J.", quote: "MINDUP made studying feel like a game. I look forward to learning every day now." },
  { id: 2, name: "Ravindu D.", quote: "The leaderboard keeps me going. Competing with friends while learning is next level." },
  { id: 3, name: "Ishara P.", quote: "I earned my first merch pack last month. The hoodie is amazing." },
  { id: 4, name: "Tharindu B.", quote: "The AI tutor helped me understand calculus in a week." },
  { id: 5, name: "Nethmi F.", quote: "Daily quests keep my streak alive. 40 days and counting!" },
  { id: 6, name: "Kavindu R.", quote: "The badges system is addictive. I've collected 23 so far." },
];

const topRow = [...testimonials.slice(0, 3), ...testimonials.slice(0, 3), ...testimonials.slice(0, 3)];
const bottomRow = [...testimonials.slice(3), ...testimonials.slice(3), ...testimonials.slice(3)];

const Card = ({ item }: { item: (typeof testimonials)[0] }) => (
  <div className="flex-shrink-0 w-60 rounded-xl p-5 bg-white/60 border border-border/40 hover:border-[#acd663]/30 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#acd663]/5 transition-all duration-400 cursor-default">
    <p className="text-foreground/70 text-sm leading-relaxed mb-4">"{item.quote}"</p>
    <p className="text-sm font-bold text-foreground">{item.name}</p>
  </div>
);

const BlogsSection = () => {
  return (
    <section id="blogs" className="pt-8 pb-14 overflow-hidden">
      <div className="container mx-auto px-4 mb-8">
        <motion.h2
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          className="font-display text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-10 text-center"
        >
          What Learners <span className="text-[#acd663]">Say</span>
        </motion.h2>
        <p className="text-foreground/50 max-w-xl mx-auto text-lg font-semibold text-center">
          Real stories from our community
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="relative mb-4">
          <div className="flex gap-4 animate-marquee-left w-max">
            {topRow.map((item, i) => (
              <Card key={`top-${i}`} item={item} />
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="flex gap-4 animate-marquee-right w-max">
            {bottomRow.map((item, i) => (
              <Card key={`bottom-${i}`} item={item} />
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default BlogsSection;
