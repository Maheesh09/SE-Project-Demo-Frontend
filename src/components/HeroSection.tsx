import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Star, Sparkles } from "lucide-react";

const FOX_IMG = "/fox/mascot.png";

// ─── Orbiting orbs ──────────────────────────────────────────────────────────

const orbs = [
  { size: 18, color: "#acd663", glow: "rgba(172,214,99,0.5)", blur: 8 },
  { size: 10, color: "#d4a87a", glow: "rgba(212,168,122,0.4)", blur: 6 },
  { size: 14, color: "#acd663", glow: "rgba(172,214,99,0.45)", blur: 7 },
  { size: 8, color: "#b08a68", glow: "rgba(176,138,104,0.35)", blur: 5 },
  { size: 22, color: "#acd663", glow: "rgba(172,214,99,0.4)", blur: 10 },
  { size: 6, color: "#d4a87a", glow: "rgba(212,168,122,0.3)", blur: 4 },
  { size: 12, color: "#f7f5df", glow: "rgba(247,245,223,0.5)", blur: 6 },
];

const OrbitingOrbs = () => (
  <div className="absolute inset-0 pointer-events-none z-20">
    {/* Orbit ring */}
    <div
      className="absolute left-1/2 top-1/2 hero-orbit-ring"
      style={{
        width: "clamp(300px, 80vw, 460px)",
        height: "clamp(300px, 80vw, 460px)",
        marginLeft: "calc(clamp(300px, 80vw, 460px) / -2)",
        marginTop: "calc(clamp(300px, 80vw, 460px) / -2)",
      }}
    >
      {orbs.map((orb, i) => {
        const angle = (360 / orbs.length) * i;
        return (
          <div
            key={i}
            className="absolute left-1/2 top-1/2"
            style={{
              transform: `rotate(${angle}deg) translateX(calc(clamp(300px, 80vw, 460px) / 2))`,
              marginLeft: `${-orb.size / 2}px`,
              marginTop: `${-orb.size / 2}px`,
            }}
          >
            <motion.div
              className="rounded-full"
              style={{
                width: orb.size,
                height: orb.size,
                background: orb.color,
                boxShadow: `0 0 ${orb.blur}px ${orb.glow}, 0 0 ${orb.blur * 2}px ${orb.glow}`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 0.9, 0.6, 0.9], scale: 1 }}
              transition={{
                opacity: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.2 + i * 0.15 },
                scale: { duration: 0.5, delay: 1.2 + i * 0.15, ease: "backOut" },
              }}
            />
          </div>
        );
      })}
    </div>
  </div>
);

// ─── Speech bubble ───────────────────────────────────────────────────────────

const SpeechBubble = () => {
  const fullText = "Ready to level up?";
  const [text, setText] = useState("");

  useEffect(() => {
    let i = 0;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        if (i < fullText.length) {
          setText(fullText.slice(0, i + 1));
          i++;
        } else clearInterval(interval);
      }, 60);
      return () => clearInterval(interval);
    }, 2200);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <motion.div
      className="absolute -top-4 sm:-top-6 left-1/2 -translate-x-1/2 z-30"
      initial={{ opacity: 0, y: 10, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: 2.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative bg-white rounded-2xl px-4 py-2 shadow-md border border-black/[0.04]">
        <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">
          {text}
          <motion.span
            className="inline-block w-[2px] h-[14px] bg-gray-400 ml-0.5 align-middle"
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.6, repeat: Infinity }}
          />
        </span>
        <div className="absolute -bottom-[6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 border-r border-b border-black/[0.04]" />
      </div>
    </motion.div>
  );
};

// ─── Typewriter hook ─────────────────────────────────────────────────────────

const useTypewriter = (text: string, speed: number, startDelay: number) => {
  const [typed, setTyped] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let i = 0;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        if (i < text.length) {
          setTyped(text.slice(0, i + 1));
          i++;
        } else clearInterval(interval);
      }, speed);
      return () => clearInterval(interval);
    }, startDelay);
    return () => clearTimeout(timeout);
  }, [text, speed, startDelay]);

  useEffect(() => {
    const id = setInterval(() => setShowCursor((p) => !p), 530);
    return () => clearInterval(id);
  }, []);

  return { typed, showCursor };
};

// ─── Hero Section ────────────────────────────────────────────────────────────

