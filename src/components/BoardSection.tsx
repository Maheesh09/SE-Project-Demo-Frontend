import { motion } from "framer-motion";
import { Check } from "lucide-react";

const sharedFeatures = ["Full course access", "AI-powered tutor", "Daily quests & streaks", "Leaderboards", "Badges & rewards", "Merch eligibility"];

const plans = [
  {
    name: "Individual",
    description: "Perfect for solo learners",
    price: "1,000",
    unit: "/ student",
    features: sharedFeatures,
  },
  {
    name: "Team",
    description: "Best for study groups",
    price: "3,000",
    unit: "/ 5 students",
    features: sharedFeatures,
    popular: true,
  },
  {
    name: "Custom",
    description: "For schools & universities",
    price: "5,000",
    unit: "/ 10+ students",
    features: sharedFeatures,
  },
];

const BoardSection = () => {
  return (
    <section id="board" className="py-24 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#acd663]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            className="font-display text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-4"
          >
            Simple <span className="text-[#acd663]">Pricing</span>
          </motion.h2>
          <p className="text-foreground/50 max-w-xl mx-auto text-lg font-semibold">
            Wait for it...
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12 * i, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true, amount: 0.2 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className={`relative rounded-2xl p-7 bg-white/60 backdrop-blur-sm border transition-all duration-400 cursor-default ${
                plan.popular
                  ? "border-[#acd663]/40 shadow-xl shadow-[#acd663]/10 scale-[1.02]"
                  : "border-border/50 hover:border-[#acd663]/30 hover:shadow-lg hover:shadow-[#acd663]/5"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#acd663] text-black text-xs font-bold rounded-full">
                  MOST POPULAR
                </div>
              )}

              <h3 className="font-display text-xl font-bold text-foreground mb-1">{plan.name}</h3>
              <p className="text-foreground/50 text-sm mb-5">{plan.description}</p>

              {/* Price - crossed out */}
              <div className="mb-6">
                <div className="relative inline-block">
                  <span className="text-3xl md:text-4xl font-black text-foreground/30">
                    LKR {plan.price}
                  </span>
                  <div className="absolute top-1/2 -left-2 -right-2 h-[3px] bg-red-500 -rotate-6 rounded-full" />
                </div>
                <span className="text-foreground/30 text-sm ml-1 line-through">{plan.unit}</span>
              </div>

              {/* Features */}
              <ul className="space-y-2.5 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-foreground/65">
                    <Check className="w-4 h-4 text-[#acd663] flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="w-full py-2.5 rounded-full bg-foreground/5 text-foreground/30 text-sm font-bold text-center line-through">
                Get Started
              </div>
            </motion.div>
          ))}
        </div>

        {/* FREE Reveal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, amount: 0.5 }}
          className="text-center"
        >
          <div className="max-w-3xl mx-auto rounded-2xl bg-gradient-to-r from-[#acd663]/10 via-[#acd663]/5 to-[#acd663]/10 border border-[#acd663]/20 p-10 relative overflow-hidden">
            {/* Background decoration */}
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-4 right-8 text-7xl opacity-10 select-none font-black text-[#acd663]"
            >
              $0
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              viewport={{ once: true }}
              className="text-foreground/60 text-lg font-semibold mb-4"
            >
              Plot twist...
            </motion.p>

            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              viewport={{ once: true }}
              className="font-display text-5xl md:text-6xl lg:text-7xl font-black mb-3"
            >
              It's All <span className="text-[#acd663]">FREE</span>
            </motion.h3>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 1 }}
              viewport={{ once: true }}
              className="text-foreground/55 text-lg max-w-lg mx-auto mb-6"
            >
              Every feature. Every student. Zero cost. Because education should never have a price tag.
            </motion.p>

            <motion.a
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              viewport={{ once: true }}
              href="#home"
              className="inline-block px-8 py-3 rounded-full bg-[#acd663] text-black font-bold text-base hover:bg-[#96ba50] transition-all duration-300 hover:shadow-lg hover:shadow-[#acd663]/30 hover:-translate-y-0.5"
            >
              Start Learning Now
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BoardSection;
