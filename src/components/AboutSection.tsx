import { motion } from "framer-motion";

// Custom colorful SVG illustrations
const AIBrainIcon = () => (
  <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
    {/* Brain shape */}
    <circle cx="40" cy="38" r="24" fill="url(#aiGrad)" opacity="0.15" />
    <path d="M30 28c0-6 4-10 10-10s10 4 10 10" stroke="url(#aiGrad)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M26 38c-4 0-6 3-6 6s2 6 6 6" stroke="url(#aiGrad)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M54 38c4 0 6 3 6 6s-2 6-6 6" stroke="url(#aiGrad)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M32 50c0 4 3 8 8 8s8-4 8-8" stroke="url(#aiGrad)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    {/* Neural nodes */}
    <circle cx="32" cy="30" r="3" fill="#acd663" />
    <circle cx="48" cy="30" r="3" fill="#ff6b00" />
    <circle cx="28" cy="42" r="3" fill="#ffb347" />
    <circle cx="52" cy="42" r="3" fill="#acd663" />
    <circle cx="36" cy="52" r="3" fill="#ff6b00" />
    <circle cx="44" cy="52" r="3" fill="#ffb347" />
    <circle cx="40" cy="38" r="4" fill="#acd663" />
    {/* Connections */}
    <line x1="32" y1="30" x2="40" y2="38" stroke="#acd663" strokeWidth="1.5" opacity="0.5" />
    <line x1="48" y1="30" x2="40" y2="38" stroke="#ff6b00" strokeWidth="1.5" opacity="0.5" />
    <line x1="28" y1="42" x2="40" y2="38" stroke="#ffb347" strokeWidth="1.5" opacity="0.5" />
    <line x1="52" y1="42" x2="40" y2="38" stroke="#acd663" strokeWidth="1.5" opacity="0.5" />
    <line x1="36" y1="52" x2="40" y2="38" stroke="#ff6b00" strokeWidth="1.5" opacity="0.5" />
    <line x1="44" y1="52" x2="40" y2="38" stroke="#ffb347" strokeWidth="1.5" opacity="0.5" />
    {/* Sparkles */}
    <circle cx="20" cy="24" r="1.5" fill="#ffb347" opacity="0.7" />
    <circle cx="60" cy="26" r="1.5" fill="#acd663" opacity="0.7" />
    <circle cx="22" cy="54" r="1.5" fill="#ff6b00" opacity="0.6" />
    <circle cx="58" cy="52" r="1.5" fill="#ffb347" opacity="0.7" />
    <defs>
      <linearGradient id="aiGrad" x1="20" y1="20" x2="60" y2="60">
        <stop stopColor="#acd663" />
        <stop offset="1" stopColor="#ff6b00" />
      </linearGradient>
    </defs>
  </svg>
);

const LeaderboardIcon = () => (
  <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
    {/* Podium */}
    <rect x="10" y="42" width="18" height="24" rx="3" fill="#C0C0C0" />
    <rect x="31" y="28" width="18" height="38" rx="3" fill="#FFD700" />
    <rect x="52" y="48" width="18" height="18" rx="3" fill="#CD7F32" />
    {/* Numbers */}
    <text x="19" y="58" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" fontFamily="sans-serif">2</text>
    <text x="40" y="48" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="sans-serif">1</text>
    <text x="61" y="61" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" fontFamily="sans-serif">3</text>
    {/* Crown on #1 */}
    <path d="M34 24l3-6 3 4 3-4 3 6z" fill="#FFD700" />
    <rect x="34" y="24" width="12" height="3" rx="1" fill="#FFC107" />
    {/* Stars */}
    <circle cx="19" cy="36" r="2" fill="white" opacity="0.6" />
    <circle cx="61" cy="44" r="1.5" fill="white" opacity="0.5" />
    {/* Up arrow for #1 */}
    <path d="M37 20l3-4 3 4" stroke="#acd663" strokeWidth="1.5" strokeLinecap="round" fill="none" />
  </svg>
);

