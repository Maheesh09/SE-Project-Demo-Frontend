import { motion } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  BarChart, Bar, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import { TrendingUp, BookOpen, Target, Star, Zap, Brain, ArrowRight } from "lucide-react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useProfile } from "@/hooks/useProfile";
import { api, type DashboardStats, type Subject, type SubjectProgress } from "@/lib/api";
import { useNavigate } from "react-router-dom";

const getMastery = (score: number) => {
  if (score >= 85) return { label: "Advanced", color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20", border: "border-emerald-200 dark:border-emerald-800", ring: "#4ade80" };
  if (score >= 65) return { label: "Proficient", color: "text-primary", bg: "bg-primary/8", border: "border-primary/20", ring: "#acd663" };
  if (score >= 45) return { label: "Developing", color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20", border: "border-amber-200 dark:border-amber-800", ring: "#f59e0b" };
  return { label: "Needs Help", color: "text-red-500", bg: "bg-red-50 dark:bg-red-900/20", border: "border-red-200 dark:border-red-800", ring: "#f87171" };
};

const getGrade = (score: number) => {
  if (score >= 85) return "A";
  if (score >= 70) return "B";
  if (score >= 55) return "C";
  if (score >= 40) return "D";
  return "F";
};

const Ring = ({ score, size = 64, stroke = 5, color }: { score: number; size?: number; stroke?: number; color: string }) => {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - score / 100);
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 1s ease" }}
      />
    </svg>
  );
};

