import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, BookOpen, Clock, TrendingUp, Award, Flame, ChevronRight, CheckCircle2, PlayCircle, Lock, GraduationCap, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import BlurText from "@/components/BlurText";
import { cn } from "@/lib/utils";
import { useProfile } from "@/hooks/useProfile";
import { useAuth, useUser } from "@clerk/clerk-react";
import { api, type Subject } from "@/lib/api";

// ─── Subject color palette ────────────────────────────────────────────────────

const SUBJECT_COLORS = [
  { gradient: "from-[#b2c59d] to-[#9cb282]" },
  { gradient: "from-[#eed4b5] to-[#d6bc99]" },
  { gradient: "from-[#bac8e0] to-[#99aec4]" },
  { gradient: "from-[#d4b8e0] to-[#bb9cce]" },
  { gradient: "from-[#e0c5b5] to-[#c8a996]" },
  { gradient: "from-[#b5dce0] to-[#96c4c8]" },
];

const getSubjectColor = (index: number) => SUBJECT_COLORS[index % SUBJECT_COLORS.length];

const CoursesPage = () => {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const { getToken } = useAuth();
  const { user } = useUser();

  const [mySubjects, setMySubjects] = useState<Subject[]>([]);
  const [subjectsLoading, setSubjectsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "enrolled">("enrolled");

  // ── Fetch enrolled subjects ──
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const token = await getToken();
        if (!token) return;
        const email = user?.primaryEmailAddress?.emailAddress || "";
        const subs = await api.getMySubjects(token, user?.id, email);
        if (!cancelled) setMySubjects(subs);
      } catch (err) {
        console.error("Failed to fetch subjects:", err);
      } finally {
        if (!cancelled) setSubjectsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [getToken, user]);

  return (
    <AppLayout>

      {/* ── Page Header ── */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <BlurText text="My Subjects" delay={50} animateBy="words" direction="top" className="text-3xl font-display font-bold text-foreground mb-1" />
          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm text-muted-foreground">Your enrolled subjects</p>
            {profile?.grade && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary flex items-center gap-1">
                <GraduationCap className="w-3 h-3" /> {profile.grade.name}
              </span>
            )}
          </div>
        </div>
        <div className="flex bg-card border border-border/50 p-1.5 rounded-xl shadow-sm w-fit">
          {(["enrolled", "all"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all duration-200",
                activeTab === tab ? "bg-primary/10 text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab === "enrolled" ? "My Subjects" : "All"}
            </button>
          ))}
        </div>
      </motion.div>

      {/* ── Stats Row ── */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Star, label: "Total XP Earned", value: "1,500", color: "text-xp", bg: "bg-xp/10" },
          { icon: TrendingUp, label: "Avg Progress", value: `${mySubjects.length > 0 ? "65" : "0"}%`, color: "text-primary", bg: "bg-primary/10" },
          { icon: CheckCircle2, label: "Subjects Enrolled", value: subjectsLoading ? "…" : `${mySubjects.length}`, color: "text-success", bg: "bg-success/10" },
          { icon: Flame, label: "Active Streak", value: "7 Days", color: "text-streak", bg: "bg-streak/10" },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.05 }} className="bg-card rounded-2xl p-5 flex items-center gap-4 border border-border/50 shadow-sm">
            <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center flex-shrink-0`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-foreground leading-tight">{stat.value}</p>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-8">

        {/* ── Main Subject Grid ── */}
        <div className="flex-1">
          {subjectsLoading ? (
            <div className="flex items-center justify-center py-24">
              <span className="w-10 h-10 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
            </div>
          ) : mySubjects.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-24 flex flex-col items-center justify-center text-center border-2 border-dashed border-border/50 rounded-3xl bg-muted/10">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                <BookOpen className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-display font-bold text-foreground mb-1">No subjects enrolled</h3>
              <p className="text-sm text-muted-foreground max-w-sm mb-6">
                You haven't enrolled in any subjects yet. Go to settings to add subjects for your grade.
              </p>
              <button
                onClick={() => navigate("/settings")}
                className="px-6 py-2.5 bg-background border border-border rounded-xl text-sm font-bold text-foreground hover:bg-muted transition-colors shadow-sm"
              >
                Go to Settings
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <AnimatePresence mode="popLayout">
                {mySubjects.map((subject, i) => {
                  const color = getSubjectColor(i);
                  return (
                    <motion.div
                      key={subject.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.25, delay: i * 0.05 }}
                      className="flex flex-col bg-card border border-border/60 hover:border-primary/40 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all group"
                    >
                      {/* Decorative Header */}
                      <div className={cn("h-24 bg-gradient-to-br relative p-5 flex items-start justify-between", color.gradient)}>
                        <div className="relative z-10">
                          <h3 className="text-xl font-display font-bold text-white drop-shadow-sm mb-1">{subject.name}</h3>
                          <p className="text-xs font-medium text-white/90 drop-shadow-sm flex items-center gap-1.5">
                            <GraduationCap className="w-3.5 h-3.5" />
                            {profile?.grade?.name ?? "—"}
                          </p>
                        </div>
                      </div>

                      {/* Body */}
                      <div className="p-5 flex-1 flex flex-col">
                        <p className="text-sm text-muted-foreground leading-relaxed mb-6 min-h-[40px]">
                          Study and practice {subject.name} with quizzes, resources, and more.
                        </p>

                        {/* Quick Actions */}
                        <div className="mt-auto flex gap-2">
                          <button
                            onClick={() => navigate(`/subject/${subject.id}`)}
                            className="flex-1 py-2.5 gradient-primary text-primary-foreground font-bold rounded-xl text-sm hover:opacity-90 transition-opacity shadow-sm flex items-center justify-center gap-2"
                          >
                            <BookOpen className="w-4 h-4" /> Explore
                          </button>
                          <button
                            onClick={() => navigate("/quizzes", { state: { preselectedSubjectId: subject.id } })}
                            className="flex-1 py-2.5 gradient-accent text-accent-foreground font-bold rounded-xl text-sm hover:opacity-90 transition-opacity shadow-sm flex items-center justify-center gap-2"
                          >
                            <Brain className="w-4 h-4" /> Quiz
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* ── Sidebar (Achievements & Tips) ── */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="w-full lg:w-[320px] flex flex-col gap-5">

          {/* Pro Upgrade Banner */}
          <div className="bg-gradient-to-br from-accent to-background border border-accent/30 rounded-3xl p-6 relative overflow-hidden shadow-sm">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-accent/20 blur-3xl rounded-full" />
            <Award className="w-8 h-8 text-accent mb-3 relative z-10" />
            <h3 className="text-lg font-display font-bold text-foreground mb-1 relative z-10">MindUp Pro</h3>
            <p className="text-sm text-foreground/80 mb-4 relative z-10 leading-relaxed">
              Unlock all courses, custom quizzes, and advanced analytics.
            </p>
            <button className="w-full py-2.5 bg-background text-foreground text-sm font-bold rounded-xl shadow border border-border/50 hover:bg-muted transition-colors relative z-10">
              Upgrade to Pro
            </button>
          </div>

          <div className="bg-card border border-border/50 rounded-3xl p-6 shadow-sm">
            <h3 className="text-sm font-display font-bold text-foreground mb-4 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-primary" /> Recent Badges
            </h3>
            <div className="space-y-4">
              {[
                { icon: Star, label: "Quick Learner", sub: "Enrolled in 3+ subjects", color: "text-xp", bg: "bg-xp/10" },
                { icon: Flame, label: "7-Day Streak", sub: "Kept studying daily", color: "text-streak", bg: "bg-streak/10" },
                { icon: BookOpen, label: "Bookworm", sub: "Read 50+ chapters", color: "text-primary", bg: "bg-primary/10" },
              ].map((badge) => (
                <div key={badge.label} className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${badge.bg} flex items-center justify-center flex-shrink-0`}>
                    <badge.icon className={`w-5 h-5 ${badge.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{badge.label}</p>
                    <p className="text-xs text-muted-foreground">{badge.sub}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-5 py-2 text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors">
              View All Badges
            </button>
          </div>

        </motion.div>
      </div>

    </AppLayout>
  );
};

export default CoursesPage;