const MedalsIcon = () => (
  <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
    {/* Gold medal - center, front */}
    <path d="M36 18l4-6 4 6" stroke="#DAA520" strokeWidth="2" fill="#FFD700" />
    <rect x="36" y="18" width="8" height="10" fill="#acd663" rx="1" />
    <circle cx="40" cy="38" r="14" fill="url(#goldGrad)" stroke="#DAA520" strokeWidth="2" />
    <circle cx="40" cy="38" r="10" fill="none" stroke="#DAA520" strokeWidth="1" opacity="0.5" />
    <text x="40" y="43" textAnchor="middle" fill="#8B6914" fontSize="14" fontWeight="bold" fontFamily="sans-serif">1</text>
    {/* Silver medal - left */}
    <path d="M14 24l3-5 3 5" stroke="#808080" strokeWidth="1.5" fill="#C0C0C0" />
    <rect x="14" y="24" width="6" height="8" fill="#A0A0A0" rx="1" />
    <circle cx="17" cy="42" r="10" fill="url(#silverGrad)" stroke="#808080" strokeWidth="1.5" />
    <circle cx="17" cy="42" r="7" fill="none" stroke="#A0A0A0" strokeWidth="0.8" opacity="0.5" />
    <text x="17" y="46" textAnchor="middle" fill="#5A5A5A" fontSize="10" fontWeight="bold" fontFamily="sans-serif">2</text>
    {/* Bronze medal - right */}
    <path d="M60 26l3-5 3 5" stroke="#8B4513" strokeWidth="1.5" fill="#CD7F32" />
    <rect x="60" y="26" width="6" height="8" fill="#B87333" rx="1" />
    <circle cx="63" cy="44" r="10" fill="url(#bronzeGrad)" stroke="#8B4513" strokeWidth="1.5" />
    <circle cx="63" cy="44" r="7" fill="none" stroke="#B87333" strokeWidth="0.8" opacity="0.5" />
    <text x="63" y="48" textAnchor="middle" fill="#5C3317" fontSize="10" fontWeight="bold" fontFamily="sans-serif">3</text>
    {/* Sparkles */}
    <circle cx="28" cy="28" r="1.5" fill="#FFD700" opacity="0.7" />
    <circle cx="52" cy="30" r="1.5" fill="#FFD700" opacity="0.6" />
    <circle cx="40" cy="56" r="1.5" fill="#acd663" opacity="0.5" />
    <defs>
      <linearGradient id="goldGrad" x1="26" y1="24" x2="54" y2="52">
        <stop stopColor="#FFD700" />
        <stop offset="1" stopColor="#FFA500" />
      </linearGradient>
      <linearGradient id="silverGrad" x1="7" y1="32" x2="27" y2="52">
        <stop stopColor="#E8E8E8" />
        <stop offset="1" stopColor="#A0A0A0" />
      </linearGradient>
      <linearGradient id="bronzeGrad" x1="53" y1="34" x2="73" y2="54">
        <stop stopColor="#DDA15E" />
        <stop offset="1" stopColor="#CD7F32" />
      </linearGradient>
    </defs>
  </svg>
);

const features = [
  {
    icon: AIBrainIcon,
    title: "AI Assisted Learning",
    description: "Smart AI adapts to your pace, identifies gaps, and builds a personalized learning path just for you.",
  },
  {
    icon: LeaderboardIcon,
    title: "Leaderboard",
    description: "Compete with friends and learners worldwide. Climb the ranks and prove your skills every week.",
  },
  {
    icon: MedalsIcon,
    title: "Badges & Rewards",
    description: "Collect achievement badges for milestones. Show off your accomplishments and stay motivated.",
  },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#acd663]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, amount: 0.5 }}
          className="text-center mb-16"
        >
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            className="font-display text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-3"
          >
            Why <span className="text-[#acd663]">MINDUP</span>?
          </motion.h2>
          <p className="text-foreground/50 max-w-xl mx-auto text-lg md:text-xl font-semibold">
            Learning that feels like playing
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.12 * i,
                ease: [0.22, 1, 0.36, 1],
              }}
              viewport={{ once: true, amount: 0.2 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group relative p-7 rounded-2xl bg-white/50 backdrop-blur-sm border border-border/60 hover:border-[#acd663]/30 cursor-default transition-shadow duration-400 hover:shadow-xl hover:shadow-[#acd663]/10"
            >
              {/* Colorful SVG illustration */}
              <div className="w-20 h-20 mb-5 mx-auto group-hover:scale-110 transition-transform duration-300">
                <feature.icon />
              </div>

              <h3 className="font-display text-lg font-bold text-foreground mb-2 text-center group-hover:text-[#acd663] transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-foreground/50 leading-relaxed text-sm text-center">
                {feature.description}
              </p>

              <div className="absolute top-0 right-0 w-20 h-20 bg-[#acd663]/0 group-hover:bg-[#acd663]/5 rounded-bl-[60px] rounded-tr-2xl transition-all duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