const TOOLTIP_STYLE = {
  background: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "10px",
  fontSize: "11px",
  color: "hsl(var(--foreground))",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

const AnalyticsPage = () => {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const { getToken } = useAuth();
  const { user } = useUser();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [mySubjects, setMySubjects] = useState<Subject[]>([]);
  const [subjectProgress, setSubjectProgress] = useState<SubjectProgress[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const token = await getToken();
        if (!token) return;
        const email = user?.primaryEmailAddress?.emailAddress || "";
        const [dashStats, subs, progress] = await Promise.all([
          api.getDashboardStats(token, user?.id, email),
          api.getMySubjects(token, user?.id, email),
          api.getSubjectProgress(token, user?.id, email).catch(() => []),
        ]);
        if (!cancelled) { setStats(dashStats); setMySubjects(subs); setSubjectProgress(progress); }
      } catch (err) {
        console.error("Failed to load analytics:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [getToken, user]);

  const displayName = profile?.full_name?.split(" ")[0] ?? profile?.username ?? "Student";
  const subjectStats = stats?.subject_stats ?? [];
  const totalXP = stats?.total_xp ?? 0;
  const totalQuizzes = stats?.total_quizzes ?? 0;
  const avgScore = stats?.average_score ?? 0;
  const overallGrade = getGrade(avgScore);

  const radarData = subjectStats.map((s) => ({
    subject: s.subject_name.length > 8 ? s.subject_name.slice(0, 7) + "…" : s.subject_name,
    score: Math.round(s.average_score),
  }));

  const barData = subjectStats.map((s) => ({
    name: s.subject_name.length > 8 ? s.subject_name.slice(0, 7) + "…" : s.subject_name,
    score: Math.round(s.average_score),
  }));

  return (
    <AppLayout>

      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Performance report for <span className="font-semibold text-foreground">{displayName}</span>
        </p>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <span className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
        </div>
      ) : totalQuizzes === 0 ? (
        /* Empty state */
        <div className="py-16 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl gradient-primary flex items-center justify-center mb-5 shadow-sm">
            <TrendingUp className="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">No analytics yet</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-5">
            Complete your first quiz to start seeing performance analytics here.
          </p>
          <button
            onClick={() => navigate("/quizzes")}
            className="inline-flex items-center gap-2 gradient-primary text-primary-foreground px-5 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity shadow-sm"
          >
            <Brain className="w-4 h-4" /> Take a Quiz <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <>
          {/* ── Report card ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-card border border-border/60 rounded-2xl p-5 sm:p-6 mb-6"
          >
            <div className="flex items-center gap-6 sm:gap-10 flex-wrap">
              {/* Grade circle */}
              <div className="flex-shrink-0 flex flex-col items-center gap-1.5">
                <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center shadow-sm">
                  <span className="text-2xl font-bold text-primary-foreground">{overallGrade}</span>
                </div>
                <p className="text-[10px] text-muted-foreground font-medium">Overall Grade</p>
              </div>

              {/* KPI grid */}
              <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { icon: Target, label: "Avg Score", value: `${Math.round(avgScore)}%`, color: "text-primary", bg: "bg-primary/10" },
                  { icon: Star, label: "Total XP", value: totalXP.toLocaleString(), color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20" },
                  { icon: BookOpen, label: "Quizzes", value: String(totalQuizzes), color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-900/20" },
                  { icon: Zap, label: "Subjects", value: String(mySubjects.length), color: "text-sky-500", bg: "bg-sky-50 dark:bg-sky-900/20" },
                ].map((k) => (
                  <div key={k.label} className="flex items-center gap-3 bg-muted/30 rounded-xl p-3">
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0", k.bg)}>
                      <k.icon className={cn("w-4 h-4", k.color)} />
                    </div>
                    <div>
                      <p className={cn("text-lg font-bold leading-none", k.color)}>{k.value}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{k.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── Subject cards ── */}
          {subjectStats.length > 0 && (
            <div className="mb-6">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Subject Breakdown</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {subjectStats.map((s, i) => {
                  const mastery = getMastery(s.average_score);
                  const progress = subjectProgress.find(p => p.subject_id === s.subject_id);
                  return (
                    <motion.div
                      key={s.subject_id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.12 + i * 0.05 }}
                      className="bg-card rounded-2xl p-5 border border-border/60 flex flex-col gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-foreground text-sm truncate">{s.subject_name}</h4>
                          <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1.5 inline-flex border", mastery.bg, mastery.color, mastery.border)}>
                            {mastery.label}
                          </span>
                        </div>
                        <div className="relative flex items-center justify-center flex-shrink-0">
                          <Ring score={Math.round(s.average_score)} color={mastery.ring} />
                          <span className="absolute text-xs font-bold text-foreground">{Math.round(s.average_score)}%</span>
                        </div>
                      </div>

                      {progress && progress.total_topics > 0 && (
                        <div>
                          <div className="flex items-center justify-between text-[10px] mb-1">
                            <span className="text-muted-foreground">{progress.topics_attempted}/{progress.total_topics} topics</span>
                            <span className="font-semibold text-foreground">{Math.round(progress.progress_percentage)}%</span>
                          </div>
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-700"
                              style={{ width: `${progress.progress_percentage}%`, background: mastery.ring }}
                            />
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-2 border-t border-border/40 pt-3">
                        <div className="bg-muted/40 rounded-xl p-2 text-center">
                          <p className="text-sm font-bold text-foreground">{s.total_quizzes}</p>
                          <p className="text-[10px] text-muted-foreground">Quizzes</p>
                        </div>
                        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-2 text-center border border-amber-100 dark:border-amber-800">
                          <p className="text-sm font-bold text-amber-600 dark:text-amber-400">{s.total_xp.toLocaleString()}</p>
                          <p className="text-[10px] text-muted-foreground">XP</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Topic Coverage ── */}
          {subjectProgress.filter(p => p.topics.length > 0 && p.total_quizzes > 0).length > 0 && (
            <div className="mb-6">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Topic Coverage</p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {subjectProgress.filter(p => p.total_quizzes > 0).map((sp, i) => (
                  <motion.div
                    key={sp.subject_id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    className="bg-card rounded-2xl p-5 border border-border/60"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-foreground text-sm">{sp.subject_name}</h4>
                      <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        {sp.topics_attempted}/{sp.total_topics} topics
                      </span>
                    </div>
                    <div className="mb-3">
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full gradient-primary transition-all duration-700"
                          style={{ width: `${sp.progress_percentage}%` }}
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5 max-h-40 overflow-y-auto">
                      {sp.topics.map((t) => (
                        <div key={t.topic_id} className="flex items-center gap-2">
                          <div className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", t.attempted ? "bg-primary" : "bg-muted-foreground/30")} />
                          <span className="text-[11px] text-foreground flex-1 truncate">{t.topic_name}</span>
                          {t.attempted ? (
                            <span className={cn("text-[10px] font-semibold",
                              t.accuracy_percentage >= 70 ? "text-emerald-600"
                                : t.accuracy_percentage >= 40 ? "text-amber-500" : "text-red-500")}>
                              {Math.round(t.accuracy_percentage)}%
                            </span>
                          ) : (
                            <span className="text-[10px] text-muted-foreground/40">—</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* ── Charts ── */}
          {subjectStats.length > 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="bg-card border border-border/60 rounded-2xl p-5">
                <h3 className="font-semibold text-foreground mb-0.5 text-sm">Score by Subject</h3>
                <p className="text-xs text-muted-foreground mb-4">Average quiz score per subject</p>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={barData} layout="vertical" barGap={3}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} domain={[0, 100]} unit="%" axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} width={60} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => [`${v}%`]} cursor={{ fill: "hsl(var(--muted) / 0.4)" }} />
                    <Bar dataKey="score" name="Score" fill="#acd663" radius={[0, 4, 4, 0]} maxBarSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
                className="bg-card border border-border/60 rounded-2xl p-5">
                <h3 className="font-semibold text-foreground mb-0.5 text-sm">Skill Radar</h3>
                <p className="text-xs text-muted-foreground mb-4">Competency across subjects</p>
                <ResponsiveContainer width="100%" height={190}>
                  <RadarChart data={radarData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} />
                    <PolarRadiusAxis tick={false} domain={[0, 100]} />
                    <Radar name="Score" dataKey="score" stroke="#acd663" fill="#acd663" fillOpacity={0.25} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </motion.div>
            </div>
          )}

          {/* ── Recent quizzes ── */}
          {stats && stats.recent_quizzes.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="bg-card border border-border/60 rounded-2xl p-5">
              <h3 className="font-semibold text-foreground mb-0.5 text-sm">Recent Quiz Results</h3>
              <p className="text-xs text-muted-foreground mb-4">Your last {stats.recent_quizzes.length} attempts</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {stats.recent_quizzes.map((q, i) => {
                  const grade = getGrade(q.score_percentage);
                  return (
                    <div key={i} className="bg-muted/30 rounded-xl p-3.5 border border-border/50 text-center hover:bg-muted/50 transition-colors">
                      <div className={cn(
                        "w-9 h-9 mx-auto rounded-full flex items-center justify-center text-base font-bold mb-2.5 border",
                        q.score_percentage >= 70 ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                          : q.score_percentage >= 40 ? "bg-amber-50 text-amber-600 border-amber-200"
                            : "bg-red-50 text-red-500 border-red-200"
                      )}>
                        {grade}
                      </div>
                      <p className="text-xs font-semibold text-foreground truncate">{q.subject_name}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{q.total_correct}/{q.total_questions} · {Math.round(q.score_percentage)}%</p>
                      <p className="text-[10px] font-semibold text-amber-500 mt-1">+{q.xp_earned} XP</p>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </>
      )}
    </AppLayout>
  );
};

export default AnalyticsPage;
