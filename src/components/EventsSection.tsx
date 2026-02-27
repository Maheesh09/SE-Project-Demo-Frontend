import { motion } from "framer-motion";
import { Flame } from "lucide-react";

// Custom colorful SVG illustrations
const HoodieIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
    <path d="M12 14c0-5 4-8 8-8s8 3 8 8v4l4 3v10H8V21l4-3v-4z" fill="url(#hoodieGrad)" />
    <path d="M16 6c1-1 2.5-1.5 4-1.5S22.5 5 24 6" stroke="#cc7700" strokeWidth="1.5" fill="none" />
    <path d="M8 27h24" stroke="#cc7700" strokeWidth="1" opacity="0.4" />
    <rect x="17" y="18" width="6" height="8" rx="2" fill="white" opacity="0.2" />
    <circle cx="20" cy="12" r="2" fill="#FFD700" opacity="0.6" />
    <defs><linearGradient id="hoodieGrad" x1="8" y1="6" x2="32" y2="31"><stop stopColor="#acd663" /><stop offset="1" stopColor="#e67700" /></linearGradient></defs>
  </svg>
);

const StickerIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
    <circle cx="14" cy="16" r="8" fill="#FF6B6B" opacity="0.8" />
    <circle cx="26" cy="16" r="8" fill="#4ECDC4" opacity="0.8" />
    <circle cx="20" cy="26" r="8" fill="#FFD93D" opacity="0.8" />
    <circle cx="14" cy="16" r="4" fill="white" opacity="0.3" />
    <circle cx="26" cy="16" r="4" fill="white" opacity="0.3" />
    <circle cx="20" cy="26" r="4" fill="white" opacity="0.3" />
    <circle cx="20" cy="19" r="2" fill="white" opacity="0.5" />
  </svg>
);

const GiftBoxIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
    <rect x="6" y="16" width="28" height="18" rx="3" fill="url(#giftGrad)" />
    <rect x="4" y="12" width="32" height="6" rx="2" fill="#acd663" />
    <rect x="18" y="12" width="4" height="22" fill="#cc7700" opacity="0.3" />
    <path d="M20 12c-3-4-8-4-8 0" stroke="#FFD700" strokeWidth="2" fill="none" />
    <path d="M20 12c3-4 8-4 8 0" stroke="#FFD700" strokeWidth="2" fill="none" />
    <circle cx="12" cy="8" r="1.5" fill="#FFD700" opacity="0.6" />
    <circle cx="28" cy="8" r="1.5" fill="#FFD700" opacity="0.6" />
    <defs><linearGradient id="giftGrad" x1="6" y1="16" x2="34" y2="34"><stop stopColor="#acd663" /><stop offset="1" stopColor="#e67700" /></linearGradient></defs>
  </svg>
);

const TrophyIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
    <path d="M12 8h16v10c0 5-3.5 8-8 8s-8-3-8-8V8z" fill="url(#trophyGrad)" />
    <path d="M12 12H6c0 5 3 8 6 8" stroke="#DAA520" strokeWidth="2" fill="none" />
    <path d="M28 12h6c0 5-3 8-6 8" stroke="#DAA520" strokeWidth="2" fill="none" />
    <rect x="16" y="26" width="8" height="4" rx="1" fill="#cc7700" />
    <rect x="12" y="30" width="16" height="4" rx="2" fill="#DAA520" />
    <circle cx="20" cy="16" r="3" fill="#FFD700" opacity="0.5" />
    <path d="M18.5 15.5l1 1.5 2-2.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" fill="none" />
    <circle cx="10" cy="6" r="1" fill="#FFD700" opacity="0.5" />
    <circle cx="30" cy="6" r="1" fill="#FFD700" opacity="0.5" />
    <defs><linearGradient id="trophyGrad" x1="12" y1="8" x2="28" y2="26"><stop stopColor="#FFD700" /><stop offset="1" stopColor="#FFA500" /></linearGradient></defs>
  </svg>
);

const RewardBadgeIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
    <circle cx="20" cy="18" r="12" fill="url(#badgeGrad)" />
    <circle cx="20" cy="18" r="8" fill="none" stroke="#DAA520" strokeWidth="1.5" />
    <path d="M17 33l3-6 3 6" fill="#acd663" />
    <path d="M23 33l3-6-3 6" fill="#e67700" />
    <path d="M16 18l3 3 5-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <defs><linearGradient id="badgeGrad" x1="8" y1="6" x2="32" y2="30"><stop stopColor="#FFD700" /><stop offset="1" stopColor="#acd663" /></linearGradient></defs>
  </svg>
);

