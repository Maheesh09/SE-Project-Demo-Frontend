import { motion } from "framer-motion";
import { Zap, Target, Play, BookOpen } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import BlurText from "@/components/BlurText";

const QuizzesPage = () => {
  return (
    <AppLayout>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-3">
            <BlurText
              text="Adaptive Quizzes"
              delay={50}
              animateBy="words"
              direction="top"
              className="text-3xl font-display font-bold text-foreground"
            />
          </div>
        </div>
        <p className="text-muted-foreground text-sm max-w-2xl mt-2 leading-relaxed">
          Test your knowledge and track your growth with our adaptive learning engine. Questions are dynamically selected based on your historical performance, ensuring a balanced and personalized challenge every time.
        </p>
      </motion.div>

      {/* Mode Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Term Mode */}
        <div className="bg-card border border-border/50 rounded-3xl overflow-hidden hover:shadow-md transition-all duration-300">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="p-8 h-full flex flex-col"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
              <Zap className="w-7 h-7 text-primary" />
            </div>

            <h2 className="font-display font-bold text-2xl text-foreground mb-4">Term Mode</h2>

            <p className="text-sm text-muted-foreground mb-8 leading-relaxed flex-grow">
              Focuses on overall term material. The system consults your historical statistics to identify weak topics based on lower accuracy percentages, and prioritizes those areas when selecting questions. This personalizes your quiz toward areas needing the most improvement.
            </p>

            <button
              className="w-full text-center bg-primary text-primary-foreground hover:bg-primary/90 py-3.5 rounded-xl text-sm font-bold uppercase tracking-wide transition-all duration-300 shadow-sm flex items-center justify-center gap-2 mt-auto cursor-pointer"
            >
              <Play className="w-4 h-4" /> Start Term Quiz
            </button>
          </motion.div>
        </div>

        {/* Topic Mode */}
        <div className="bg-card border border-border/50 rounded-3xl overflow-hidden hover:shadow-md transition-all duration-300">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="p-8 h-full flex flex-col"
          >
            <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-6">
              <Target className="w-7 h-7 text-accent" />
            </div>

            <h2 className="font-display font-bold text-2xl text-foreground mb-4">Topic Mode</h2>

            <p className="text-sm text-muted-foreground mb-8 leading-relaxed flex-grow">
              Perfect for targeted revision. All questions are strictly restricted to your selected topic to ensure focused practice. The difficulty scales automatically within this topic, ensuring exposure to new content without sudden difficulty spikes.
            </p>

            <button
              className="w-full text-center bg-accent text-accent-foreground hover:bg-accent/90 py-3.5 rounded-xl text-sm font-bold uppercase tracking-wide transition-all duration-300 shadow-sm flex items-center justify-center gap-2 mt-auto cursor-pointer"
            >
              <Play className="w-4 h-4" /> Start Topic Quiz
            </button>
          </motion.div>
        </div>
      </div>

      {/* Info Section about Adaptive Learning */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card border border-border/50 rounded-3xl p-6 md:p-8"
      >
        <div className="flex flex-col md:flex-row gap-6 md:items-center">
          <div className="w-12 h-12 rounded-2xl bg-muted border border-border/50 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-6 h-6 text-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground mb-2">How it works</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Our intelligent engine adjusts to you. If you're a beginner (fewer than five quizzes in a subject),
              you'll receive a balanced and protective mix of questions (e.g., 8 easy, 4 medium, 3 hard) to avoid
              sudden difficulty spikes. Experienced learners receive a stabilized difficulty mix based on their
              subject average and total XP. Recently attempted questions are actively excluded to keep practice fresh!
            </p>
          </div>
        </div>
      </motion.div>
    </AppLayout>
  );
};

export default QuizzesPage;
