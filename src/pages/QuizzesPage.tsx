import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, Clock, Star, CheckCircle2, Zap, Trophy, Target, Play, RotateCcw, Filter } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import BlurText from "@/components/BlurText";
import { BentoCardGrid, MagicCard } from "@/components/MagicCard";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";

const quizzes = [
  { title: "Science: Forces & Motion", subject: "Science", difficulty: "Easy", questions: 15, timeMinutes: 20, xp: 50, completed: true, score: 100 },
  { title: "Maths: Algebra Basics", subject: "Maths", difficulty: "Medium", questions: 20, timeMinutes: 30, xp: 80, completed: true, score: 75 },
  { title: "English: Grammar Quiz", subject: "English", difficulty: "Easy", questions: 10, timeMinutes: 15, xp: 40, completed: false },
  { title: "Civics: Rights & Duties", subject: "Civics", difficulty: "Medium", questions: 15, timeMinutes: 20, xp: 70, completed: false },
  { title: "History: Ancient Civilizations", subject: "History", difficulty: "Medium", questions: 15, timeMinutes: 25, xp: 70, completed: false },
  { title: "Health Science: Nutrition", subject: "Health", difficulty: "Easy", questions: 12, timeMinutes: 18, xp: 45, completed: false },
  { title: "Maths: Calculus", subject: "Maths", difficulty: "Hard", questions: 20, timeMinutes: 35, xp: 100, completed: false },
  { title: "Science: Chemistry Basics", subject: "Science", difficulty: "Medium", questions: 18, timeMinutes: 25, xp: 75, completed: false },
];

const difficultyColors: Record<string, string> = {
  Easy: "bg-success/10 text-success",
  Medium: "bg-warning/10 text-warning",
  Hard: "bg-destructive/10 text-destructive",
};

const filters = ["All", "Attempted", "Easy", "Medium", "Hard"];