const leaderboardData = [
  { rank: 1, name: "Ayesha Fernando", avatar: "AF", xp: 12480, streak: 45, level: "Diamond" },
  { rank: 2, name: "Kavindu Perera", avatar: "KP", xp: 11250, streak: 38, level: "Platinum" },
  { rank: 3, name: "Nethmi Silva", avatar: "NS", xp: 10890, streak: 33, level: "Platinum" },
  { rank: 4, name: "Dineth Jayasuriya", avatar: "DJ", xp: 9720, streak: 28, level: "Gold" },
  { rank: 5, name: "Rashmi Wijesekara", avatar: "RW", xp: 9150, streak: 25, level: "Gold" },
  { rank: 6, name: "Tharindu Lakmal", avatar: "TL", xp: 8640, streak: 21, level: "Gold" },
  { rank: 7, name: "Sanduni Wickrama", avatar: "SW", xp: 8120, streak: 19, level: "Silver" },
];

const medalColors: Record<number, { bg: string; border: string; text: string; emoji: string }> = {
  1: { bg: "bg-gradient-to-r from-yellow-100 to-amber-50", border: "border-yellow-400", text: "text-yellow-700", emoji: "🥇" },
  2: { bg: "bg-gradient-to-r from-gray-100 to-slate-50", border: "border-gray-400", text: "text-gray-600", emoji: "🥈" },
  3: { bg: "bg-gradient-to-r from-orange-100 to-amber-50", border: "border-orange-400", text: "text-orange-700", emoji: "🥉" },
};

const merchItems = [
  { Icon: HoodieIcon, label: "Exclusive Merch", desc: "Premium MINDUP branded hoodies, t-shirts & caps" },
  { Icon: StickerIcon, label: "Sticker Packs", desc: "Limited edition holographic sticker collections" },
  { Icon: GiftBoxIcon, label: "Gift Bundles", desc: "Notebooks, bands, accessories & surprise gifts" },
  { Icon: TrophyIcon, label: "Trophies", desc: "Custom engraved trophies for monthly champions" },
];

