import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Brain, GraduationCap, Plus, Check, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { cn } from "@/lib/utils";
import { useProfile } from "@/hooks/useProfile";
import { useAuth, useUser } from "@clerk/clerk-react";
import { api, type Subject } from "@/lib/api";

const SUBJECT_ACCENTS = [
  { borderColor: "#4ade80", iconBg: "bg-emerald-100 dark:bg-emerald-900/30", iconText: "text-emerald-600" },
  { borderColor: "#fb923c", iconBg: "bg-orange-100 dark:bg-orange-900/30", iconText: "text-orange-600" },
  { borderColor: "#60a5fa", iconBg: "bg-blue-100 dark:bg-blue-900/30", iconText: "text-blue-600" },
  { borderColor: "#a78bfa", iconBg: "bg-violet-100 dark:bg-violet-900/30", iconText: "text-violet-600" },
  { borderColor: "#f472b6", iconBg: "bg-pink-100 dark:bg-pink-900/30", iconText: "text-pink-600" },
  { borderColor: "#34d399", iconBg: "bg-teal-100 dark:bg-teal-900/30", iconText: "text-teal-600" },
];
const getAccent = (i: number) => SUBJECT_ACCENTS[i % SUBJECT_ACCENTS.length];

const CoursesPage = () => {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const { getToken } = useAuth();
  const { user } = useUser();

  const [mySubjects, setMySubjects] = useState<Subject[]>([]);
  const [allSubjects, setAllSubjects] = useState<Subject[]>([]);
  const [subjectsLoading, setSubjectsLoading] = useState(true);
  const [addingId, setAddingId] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!profile?.grade?.id) return;
      try {
        const token = await getToken();
        if (!token) return;
        const email = user?.primaryEmailAddress?.emailAddress || "";
        const [subs, allSubs] = await Promise.all([
            api.getMySubjects(token, user?.id, email),
            api.getAvailableSubjects(profile.grade.id)
        ]);
        if (!cancelled) {
            setMySubjects(subs);
            setAllSubjects(allSubs);
        }
      } catch (err) {
        console.error("Failed to fetch subjects:", err);
      } finally {
        if (!cancelled) setSubjectsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [getToken, user, profile?.grade?.id]);

  const enrolledIds = new Set(mySubjects.map(s => s.id));
  const availableSubjects = allSubjects.filter(s => !enrolledIds.has(s.id));

  const handleAddSubject = async (subject: Subject) => {
    setAddingId(subject.id);
    try {
      const token = await getToken();
      const email = user?.primaryEmailAddress?.emailAddress || "";
      await api.addMySubjects(token!, [subject.id], user?.id, email);
      // Immediately add to enrolled list and remove from available list
      setMySubjects(prev => [...prev, subject]);
    } catch (err) {
      console.error("Failed to add subject", err);
    } finally {
      setAddingId(null);
    }
  };

  return (
    <AppLayout>

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between gap-4 mb-6 md:mb-8"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">My Subjects</h1>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <p className="text-sm text-muted-foreground">Your enrolled subjects</p>
            {profile?.grade && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                <GraduationCap className="w-3 h-3" /> {profile.grade.name}
              </span>
            )}
          </div>
        </div>
        {!subjectsLoading && (
          <div className="text-right flex-shrink-0">
            <p className="text-2xl font-bold text-foreground">{mySubjects.length}</p>
            <p className="text-xs text-muted-foreground">subjects</p>
          </div>
        )}
      </motion.div>

      {subjectsLoading ? (
        <div className="flex items-center justify-center py-24">
          <span className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
        </div>
      ) : (
        <>
            {/* ── Enrolled Subjects ── */}
            {mySubjects.length === 0 ? (
                <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-16 flex flex-col items-center justify-center text-center border border-dashed border-border/60 rounded-2xl mb-8"
                >
                <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
                    <BookOpen className="w-7 h-7 text-muted-foreground/50" />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-1">No subjects enrolled</h3>
                <p className="text-sm text-muted-foreground max-w-xs mb-5">
                    Select from the available subjects below to start learning.
                </p>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                <AnimatePresence mode="popLayout">
                    {mySubjects.map((subject, i) => {
                    const accent = getAccent(i);
                    return (
                        <motion.div
                        key={`enrolled-${subject.id}`}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.22 }}
                        className="bg-card border border-border/60 border-l-[3px] rounded-2xl p-5 hover:shadow-md hover:-translate-y-0.5 hover:border-border transition-all duration-200 flex flex-col"
                        style={{ borderLeftColor: accent.borderColor }}
                        >
                        {/* Icon + index */}
                        <div className="flex items-start justify-between mb-4">
                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", accent.iconBg)}>
                            <BookOpen className={cn("w-5 h-5", accent.iconText)} />
                            </div>
                            <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Check className="w-3 h-3" /> Enrolled
                            </span>
                        </div>

                        {/* Name */}
                        <h3 className="text-sm font-semibold text-foreground mb-1 leading-snug">{subject.name}</h3>
                        <p className="text-xs text-muted-foreground mb-5 flex-1">
                            Study and practice with quizzes, resources, and more.
                        </p>

                        {/* Actions */}
                        <div className="flex gap-2">
                            <button
                            onClick={() => navigate(`/subject/${subject.id}`)}
                            className="flex-1 py-2 text-xs font-semibold rounded-xl gradient-primary text-primary-foreground hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                            >
                            <BookOpen className="w-3.5 h-3.5" /> Explore
                            </button>
                            <button
                            onClick={() => navigate("/quizzes", { state: { preselectedSubjectId: subject.id } })}
                            className="flex-1 py-2 text-xs font-semibold rounded-xl border border-border/80 text-foreground hover:bg-muted/60 hover:border-border active:scale-95 transition-all flex items-center justify-center gap-1.5"
                            >
                            <Brain className="w-3.5 h-3.5" /> Quiz
                            </button>
                        </div>
                        </motion.div>
                    );
                    })}
                </AnimatePresence>
                </div>
            )}

            {/* ── Available / Remaining Subjects ── */}
            {availableSubjects.length > 0 && (
                <div>
                    <h2 className="text-lg font-bold text-foreground mb-4">Available to Add</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <AnimatePresence mode="popLayout">
                            {availableSubjects.map((subject, i) => {
                            const isAdding = addingId === subject.id;
                            const color = getAccent(mySubjects.length + i); // Keep colors cycling
                            return (
                                <motion.div
                                key={`avail-${subject.id}`}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.22 }}
                                className="bg-muted/20 border border-border/40 border-l-[3px] border-l-border rounded-2xl p-5 transition-all duration-200 flex flex-col"
                                >
                                {/* Icon + index */}
                                <div className="flex items-start justify-between mb-4 opacity-70">
                                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center bg-muted")}>
                                        <BookOpen className="w-5 h-5 text-muted-foreground" />
                                    </div>
                                    <span className="text-[10px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                                        Not Enrolled
                                    </span>
                                </div>

                                {/* Name */}
                                <h3 className="text-sm font-semibold text-foreground mb-1 leading-snug">{subject.name}</h3>
                                <p className="text-xs text-muted-foreground mb-5 flex-1">
                                    Unlock quizzes and resources for this subject.
                                </p>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleAddSubject(subject)}
                                        disabled={isAdding}
                                        className="w-full py-2 text-xs font-semibold rounded-xl bg-background border border-border text-foreground hover:bg-muted hover:text-primary hover:border-primary/40 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                                    >
                                        {isAdding ? (
                                            <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Adding...</>
                                        ) : (
                                            <><Plus className="w-3.5 h-3.5" /> Add Subject</>
                                        )}
                                    </button>
                                </div>
                                </motion.div>
                            );
                            })}
                        </AnimatePresence>
                    </div>
                </div>
            )}
        </>
      )}
    </AppLayout>
  );
};

export default CoursesPage;