const HeroSection = () => {
  const { typed: joinText, showCursor: cursor1 } = useTypewriter("Start Learning", 80, 200);
  const { typed: howText, showCursor: cursor2 } = useTypewriter("How It Works", 80, 1500);

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden bg-[#f7f5df]">

      {/* Subtle background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[600px] h-[600px] rounded-full opacity-[0.07] blur-3xl" style={{ background: "#acd663", left: "-10%", top: "-10%" }} />
        <div className="absolute w-[400px] h-[400px] rounded-full opacity-[0.05] blur-3xl" style={{ background: "#d4a87a", right: "5%", bottom: "10%" }} />
      </div>

      {/* Dot pattern texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{ backgroundImage: "radial-gradient(circle, #000 0.8px, transparent 0.8px)", backgroundSize: "24px 24px" }}
      />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-16">
        <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-10">

          {/* ─── Left: Text content ─── */}
          <div className="w-full lg:w-[52%] text-center lg:text-left order-2 lg:order-1">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-[#acd663]/10 border border-[#acd663]/20 rounded-full px-4 py-1.5 mb-6 sm:mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#acd663] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#acd663]" />
              </span>
              <span className="text-[11px] sm:text-xs font-bold text-foreground/50 uppercase tracking-[0.15em]">Gamified Learning Platform</span>
            </motion.div>

            {/* Heading */}
            <h1 className="font-display text-[2.75rem] sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[0.92] mb-5 sm:mb-7 uppercase">
              {["Level", "Up", "Your"].map((word, i) => (
                <motion.span
                  key={word}
                  initial={{ opacity: 0, y: 50, rotateX: -40 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ duration: 0.8, delay: 0.15 * i, ease: [0.22, 1, 0.36, 1] }}
                  className="inline-block mr-[0.2em] text-foreground"
                >
                  {word}
                </motion.span>
              ))}
              <br className="hidden sm:block" />
              <motion.span
                initial={{ opacity: 0, y: 50, rotateX: -40 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.8, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="inline-block text-[#acd663] sm:text-7xl md:text-8xl lg:text-9xl"
                style={{ textShadow: "0 4px 30px rgba(172,214,99,0.3)" }}
              >
                Mind
              </motion.span>
            </h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="text-base sm:text-lg md:text-xl text-foreground/45 font-medium mb-8 sm:mb-10 leading-relaxed max-w-lg mx-auto lg:mx-0"
            >
              Transform how you learn with quests, XP rewards,
              streaks, and leaderboards. Education has never been this fun.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4"
            >
              <a
                href="#about"
                className="group relative inline-flex items-center gap-2 rounded-full px-7 sm:px-9 py-3 text-sm sm:text-base uppercase tracking-[0.12em] font-bold bg-[#acd663] text-black hover:bg-[#9ec74e] transition-all duration-300 hover:shadow-xl hover:shadow-[#acd663]/25 hover:-translate-y-0.5 active:translate-y-0 overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <Sparkles size={16} className="relative" />
                <span className="relative">
                  {joinText}
                  <span className={`inline-block w-[2px] h-[1em] bg-black ml-0.5 align-middle transition-opacity duration-100 ${cursor1 ? "opacity-100" : "opacity-0"}`} />
                </span>
              </a>
              <a
                href="#features"
                className="inline-flex items-center rounded-full px-7 sm:px-9 py-3 text-sm sm:text-base uppercase tracking-[0.12em] font-bold border-2 border-foreground/15 text-foreground/70 hover:border-[#acd663] hover:text-[#7da332] transition-all duration-300 hover:-translate-y-0.5"
              >
                {howText}
                <span className={`inline-block w-[2px] h-[1em] bg-current ml-0.5 align-middle transition-opacity duration-100 ${cursor2 ? "opacity-100" : "opacity-0"}`} />
              </a>
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.3 }}
              className="mt-10 sm:mt-14 flex items-center justify-center lg:justify-start gap-3"
            >
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.5 + i * 0.1, duration: 0.3, ease: "backOut" }}
                  >
                    <Star size={14} className="text-[#acd663] fill-[#acd663]" />
                  </motion.div>
                ))}
              </div>
              <div className="h-4 w-px bg-foreground/15" />
              <p className="text-sm text-foreground/40">
                <span className="font-bold text-foreground/60">500+</span> students already leveling up
              </p>
            </motion.div>
          </div>

          {/* ─── Right: Fox mascot with orbiting rewards ─── */}
          <div className="w-full lg:w-[48%] flex justify-center order-1 lg:order-2">
            <div className="relative" style={{ width: "clamp(320px, 75vw, 500px)", height: "clamp(320px, 75vw, 500px)" }}>

              {/* Glow behind mascot */}
              <motion.div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[55%] h-[55%] rounded-full"
                style={{ background: "radial-gradient(circle, rgba(172,214,99,0.25) 0%, rgba(172,214,99,0.08) 50%, transparent 70%)" }}
                animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* The fox mascot */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center z-10"
                initial={{ opacity: 0, y: 50, scale: 0.7 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.img
                  src={FOX_IMG}
                  alt="MindUp Fox Mascot"
                  className="w-[110%] max-w-none rounded-3xl select-none"
                  style={{ filter: "drop-shadow(0 10px 40px rgba(0,0,0,0.15))" }}
                  draggable={false}
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>

              {/* Speech bubble */}
              <SpeechBubble />

              {/* Orbiting reward badges */}
              <OrbitingOrbs />
            </div>
          </div>

        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#f7f5df] to-transparent pointer-events-none" />
    </section>
  );
};

export default HeroSection;
