
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const Stars = () => {
  const stars = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: `${Math.random() * 5}s`,
    duration: `${2 + Math.random() * 4}s`,
  }));

  return (
    <>
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            left: star.left,
            top: star.top,
            "--delay": star.delay,
            "--duration": star.duration,
          } as React.CSSProperties}
        />
      ))}
    </>
  );
};

const HeroSection = () => {
  const [joinText, setJoinText] = useState("");
  const [howText, setHowText] = useState("");
  const [showCursor1, setShowCursor1] = useState(true);
  const [showCursor2, setShowCursor2] = useState(true);

  useEffect(() => {
    const fullText1 = "Join Us";
    let i = 0;
    const t1 = setInterval(() => {
      if (i < fullText1.length) {
        setJoinText(fullText1.slice(0, i + 1));
        i++;
      } else {
        clearInterval(t1);
        // Start second button typing after first finishes
        const fullText2 = "How It Works";
        let j = 0;
        const t2 = setInterval(() => {
          if (j < fullText2.length) {
            setHowText(fullText2.slice(0, j + 1));
            j++;
          } else {
            clearInterval(t2);
          }
        }, 100);
      }
    }, 150);
    return () => clearInterval(t1);
  }, []);

  useEffect(() => {
    const c = setInterval(() => {
      setShowCursor1((p) => !p);
      setShowCursor2((p) => !p);
    }, 530);
    return () => clearInterval(c);
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-left bg-no-repeat" style={{ backgroundImage: `url('/hero-bg.jpg')`, transform: 'scaleX(-1)' }} />
      <div className="absolute inset-0 bg-gradient-to-l from-[#f7f5df] via-[#f7f5df]/80 to-[#f7f5df]/20" />
      <Stars />

      <div className="relative z-10 container mx-auto px-4 pt-20 flex justify-center md:justify-end">
        <div className="text-center md:text-right max-w-3xl">
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[0.95] mb-4 sm:mb-6 uppercase">
            {["Level", "Up", "Your", "Mind"].map((word, i) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 50, rotateX: -40 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.2 * i,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`inline-block mr-[0.2em] ${
                  word === "Mind"
                    ? "text-[#acd663] lg:text-9xl"
                    : "text-foreground"
                }`}
              >
                {word}
              </motion.span>
            ))}
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1, ease: [0.22, 1, 0.36, 1] }}
            className="text-base sm:text-lg md:text-xl text-foreground/60 tracking-wide font-medium mb-8 sm:mb-10 leading-relaxed"
          >
            Transform how you learn with quests, XP rewards,<br />streaks, and leaderboards. Education has never been this fun.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap items-center justify-center md:justify-end gap-4"
          >
            <a
              href="#about"
              className="inline-block rounded-full px-8 sm:px-10 py-2.5 sm:py-3 text-sm sm:text-base uppercase tracking-[0.15em] sm:tracking-[0.2em] font-bold bg-[#acd663] text-black hover:bg-[#96ba50] transition-all duration-300 hover:shadow-lg hover:shadow-[#acd663]/30 hover:-translate-y-0.5 active:translate-y-0"
            >
              {joinText}
              <span className={`inline-block w-[2px] h-[1em] bg-black ml-1 align-middle transition-opacity duration-100 ${showCursor1 ? 'opacity-100' : 'opacity-0'}`} />
            </a>
            <a
              href="#features"
              className="inline-block rounded-full px-8 sm:px-10 py-2.5 sm:py-3 text-sm sm:text-base uppercase tracking-[0.15em] sm:tracking-[0.2em] font-bold border-2 border-foreground/20 text-foreground hover:border-[#acd663] hover:text-[#acd663] transition-all duration-300 hover:-translate-y-0.5"
            >
              {howText}
              <span className={`inline-block w-[2px] h-[1em] bg-current ml-1 align-middle transition-opacity duration-100 ${showCursor2 ? 'opacity-100' : 'opacity-0'}`} />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
