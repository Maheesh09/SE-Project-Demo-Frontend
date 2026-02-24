import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

const HeroSection = () => {
  const [showCharacter, setShowCharacter] = useState(false);

  useEffect(() => {
    // Show character after a brief delay
    const showTimer = setTimeout(() => setShowCharacter(true), 100);

    // Hide character after 5 seconds of being valid
    const hideTimer = setTimeout(() => setShowCharacter(false), 2000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-hero" />

      {/* Static gradient orbs for better performance */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/8 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/8 rounded-full blur-3xl" />

      {/* Simplified floating decorative shapes */}
      <div className="absolute w-16 h-16 top-[15%] left-[10%] rounded-2xl bg-accent/10 rotate-12" />
      <div className="absolute w-24 h-24 top-[25%] right-[8%] rounded-full bg-accent/10" />
      <div className="absolute w-12 h-12 bottom-[30%] left-[15%] rounded-2xl bg-accent/10 rotate-45" />
      <div className="absolute w-20 h-20 bottom-[20%] right-[12%] rounded-full bg-accent/10" />
      <div className="absolute w-10 h-10 top-[40%] left-[45%] rounded-2xl bg-accent/10 rotate-12" />

      {/* Gamified Character Pop-out */}
      <AnimatePresence>
        {showCharacter && (
          <motion.img
            src="/cha.png"
            alt="MindUp Mascot"
            className="fixed top-24 right-0 w-40 md:w-64 lg:w-80 object-contain z-50 drop-shadow-2xl cursor-pointer"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 20,
            }}
            whileHover={{ scale: 1.1, rotate: -5 }}
            whileTap={{ scale: 0.9 }}
          />
        )}
      </AnimatePresence>

      <motion.div
        className="container mx-auto px-6 relative z-10 text-center max-w-4xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Main heading */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-tight mb-6 tracking-tight"
        >
          <span className="text-brown">
            Level Up Your Learning
          </span>
          <br className="hidden sm:block" />
          <span className="text-brown-light">with </span>
          <span className="text-primary">
            MindUp
          </span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-lg sm:text-xl max-w-2xl mx-auto mb-10 text-brown-body leading-relaxed"
        >
          An interactive learning experience designed to make studying smarter and more engaging.
          Track progress, earn XP, and master your subjects with AI-powered insights.
        </motion.p>

        {/* Enhanced CTA buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button variant="hero" size="lg" asChild className="group hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl w-full sm:w-auto min-w-[220px]">
            <Link to="/auth?mode=signup">
              Start Learning Free
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <Button variant="hero-outline" size="lg" asChild className="group hover:scale-105 transition-all duration-300 w-full sm:w-auto min-w-[220px]">
            <Link to="#features">
              Explore Features
              <ArrowRight className="w-5 h-5 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </Link>
          </Button>
        </motion.div>

        {/* Enhanced stats row */}
        <motion.div
          variants={itemVariants}
          className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto"
        >
          {[
            { value: "10K+", label: "Students" },
            { value: "25+", label: "Subjects" },
            { value: "50K+", label: "Questions" },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="cursor-default"
            >
              <div className="text-2xl sm:text-3xl font-bold text-brown">
                {stat.value}
              </div>
              <div className="text-sm text-brown-light">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