// --- Live countdown timer component ---
const QuizTimer = ({ seconds, running }: { seconds: number; running: boolean }) => {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setTimeLeft(seconds);
  }, [seconds]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => (t > 0 ? t - 1 : 0));
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  const pct = Math.round((timeLeft / seconds) * 100);
  const mins = Math.floor(timeLeft / 60).toString().padStart(2, "0");
  const secs = (timeLeft % 60).toString().padStart(2, "0");
  const urgent = timeLeft <= 30 && timeLeft > 0;
  const done = timeLeft === 0;

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Circular progress */}
      <div className="relative w-20 h-20">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="34" fill="none" stroke="hsl(var(--border))" strokeWidth="6" />
          <circle
            cx="40" cy="40" r="34" fill="none"
            stroke={done ? "hsl(var(--destructive))" : urgent ? "hsl(var(--warning))" : "hsl(var(--primary))"}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 34}`}
            strokeDashoffset={`${2 * Math.PI * 34 * (1 - pct / 100)}`}
            style={{ transition: "stroke-dashoffset 1s linear, stroke 0.3s" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn(
            "text-sm font-display font-bold tabular-nums",
            done ? "text-destructive" : urgent ? "text-warning" : "text-foreground"
          )}>
            {done ? "Done" : `${mins}:${secs}`}
          </span>
        </div>
      </div>
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
        {done ? "Time's up!" : running ? "Time remaining" : "Ready to start"}
      </p>
    </div>
  );
};

// --- Active quiz modal overlay ---
const ActiveQuizPanel = ({
  quiz,
  onClose,
}: {
  quiz: typeof quizzes[0];
  onClose: () => void;
}) => {
  const totalSeconds = quiz.timeMinutes * 60;
  const [running, setRunning] = useState(false);
  const [started, setStarted] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.97 }}
      className="bg-card border border-border/50 rounded-2xl p-6 shadow-lg mb-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className={cn("inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-2", difficultyColors[quiz.difficulty])}>
            {quiz.difficulty}
          </span>
          <h2 className="text-lg font-display font-bold text-foreground">{quiz.title}</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{quiz.questions} questions · {quiz.xp} XP reward</p>
        </div>
        <button onClick={onClose} className="text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg border border-border/50 hover:bg-muted/50">
          Close
        </button>
      </div>

      <div className="flex items-center gap-8 justify-center py-4 border-t border-b border-border/40 my-4">
        <QuizTimer seconds={totalSeconds} running={running} />

        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Questions", value: quiz.questions, icon: HelpCircle },
              { label: "Duration", value: `${quiz.timeMinutes}m`, icon: Clock },
              { label: "XP Reward", value: `+${quiz.xp}`, icon: Star },
            ].map((s) => (
              <div key={s.label} className="bg-muted/40 rounded-xl p-3 text-center">
                <s.icon className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
                <p className="text-sm font-bold text-foreground">{s.value}</p>
                <p className="text-[10px] text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            {!started ? (
              <button
                onClick={() => { setStarted(true); setRunning(true); }}
                className="flex-1 flex items-center justify-center gap-2 gradient-primary text-primary-foreground py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity"
              >
                <Play className="w-4 h-4" /> Start Quiz
              </button>
            ) : (
              <>
                <button
                  onClick={() => setRunning((r) => !r)}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary/10 text-primary py-2.5 rounded-xl text-sm font-bold hover:bg-primary/20 transition-colors"
                >
                  {running ? "Pause" : "Resume"}
                </button>
                <button
                  onClick={() => { setRunning(false); setStarted(false); }}
                  className="p-2.5 rounded-xl border border-border/50 text-muted-foreground hover:bg-muted/50 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          {!started && (
            <p className="text-[10px] text-muted-foreground text-center">
              The timer starts when you click "Start Quiz"
            </p>
          )}
        </div>
      </div>

      {/* Tips */}
      <div className="mt-3 grid grid-cols-3 gap-3">
        {[
          { tip: "Read each question carefully before answering." },
          { tip: "Skip hard questions first, come back later." },
          { tip: "Stay calm — you can try again for more XP!" },
        ].map((t, i) => (
          <div key={i} className="bg-muted/30 rounded-xl p-3">
            <p className="text-[10px] text-muted-foreground leading-relaxed">{t.tip}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// ---- Main page ----
const QuizzesPage = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeQuiz, setActiveQuiz] = useState<typeof quizzes[0] | null>(null);

  const totalXP = quizzes.filter((q) => q.completed).reduce((s, q) => s + q.xp, 0);
  const completed = quizzes.filter((q) => q.completed).length;
  const avgScore = quizzes.filter((q) => q.completed && q.score !== undefined)
    .reduce((s, q, _, arr) => s + (q.score ?? 0) / arr.length, 0);

  const filtered = quizzes.filter((q) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Attempted") return q.completed;
    return q.difficulty === activeFilter;
  });

  return (
    <AppLayout>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-3">
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
        </div>
        <p className="text-muted-foreground text-sm">Test your knowledge, earn XP, and track your growth.</p>
      </motion.div>

      {/* Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="grid grid-cols-4 gap-4 mb-6"
      >
        {[
          { icon: Trophy, label: "XP Earned", value: `${totalXP} XP`, color: "text-xp", bg: "bg-xp/10" },
          { icon: CheckCircle2, label: "Completed", value: `${completed} / ${quizzes.length}`, color: "text-success", bg: "bg-success/10" },
          { icon: Target, label: "Avg Score", value: `${Math.round(avgScore)}%`, color: "text-primary", bg: "bg-primary/10" },
          { icon: Zap, label: "Available", value: `${quizzes.length - completed} quizzes`, color: "text-accent", bg: "bg-accent/10" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className="bg-card rounded-2xl p-4 flex items-center gap-3 border border-border/50"
          >
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className={`text-sm font-bold ${s.color}`}>{s.value}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Daily Challenge Banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18 }}
        className="bg-card border border-border/50 rounded-2xl p-4 mb-6 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center flex-shrink-0">
            <Target className="w-5 h-5 text-accent-foreground" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">Daily Challenge</p>
            <p className="text-xs text-muted-foreground">Complete any quiz today to earn a <span className="text-accent font-semibold">+30 bonus XP</span> streak multiplier</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-right">
          <div>
            <p className="text-xs text-muted-foreground">Resets in</p>
            <p className="text-sm font-bold text-foreground tabular-nums">03h 41m</p>
          </div>
          <div className="w-10 h-10 rounded-xl border border-border/50 flex items-center justify-center">
            <Clock className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      </motion.div>

      {/* Active quiz panel */}
      <AnimatePresence>
        {activeQuiz && (
          <ActiveQuizPanel quiz={activeQuiz} onClose={() => setActiveQuiz(null)} />
        )}
      </AnimatePresence>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 mb-5">
        <Filter className="w-3.5 h-3.5 text-muted-foreground" />
        <p className="text-xs text-muted-foreground mr-1">Filter by difficulty:</p>
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={cn(
              "text-xs font-semibold px-3 py-1.5 rounded-full border transition-all duration-200",
              activeFilter === f
                ? "gradient-primary text-primary-foreground border-transparent"
                : "bg-card text-muted-foreground border-border/50 hover:border-primary/50 hover:text-primary"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Quiz cards grid */}
      <BentoCardGrid className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map((quiz, i) => (
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
              transition={{ delay: i * 0.04, duration: 0.3 }}
              className="p-5 h-full relative flex flex-col"
            >
              {quiz.completed && (
                <div className="absolute top-4 right-4">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                </div>
              )}

              <span className={cn("inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-3 w-fit", difficultyColors[quiz.difficulty])}>
                {quiz.difficulty}
              </span>

              <h3 className="font-display font-bold text-sm text-foreground mb-3 leading-tight pr-4">{quiz.title}</h3>

              <div className="flex flex-col gap-1.5 text-xs text-muted-foreground mb-auto">
                <div className="flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5" /> {quiz.questions} Questions
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> {quiz.timeMinutes} min duration
                </div>
                <div className="flex items-center gap-1.5 text-xp font-medium">
                  <Star className="w-3.5 h-3.5 fill-xp/20" /> {quiz.xp} XP Reward
                </div>
              </div>

              {quiz.completed && quiz.score !== undefined ? (
                <div className="mt-4 pt-3 border-t border-border/50">
                  <div className="flex justify-between items-center text-[10px] uppercase font-bold text-muted-foreground mb-1.5">
                    <span>Your Score</span>
                    <span className="text-success">{quiz.score}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-border overflow-hidden">
                    <div className="h-full rounded-full bg-success transition-all duration-1000" style={{ width: `${quiz.score}%` }} />
                  </div>
                  <button
                    onClick={() => setActiveQuiz(quiz)}
                    className="mt-3 w-full text-center bg-muted/50 text-muted-foreground hover:bg-primary/10 hover:text-primary py-1.5 rounded-xl text-xs font-bold uppercase tracking-wide transition-all duration-300"
                  >
                    Retry Quiz
                  </button>
                </div>
              ) : (
                <div className="mt-4 pt-3 border-t border-border/50">
                  <button
                    onClick={() => setActiveQuiz(quiz)}
                    className="w-full text-center bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground py-2 rounded-xl text-xs font-bold uppercase tracking-wide transition-all duration-300"
                  >
                    Start Quiz
                  </button>
                </div>
              )}
            </motion.div>
          </MagicCard>
        ))}
      </BentoCardGrid>

      {/* Empty State */}
      {filtered.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-24 flex flex-col items-center justify-center text-center border-2 border-dashed border-border/50 rounded-3xl bg-muted/5 mt-4">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <Target className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-display font-bold text-foreground mb-1">
            {activeFilter === "Attempted" ? "No quizzes attempted yet" : "No quizzes found"}
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm mb-6">
            {activeFilter === "Attempted"
              ? "You haven't completed any quizzes yet. Start one now to earn XP and climb the leaderboard!"
              : `We couldn't find any quizzes matching the "${activeFilter}" filter.`}
          </p>
          <button
            onClick={() => setActiveFilter("All")}
            className="px-6 py-2.5 bg-background border border-border rounded-xl text-sm font-bold text-foreground hover:bg-muted transition-colors shadow-sm"
          >
            Explore All Quizzes
          </button>
        </motion.div>
      )}

      {/* Study reminder footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-8 bg-card border border-border/50 rounded-2xl p-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary" />
          </div>
          <p className="text-xs text-muted-foreground">
            <span className="text-foreground font-semibold">Pro Tip:</span> Completing quizzes within the time limit awards a <span className="text-primary font-semibold">Speed Bonus</span> — try to beat the clock!
          </p>
        </div>
      </motion.div>
    </AppLayout>
  );
};

export default QuizzesPage;
