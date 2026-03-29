import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Target, Play, BookOpen, ChevronLeft, GraduationCap, ArrowRight, CheckCircle2 } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import BlurText from "@/components/BlurText";
import { toast } from "sonner";
import { useAuth, useUser } from "@clerk/clerk-react";
import { api, type Subject } from "@/lib/api";
import { useProfile } from "@/hooks/useProfile";
import { cn } from "@/lib/utils";

interface Topic {
  id: number;
  name: string;
}

// ─── Subject color palette ────────────────────────────────────────────────────

const SUBJECT_COLORS = [
  { gradient: "from-emerald-400 to-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", ring: "ring-emerald-500", text: "text-emerald-700", icon: "text-emerald-500" },
  { gradient: "from-amber-400 to-amber-600", bg: "bg-amber-50", border: "border-amber-200", ring: "ring-amber-500", text: "text-amber-700", icon: "text-amber-500" },
  { gradient: "from-blue-400 to-blue-600", bg: "bg-blue-50", border: "border-blue-200", ring: "ring-blue-500", text: "text-blue-700", icon: "text-blue-500" },
  { gradient: "from-purple-400 to-purple-600", bg: "bg-purple-50", border: "border-purple-200", ring: "ring-purple-500", text: "text-purple-700", icon: "text-purple-500" },
  { gradient: "from-rose-400 to-rose-600", bg: "bg-rose-50", border: "border-rose-200", ring: "ring-rose-500", text: "text-rose-700", icon: "text-rose-500" },
  { gradient: "from-teal-400 to-teal-600", bg: "bg-teal-50", border: "border-teal-200", ring: "ring-teal-500", text: "text-teal-700", icon: "text-teal-500" },
];

const getSubjectColor = (index: number) => SUBJECT_COLORS[index % SUBJECT_COLORS.length];

const QuizzesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getToken } = useAuth();
  const { user } = useUser();
  const { profile } = useProfile();

  const [mySubjects, setMySubjects] = useState<Subject[]>([]);
  const [subjectsLoading, setSubjectsLoading] = useState(true);
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);

  const [loadingMode, setLoadingMode] = useState<"term" | "topic" | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [chosenTopic, setChosenTopic] = useState<number | "">(0);
  const [topicsLoading, setTopicsLoading] = useState(false);

  const preselectedSubjectId = (location.state as any)?.preselectedSubjectId;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const token = await getToken();
        if (!token) return;
        const email = user?.primaryEmailAddress?.emailAddress || "";
        const subs = await api.getMySubjects(token, user?.id, email);
        if (!cancelled) {
          setMySubjects(subs);
          if (preselectedSubjectId && subs.some(s => s.id === preselectedSubjectId)) {
            setSelectedSubjectId(preselectedSubjectId);
          }
        }
      } catch (err) {
        console.error("Failed to fetch subjects:", err);
        toast.error("Failed to load your subjects.");
      } finally {
        if (!cancelled) setSubjectsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [getToken, user]);

  useEffect(() => {
    if (!selectedSubjectId) {
      setTopics([]);
      setChosenTopic("");
      return;
    }
    let cancelled = false;
    setTopicsLoading(true);
    (async () => {
      try {
        const data = await api.getTopics(selectedSubjectId);
        if (!cancelled) {
          setTopics(data);
          if (data.length > 0) setChosenTopic(data[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch topics:", err);
      } finally {
        if (!cancelled) setTopicsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [selectedSubjectId]);

  const selectedSubject = mySubjects.find(s => s.id === selectedSubjectId);

  const startQuiz = async (mode: "term" | "topic") => {
    if (!selectedSubjectId) {
      toast.error("Please select a subject first.");
      return;
    }
    if (mode === "topic" && !chosenTopic) {
      toast.error("Please select a topic first.");
      return;
    }

    setLoadingMode(mode);
    try {
      const token = await getToken();
      if (!token) { toast.error("Not authenticated."); return; }

      const payload = {
        student_id: profile?.id,
        subject_id: selectedSubjectId,
        mode,
        ...(mode === "topic" && { topic_id: Number(chosenTopic) })
      };

      const email = user?.primaryEmailAddress?.emailAddress || "";
      const quizData = await api.startQuiz(token, payload, user?.id, email);
      navigate("/quiz/play", {
        state: {
          quizData,
          quizMeta: {
            subjectId: selectedSubjectId,
            mode,
            topicId: mode === "topic" ? Number(chosenTopic) : null,
          },
        },
      });

    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to generate quiz. Is the backend running?");
    } finally {
      setLoadingMode(null);
    }
  };


  return (
    <AppLayout>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-7">
        <BlurText
          text="Adaptive Quizzes"
          delay={50}
          animateBy="words"
          direction="top"
          className="text-3xl font-display font-bold text-foreground"
        />
        <p className="text-muted-foreground text-sm max-w-2xl mt-2 leading-relaxed">
          Select a subject, choose your quiz mode, and let our adaptive engine challenge you with
          questions tailored to your performance level.
        </p>
      </motion.div>

      {/* ── Step 1: Subject Selection ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mb-7"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-7 h-7 rounded-full gradient-primary text-primary-foreground text-xs font-black flex items-center justify-center shadow-sm">1</div>
          <h2 className="text-lg font-display font-bold text-foreground">Choose Your Subject</h2>
          {profile?.grade && (
            <span className="ml-1 text-xs font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center gap-1">
              <GraduationCap className="w-3 h-3" /> {profile.grade.name}
            </span>
          )}
        </div>

        {subjectsLoading ? (
          <div className="flex items-center justify-center py-12 bg-card border border-border/60 rounded-2xl">
            <span className="w-8 h-8 rounded-full border-3 border-primary/30 border-t-primary animate-spin" />
          </div>
        ) : mySubjects.length === 0 ? (
          <div className="py-12 text-center bg-card border border-border/60 rounded-2xl">
            <BookOpen className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground mb-2">No subjects enrolled yet.</p>
            <p className="text-xs text-muted-foreground">
              Complete your profile or go to Settings to select subjects for your grade.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {mySubjects.map((subject, i) => {
              const color = getSubjectColor(i);
              const isSelected = selectedSubjectId === subject.id;
              return (
                <motion.button
                  key={subject.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + i * 0.04 }}
                  onClick={() => setSelectedSubjectId(isSelected ? null : subject.id)}
                  className={cn(
                    "relative flex flex-col items-center gap-2.5 p-4 rounded-2xl border-2 transition-all duration-200 group",
                    isSelected
                      ? `${color.bg} ${color.border} shadow-md ring-2 ${color.ring} ring-offset-2 ring-offset-background`
                      : "bg-card border-border/60 hover:border-border hover:shadow-sm hover:bg-muted/20"
                  )}
                >
                  <div className={cn(
                    "w-11 h-11 rounded-xl flex items-center justify-center shadow-sm transition-all",
                    isSelected
                      ? `bg-gradient-to-br ${color.gradient} text-white`
                      : "bg-muted text-muted-foreground group-hover:bg-muted/80"
                  )}>
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <span className={cn(
                    "text-xs font-bold transition-colors text-center leading-tight",
                    isSelected ? color.text : "text-foreground"
                  )}>
                    {subject.name}
                  </span>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-sm"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary-foreground" />
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* ── Step 2: Quiz Mode ── */}
      <AnimatePresence>
        {selectedSubjectId && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-7 h-7 rounded-full gradient-accent text-accent-foreground text-xs font-black flex items-center justify-center shadow-sm">2</div>
              <h2 className="text-lg font-display font-bold text-foreground">
                Choose Quiz Mode
                {selectedSubject && (
                  <span className="ml-2 text-sm font-semibold text-primary">— {selectedSubject.name}</span>
                )}
              </h2>
              <button
                onClick={() => setSelectedSubjectId(null)}
                className="ml-auto text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors bg-muted/50 hover:bg-muted px-3 py-1.5 rounded-lg"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Change subject
              </button>
            </div>

            {/* Mode Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-7">
              {/* Term Mode */}
              <div className="bg-card border border-border/60 rounded-2xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                <div className="h-1.5 gradient-primary w-full" />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                  className="p-7 flex flex-col h-full"
                >
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>

                  <h2 className="font-display font-bold text-xl text-foreground mb-3">Term Mode</h2>

                  <p className="text-sm text-muted-foreground mb-7 leading-relaxed flex-grow">
                    Focuses on overall term material. The system consults your historical statistics to identify weak topics based on lower accuracy percentages, and prioritizes those areas when selecting questions. This personalizes your quiz toward areas needing the most improvement.
                  </p>

                  <button
                    disabled={loadingMode !== null}
                    onClick={() => startQuiz("term")}
                    className={cn(
                      "w-full py-3.5 gradient-primary text-primary-foreground rounded-xl text-sm font-bold uppercase tracking-wide transition-all shadow-sm flex items-center justify-center gap-2 mt-auto",
                      loadingMode === "term" ? "opacity-70 cursor-not-allowed" : "hover:opacity-90 hover:shadow-md"
                    )}
                  >
                    <Play className="w-4 h-4" /> {loadingMode === "term" ? "Generating..." : "Start Term Quiz"}
                  </button>
                </motion.div>
              </div>

              {/* Topic Mode */}
              <div className="bg-card border border-border/60 rounded-2xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                <div className="h-1.5 gradient-accent w-full" />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="p-7 flex flex-col h-full"
                >
                  <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-5">
                    <Target className="w-6 h-6 text-accent" />
                  </div>

                  <h2 className="font-display font-bold text-xl text-foreground mb-3">Topic Mode</h2>

                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed flex-grow">
                    Perfect for targeted revision. All questions are strictly restricted to your selected topic to ensure focused practice. The difficulty scales automatically within this topic.
                  </p>

                  {topicsLoading ? (
                    <div className="flex items-center gap-2 py-3 mb-4">
                      <span className="w-5 h-5 rounded-full border-2 border-accent/30 border-t-accent animate-spin" />
                      <span className="text-xs text-muted-foreground">Loading topics…</span>
                    </div>
                  ) : (
                    <select
                      title="topic-selection"
                      value={chosenTopic}
                      onChange={(e) => setChosenTopic(Number(e.target.value))}
                      disabled={loadingMode !== null || topics.length === 0}
                      className="w-full bg-background border border-border/60 text-foreground text-sm rounded-xl px-4 py-3 mb-5 focus:ring-2 focus:ring-accent/40 focus:border-accent outline-none transition-all cursor-pointer"
                    >
                      {topics.length === 0 ? (
                        <option value="">No topics available</option>
                      ) : (
                        topics.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name}
                          </option>
                        ))
                      )}
                    </select>
                  )}

                  <button
                    disabled={loadingMode !== null}
                    onClick={() => startQuiz("topic")}
                    className={cn(
                      "w-full py-3.5 gradient-accent text-accent-foreground rounded-xl text-sm font-bold uppercase tracking-wide transition-all shadow-sm flex items-center justify-center gap-2 mt-auto",
                      loadingMode === "topic" ? "opacity-70 cursor-not-allowed" : "hover:opacity-90 hover:shadow-md"
                    )}
                  >
                    <Play className="w-4 h-4" /> {loadingMode === "topic" ? "Generating..." : "Start Topic Quiz"}
                  </button>
                </motion.div>
              </div>
            </div>

            {/* Info Section about Adaptive Learning */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card border border-border/60 rounded-2xl p-6"
            >
              <div className="flex flex-col md:flex-row gap-4 md:items-start">
                <div className="w-11 h-11 rounded-2xl bg-muted border border-border/60 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground mb-2">How it works</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Our intelligent engine adjusts to you. If you're a beginner (fewer than five quizzes in a subject),
                    you'll receive a balanced and protective mix of questions (e.g., 8 easy, 4 medium, 3 hard) to avoid
                    sudden difficulty spikes. Experienced learners receive a stabilized difficulty mix based on their
                    subject average and total XP. Recently attempted questions are actively excluded to keep practice fresh!
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Prompt when no subject selected ── */}
      {!selectedSubjectId && !subjectsLoading && mySubjects.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border/60 rounded-2xl p-10 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary/8 border border-primary/20 flex items-center justify-center mx-auto mb-4">
            <ArrowRight className="w-8 h-8 text-primary animate-pulse" />
          </div>
          <h3 className="text-lg font-display font-bold text-foreground mb-2">Select a subject above to begin</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Pick one of your enrolled subjects to see available quiz modes and start testing your knowledge.
          </p>
        </motion.div>
      )}
    </AppLayout>
  );
};

export default QuizzesPage;
