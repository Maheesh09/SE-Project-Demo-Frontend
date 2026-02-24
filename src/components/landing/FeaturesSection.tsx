import { BookOpen, Brain, Trophy, Target, StickyNote, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: BookOpen,
    title: "Interactive Textbooks",
    description: "Access digital textbooks with built-in quizzes and progress tracking for every subject.",
  },
  {
    icon: Brain,
    title: "AI-Powered Help",
    description: "Get instant explanations and guided solutions powered by intelligent tutoring.",
  },
  {
    icon: Trophy,
    title: "Gamified Learning",
    description: "Earn XP, unlock levels, and compete on leaderboards to stay motivated.",
  },
  {
    icon: Target,
    title: "Exam Readiness",
    description: "Track your readiness score and identify weak areas before exams.",
  },
  {
    icon: StickyNote,
    title: "Smart Notes",
    description: "Create and organize sticky notes for quick revision during study sessions.",
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    description: "Detailed insights into your learning patterns and improvement areas.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut" as const,
    },
  },
};

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 bg-background relative overflow-hidden">
      {/* Static background decoration for better performance */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-block mb-4">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider bg-primary/10 px-4 py-2 rounded-full">
              Features
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Everything You Need to <span className="text-primary">Excel</span>
          </h2>
          <p className="text-brown-body max-w-2xl mx-auto text-lg">
            MindUp combines the best of modern EdTech with a gamified experience designed for effective learning.
          </p>
        </motion.div>

        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              whileHover={{ y: -4, transition: { duration: 0.2, ease: "easeOut" as const } }}
              className="bg-card rounded-xl p-6 shadow-soft hover:shadow-card transition-shadow duration-300 border border-transparent hover:border-primary/20 cursor-pointer group"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-sage-light to-primary/10 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-200">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-brown">{feature.title}</h3>
              <p className="text-brown-body text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
