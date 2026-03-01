import { motion } from "framer-motion";
import { HelpCircle, Clock, Star, CheckCircle2 } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import BlurText from "@/components/BlurText";
import { BentoCardGrid, MagicCard } from "@/components/MagicCard";
import { cn } from "@/lib/utils";

const quizzes = [
  { title: "Science: Forces & Motion", difficulty: "Easy", questions: 15, time: "20 min", xp: 50, completed: true, progress: 100 },
  { title: "Maths: Algebra Basics", difficulty: "Medium", questions: 20, time: "30 min", xp: 80, completed: true, progress: 75 },
  { title: "English: Grammar Quiz", difficulty: "Easy", questions: 10, time: "15 min", xp: 40, completed: false },
  { title: "Civics: Rights & Duties", difficulty: "Medium", questions: 15, time: "20 min", xp: 70, completed: false },
  { title: "History: Ancient Civilizations", difficulty: "Medium", questions: 15, time: "25 min", xp: 70, completed: false },
  { title: "Health Science: Nutrition", difficulty: "Easy", questions: 12, time: "18 min", xp: 45, completed: false },
  { title: "Maths: Calculus", difficulty: "Hard", questions: 20, time: "35 min", xp: 100, completed: false },
  { title: "Science: Chemistry Basics", difficulty: "Medium", questions: 18, time: "25 min", xp: 75, completed: false },
];

const difficultyColors: Record<string, string> = {
  Easy: "bg-success/10 text-success",
  Medium: "bg-warning/10 text-warning",
  Hard: "bg-destructive/10 text-destructive",
};

const QuizzesPage = () => {
  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-8">
          <BlurText
            text="Quizzes"
            delay={50}
            animateBy="words"
            direction="top"
            className="text-3xl font-display font-bold text-foreground"
          />
          <span className="text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary">
            {quizzes.length} quizzes
          </span>
        </div>
      </motion.div>

      <BentoCardGrid className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quizzes.map((quiz, i) => (
          <MagicCard
            key={quiz.title}
            glowColor="178,197,157"
            enableTilt={true}
            enableStars={true}
            className="rounded-2xl overflow-hidden glass hover:shadow-lg transition-all duration-300"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              className="p-5 h-full relative"
            >
              {quiz.completed && (
                <div className="absolute top-5 right-5">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                </div>
              )}
              <span className={cn("inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-3", difficultyColors[quiz.difficulty])}>
                {quiz.difficulty}
              </span>
              <h3 className="font-display font-bold text-base text-foreground mb-3 leading-tight group-hover:text-primary transition-colors">{quiz.title}</h3>

              <div className="flex flex-col gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5"><HelpCircle className="w-3.5 h-3.5" />{quiz.questions} Questions</div>
                <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{quiz.time} Duration</div>
                <div className="flex items-center gap-1.5 text-xp font-medium"><Star className="w-3.5 h-3.5 fill-xp/20" />{quiz.xp} XP Reward</div>
              </div>

              {quiz.completed && quiz.progress !== undefined ? (
                <div className="mt-5 pt-4 border-t border-border/50">
                  <div className="flex justify-between items-center text-[10px] uppercase font-bold text-muted-foreground mb-1.5">
                    <span>Score</span>
                    <span className="text-success">{quiz.progress}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-border overflow-hidden">
                    <div className="h-full rounded-full bg-success transition-all duration-1000" style={{ width: `${quiz.progress}%` }} />
                  </div>
                </div>
              ) : (
                <div className="mt-5 pt-4 border-t border-border/50">
                  <button className="w-full text-center bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground py-2 rounded-xl text-xs font-bold uppercase tracking-wide transition-all duration-300">
                    Start Quiz
                  </button>
                </div>
              )}
            </motion.div>
          </MagicCard>
        ))}
      </BentoCardGrid>
    </AppLayout>
  );
};

export default QuizzesPage;
