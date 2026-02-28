import { motion } from "framer-motion";
import { HelpCircle, Clock, Star, CheckCircle2 } from "lucide-react";
import AppLayout from "@/components/AppLayout";
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
          <h1 className="text-3xl font-display font-bold text-foreground">Quizzes</h1>
          <span className="text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary">
            {quizzes.length} quizzes
          </span>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-4">
        {quizzes.map((quiz, i) => (
          <motion.div
            key={quiz.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.4 }}
            className="glass glass-hover rounded-2xl p-5 relative"
          >
            {quiz.completed && (
              <div className="absolute top-4 right-4">
                <CheckCircle2 className="w-6 h-6 text-success" />
              </div>
            )}
            <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full", difficultyColors[quiz.difficulty])}>
              {quiz.difficulty}
            </span>
            <h3 className="mt-3 font-display font-bold text-foreground">{quiz.title}</h3>
            <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><HelpCircle className="w-3.5 h-3.5" />{quiz.questions} Qs</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{quiz.time}</span>
              <span className="flex items-center gap-1 text-xp"><Star className="w-3.5 h-3.5" />{quiz.xp} XP</span>
            </div>
            {quiz.completed && quiz.progress !== undefined ? (
              <div className="mt-4">
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-success" style={{ width: `${quiz.progress}%` }} />
                </div>
              </div>
            ) : (
              <button className="mt-4 gradient-primary text-primary-foreground px-5 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">
                Start Quiz
              </button>
            )}
          </motion.div>
        ))}
      </div>
    </AppLayout>
  );
};

export default QuizzesPage;