const EventsSection = () => {
  return (
    <section id="events" className="py-24 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-[#acd663]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-0 w-[300px] h-[300px] bg-yellow-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, amount: 0.5 }}
          className="text-center mb-14"
        >
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            className="font-display text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-3"
          >
            Top Learners <span className="text-[#acd663]">This Week</span>
          </motion.h2>
          <p className="text-foreground/50 max-w-xl mx-auto text-lg md:text-xl font-semibold">
            Climb the ranks. Earn rewards. Get recognized.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
          {/* Leaderboard Table */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
              className="bg-white/60 backdrop-blur-sm rounded-2xl border border-border/60 overflow-hidden"
            >
              {/* Table header */}
              <div className="grid grid-cols-12 gap-2 px-5 py-3 bg-white/40 border-b border-border/40 text-xs font-bold text-foreground/55 uppercase tracking-wider">
                <div className="col-span-1">#</div>
                <div className="col-span-5">Learner</div>
                <div className="col-span-3 text-right">XP</div>
                <div className="col-span-3 text-right">Streak</div>
              </div>

              {/* Rows */}
              {leaderboardData.map((user, i) => {
                const medal = medalColors[user.rank];
                const isTop3 = user.rank <= 3;

                return (
                  <motion.div
                    key={user.rank}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.08 * i,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.01, backgroundColor: "rgba(255,149,0,0.04)" }}
                    className={`grid grid-cols-12 gap-2 items-center px-5 py-3.5 border-b border-border/20 transition-all duration-300 cursor-default ${
                      isTop3 ? `${medal.bg} ${medal.border} border-l-4` : ""
                    }`}
                  >
                    {/* Rank */}
                    <div className="col-span-1">
                      {isTop3 ? (
                        <span className="text-xl">{medal.emoji}</span>
                      ) : (
                        <span className="text-sm font-bold text-foreground/40">#{user.rank}</span>
                      )}
                    </div>

                    {/* Avatar + Name + Level */}
                    <div className="col-span-5 flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${
                        isTop3 ? `bg-[#acd663]/20 text-[#acd663]` : "bg-foreground/10 text-foreground/60"
                      }`}>
                        {user.avatar}
                      </div>
                      <div>
                        <p className={`text-sm font-bold ${isTop3 ? "text-foreground" : "text-foreground/70"}`}>
                          {user.name}
                        </p>
                        <p className="text-[11px] text-foreground/40">{user.level}</p>
                      </div>
                    </div>

                    {/* XP */}
                    <div className="col-span-3 text-right">
                      <span className={`text-sm font-bold ${isTop3 ? "text-[#acd663]" : "text-foreground/60"}`}>
                        {user.xp.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-foreground/50 ml-1">XP</span>
                    </div>

                    {/* Streak */}
                    <div className="col-span-3 text-right flex items-center justify-end gap-1">
                      <Flame className={`w-3.5 h-3.5 ${user.streak > 30 ? "text-red-500" : user.streak > 20 ? "text-orange-400" : "text-foreground/50"}`} />
                      <span className={`text-sm font-bold ${isTop3 ? "text-foreground" : "text-foreground/60"}`}>
                        {user.streak}
                      </span>
                      <span className="text-[10px] text-foreground/30">days</span>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* Merch Rewards Hype Panel */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-[#acd663]/10 via-white/60 to-yellow-50/60 backdrop-blur-sm rounded-2xl border border-[#acd663]/20 p-6 relative overflow-hidden h-full"
            >
              {/* Sparkle decoration */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-4 -right-4 w-24 h-24 opacity-10"
              >
                <RewardBadgeIcon />
              </motion.div>

              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8"><GiftBoxIcon /></div>
                <h3 className="font-display text-lg font-black text-foreground">
                  Top Rank = Real Rewards
                </h3>
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                viewport={{ once: true }}
                className="text-foreground/70 text-sm mb-6 leading-relaxed"
              >
                We don't just give you points. Our top learners receive <span className="font-bold text-foreground">real, physical merch</span> delivered to your doorstep every month.
              </motion.p>

              {/* Merch Items */}
              <div className="space-y-3 mb-6">
                {merchItems.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + 0.1 * i, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-3 p-3 rounded-xl bg-white/60 hover:bg-white/80 border border-border/30 hover:border-[#acd663]/20 transition-all duration-300 group cursor-default"
                  >
                    <div className="w-10 h-10 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <item.Icon />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{item.label}</p>
                      <p className="text-[12px] text-foreground/55 leading-snug">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="inline-block px-5 py-2 rounded-full bg-[#acd663] text-black text-sm font-bold hover:bg-[#96ba50] transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-[#acd663]/20 hover:-translate-y-0.5">
                  Start Earning Now
                </div>
                <p className="text-[11px] text-foreground/50 mt-2">Monthly rewards for top 10 learners</p>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Bottom hype banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          className="mt-10 max-w-6xl mx-auto"
        >
          <div className="relative rounded-2xl bg-gradient-to-r from-amber-50 via-yellow-50/80 to-amber-50 border-2 border-amber-300/40 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 overflow-hidden">
            {/* Gold shine sweep */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,215,0,0.15) 45%, rgba(255,215,0,0.25) 50%, rgba(255,215,0,0.15) 55%, transparent 100%)',
                animation: 'goldShine 3s ease-in-out infinite',
              }}
            />

            {/* Trophy - more visible */}
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-2 -bottom-2 w-36 h-36 opacity-25"
            >
              <TrophyIcon />
            </motion.div>

            <div className="flex items-center gap-3 relative z-10">
              <div className="w-11 h-11 flex-shrink-0">
                <RewardBadgeIcon />
              </div>
              <div>
                <p className="font-black text-foreground text-base tracking-tight" style={{ textShadow: '0 1px 0 rgba(0,0,0,0.05)' }}>
                  This month's top reward: <span className="text-amber-600 font-black">MINDUP Premium Hoodie + Sticker Bundle</span>
                </p>
                <p className="text-foreground/65 text-sm font-semibold">Only 7 days left to claim your spot in the top 10!</p>
              </div>
            </div>
            <div className="flex-shrink-0 relative z-10">
              <span className="px-5 py-2.5 rounded-full bg-amber-400/20 text-amber-700 text-sm font-black border-2 border-amber-400/40 tracking-wide">
                7 Days Left
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default EventsSection;
