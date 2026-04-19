import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Target, Play, BookOpen, ChevronLeft, GraduationCap, ArrowRight, CheckCircle2 } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { toast } from "sonner";
import { useAuth, useUser } from "@clerk/clerk-react";
import { api, type Subject } from "@/lib/api";
import { useProfile } from "@/hooks/useProfile";
import { cn } from "@/lib/utils";

interface Topic {
  id: number;
  name: string;
}

const SUBJECT_ACCENTS = [
  { borderColor: "#4ade80", iconBg: "bg-emerald-100", iconText: "text-emerald-600", selectedBg: "bg-emerald-50", selectedBorder: "border-emerald-300", selectedText: "text-emerald-700" },
  { borderColor: "#fb923c", iconBg: "bg-orange-100", iconText: "text-orange-600", selectedBg: "bg-orange-50", selectedBorder: "border-orange-300", selectedText: "text-orange-700" },
  { borderColor: "#60a5fa", iconBg: "bg-blue-100", iconText: "text-blue-600", selectedBg: "bg-blue-50", selectedBorder: "border-blue-300", selectedText: "text-blue-700" },
  { borderColor: "#a78bfa", iconBg: "bg-violet-100", iconText: "text-violet-600", selectedBg: "bg-violet-50", selectedBorder: "border-violet-300", selectedText: "text-violet-700" },
  { borderColor: "#f472b6", iconBg: "bg-pink-100", iconText: "text-pink-600", selectedBg: "bg-pink-50", selectedBorder: "border-pink-300", selectedText: "text-pink-700" },
  { borderColor: "#34d399", iconBg: "bg-teal-100", iconText: "text-teal-600", selectedBg: "bg-teal-50", selectedBorder: "border-teal-300", selectedText: "text-teal-700" },
];
const getAccent = (i: number) => SUBJECT_ACCENTS[i % SUBJECT_ACCENTS.length];

const QuizzesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getToken } = useAuth();
  const { user } = useUser();
  const { profile } = useProfile();

  const [mySubjects, setMySubjects] = useState<Subject[]>([]);
  const [subjectsLoading, setSubjectsLoading] = useState(true);
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);
  const [selectedSubjectIdx, setSelectedSubjectIdx] = useState<number>(0);

  const [loadingMode, setLoadingMode] = useState<"term" | "topic" | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [chosenTopic, setChosenTopic] = useState<number | "">("");
  const [topicsLoading, setTopicsLoading] = useState(false);

  const preselectedSubjectId = (location.state as { preselectedSubjectId?: number } | null)?.preselectedSubjectId;

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
            const idx = subs.findIndex(s => s.id === preselectedSubjectId);
            setSelectedSubjectId(preselectedSubjectId);
            setSelectedSubjectIdx(idx);
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
  }, [getToken, user, preselectedSubjectId]);

  useEffect(() => {
    if (!selectedSubjectId) { setTopics([]); setChosenTopic(""); return; }
    let cancelled = false;
    setTopicsLoading(true);
    (async () => {
      try {
        const data = await api.getTopics(selectedSubjectId);
        if (!cancelled) { setTopics(data); if (data.length > 0) setChosenTopic(data[0].id); }
      } catch (err) {
        console.error("Failed to fetch topics:", err);
      } finally {
        if (!cancelled) setTopicsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [selectedSubjectId]);

  const selectedSubject = mySubjects.find(s => s.id === selectedSubjectId);
  const selectedAccent = getAccent(selectedSubjectIdx);

  const startQuiz = async (mode: "term" | "topic") => {
    if (!selectedSubjectId) { toast.error("Please select a subject first."); return; }
    if (mode === "topic" && !chosenTopic) { toast.error("Please select a topic first."); return; }
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
          quizMeta: { subjectId: selectedSubjectId, mode, topicId: mode === "topic" ? Number(chosenTopic) : null },
        },
      });
    } catch (err: unknown) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to generate quiz. Is the backend running?");
    } finally {
      setLoadingMode(null);
    }
  };

  return (
    <AppLayout>

      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Adaptive Quizzes</h1>
        <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
          Select a subject, choose your quiz mode, and start testing your knowledge.
        </p>
      </motion.div>

      {/* ── Step 1: Subject Selection ── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mb-6 md:mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-6 h-6 rounded-full gradient-primary text-primary-foreground text-[11px] font-bold flex items-center justify-center">1</div>
          <h2 className="text-sm font-semibold text-foreground">Choose Your Subject</h2>
          {profile?.grade && (
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center gap-1">
              <GraduationCap className="w-3 h-3" /> {profile.grade.name}
            </span>
          )}
        </div>

        {subjectsLoading ? (
          <div className="flex items-center justify-center py-10 bg-card border border-border/60 rounded-2xl">
            <span className="w-7 h-7 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
          </div>
        ) : mySubjects.length === 0 ? (
          <div className="py-10 text-center bg-card border border-border/60 rounded-2xl">
            <BookOpen className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No subjects enrolled. Go to Settings to add subjects.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
            {mySubjects.map((subject, i) => {
              const accent = getAccent(i);
              const isSelected = selectedSubjectId === subject.id;
              return (
                <motion.button
                  key={subject.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + i * 0.04 }}
                  onClick={() => {
                    const newId = isSelected ? null : subject.id;
                    setSelectedSubjectId(newId);
                    if (!isSelected) setSelectedSubjectIdx(i);
                  }}
                  className={cn(
                    "relative flex flex-col items-center gap-2.5 p-4 rounded-2xl border-2 transition-all duration-200",
                    isSelected
                      ? `${accent.selectedBg} ${accent.selectedBorder} shadow-sm`
                      : "bg-card border-border/60 hover:border-border hover:bg-muted/20"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                    isSelected ? accent.iconBg : "bg-muted"
                  )}>
                    <BookOpen className={cn("w-5 h-5", isSelected ? accent.iconText : "text-muted-foreground")} />
                  </div>
                  <span className={cn(
                    "text-xs font-semibold text-center leading-tight",
                    isSelected ? accent.selectedText : "text-foreground"
                  )}>
                    {subject.name}
                  </span>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full gradient-primary flex items-center justify-center shadow-sm"
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

      {/* ── Step 2: Quiz Mode (revealed after subject pick) ── */}
      <AnimatePresence>
        {selectedSubjectId && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            {/* Step label */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-6 h-6 rounded-full bg-muted text-foreground text-[11px] font-bold flex items-center justify-center">2</div>
              <h2 className="text-sm font-semibold text-foreground">
                Choose Quiz Mode
                {selectedSubject && <span className="ml-2 text-primary font-medium">— {selectedSubject.name}</span>}
              </h2>
              <button
                onClick={() => setSelectedSubjectId(null)}
                className="ml-auto text-xs font-medium text-muted-foreground hover:text-foreground flex items-center gap-1 bg-muted/50 hover:bg-muted px-3 py-1.5 rounded-lg transition-all"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Change
              </button>
            </div>

            {/* Mode cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

              {/* Term Mode */}
              <div className="bg-card border border-border/60 rounded-2xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                <div className="h-1 gradient-primary w-full" />
                <div className="p-6 flex flex-col h-full">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Zap className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="font-semibold text-foreground mb-2">Term Mode</h2>
                  <p className="text-sm text-muted-foreground mb-6 leading-relaxed flex-grow">
                    Covers overall term material. The system identifies your weaker topics based on historical accuracy and prioritizes those areas.
                  </p>
                  <button
                    disabled={loadingMode !== null}
                    onClick={() => startQuiz("term")}
                    className={cn(
                      "w-full py-3 gradient-primary text-primary-foreground rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all",
                      loadingMode === "term" ? "opacity-70 cursor-not-allowed" : "hover:opacity-90 active:scale-[0.99]"
                    )}
                  >
                    <Play className="w-4 h-4" />
                    {loadingMode === "term" ? "Generating..." : "Start Term Quiz"}
                  </button>
                </div>
              </div>

              {/* Topic Mode */}
              <div className="bg-card border border-border/60 rounded-2xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                <div className="h-1 bg-violet-400 w-full" />
                <div className="p-6 flex flex-col h-full">
                  <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/20 flex items-center justify-center mb-4">
                    <Target className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <h2 className="font-semibold text-foreground mb-2">Topic Mode</h2>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed flex-grow">
                    Focused revision on a single topic. Questions are restricted to your chosen topic, with automatically scaled difficulty.
                  </p>

                  {topicsLoading ? (
                    <div className="flex items-center gap-2 py-3 mb-4">
                      <span className="w-4 h-4 rounded-full border-2 border-violet-400/30 border-t-violet-400 animate-spin" />
                      <span className="text-xs text-muted-foreground">Loading topics…</span>
                    </div>
                  ) : (
                    <select
                      title="topic-selection"
                      value={chosenTopic}
                      onChange={(e) => setChosenTopic(Number(e.target.value))}
                      disabled={loadingMode !== null || topics.length === 0}
                      className="w-full bg-background border border-border/60 text-foreground text-sm rounded-xl px-3 py-2.5 mb-4 focus:ring-2 focus:ring-violet-400/30 focus:border-violet-400 outline-none transition-all cursor-pointer"
                    >
                      {topics.length === 0
                        ? <option value="">No topics available</option>
                        : topics.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)
                      }
                    </select>
                  )}

                  <button
                    disabled={loadingMode !== null}
                    onClick={() => startQuiz("topic")}
                    className={cn(
                      "w-full py-3 bg-violet-600 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all",
                      loadingMode === "topic" ? "opacity-70 cursor-not-allowed" : "hover:bg-violet-700 active:scale-[0.99]"
                    )}
                  >
                    <Play className="w-4 h-4" />
                    {loadingMode === "topic" ? "Generating..." : "Start Topic Quiz"}
                  </button>
                </div>
              </div>
            </div>

            {/* How it works box */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-card border border-border/60 rounded-2xl p-5 flex gap-4 items-start"
            >
              <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                <BookOpen className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-1">How it works</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Our engine adapts to your level. Beginners get a balanced mix (easy → medium → hard).
                  Experienced learners get stabilized difficulty based on subject average and XP.
                  Recently attempted questions are excluded to keep practice fresh.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Prompt to select a subject ── */}
      {!selectedSubjectId && !subjectsLoading && mySubjects.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border/60 rounded-2xl p-10 text-center"
        >
          <div className="w-12 h-12 rounded-2xl bg-primary/8 border border-primary/20 flex items-center justify-center mx-auto mb-4">
            <ArrowRight className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-base font-semibold text-foreground mb-2">Select a subject above to begin</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Pick one of your enrolled subjects to see available quiz modes.
          </p>
        </motion.div>
      )}
    </AppLayout>
  );
};

export default QuizzesPage;
