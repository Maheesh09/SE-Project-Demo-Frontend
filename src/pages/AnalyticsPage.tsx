import { motion } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import BlurText from "@/components/BlurText";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  BarChart, Bar, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import {
  TrendingUp, BookOpen, Target,
  Star, Zap, Brain, ArrowRight, Clock, CheckCircle2, XCircle, ChevronDown,
} from "lucide-react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useProfile } from "@/hooks/useProfile";
import { api, type DashboardStats, type Subject, type SubjectProgress, type QuizSummary } from "@/lib/api";
import { useNavigate } from "react-router-dom";

// ─── Constants ────────────────────────────────────────────────────────────────

const CHART = {
  grid: "hsl(38 30% 82%)",
  tick: { fontSize: 11, fill: "hsl(28 20% 50%)" },
  tooltip: {
    backgroundColor: "hsl(38 62% 95%)",
    border: "1px solid hsl(38 30% 82%)",
    borderRadius: "10px",
    fontSize: "12px",
    color: "hsl(28 35% 20%)",
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getMastery = (score: number): { label: string; color: string; bg: string; border: string; ring: string } => {
  if (score >= 85) return { label: "Advanced", color: "text-success", bg: "bg-success/10", border: "border-success/20", ring: "hsl(88 29% 55%)" };
  if (score >= 65) return { label: "Proficient", color: "text-primary", bg: "bg-primary/10", border: "border-primary/20", ring: "hsl(88 29% 69%)" };
  if (score >= 45) return { label: "Developing", color: "text-warning", bg: "bg-warning/10", border: "border-warning/20", ring: "hsl(30 52% 65%)" };
  return { label: "Needs Help", color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/20", ring: "hsl(0 60% 60%)" };
};

const getGrade = (score: number) => {
  if (score >= 85) return { grade: "A", label: "Excellent" };
  if (score >= 70) return { grade: "B", label: "Good" };
  if (score >= 55) return { grade: "C", label: "Average" };
  if (score >= 40) return { grade: "D", label: "Below Average" };
  return { grade: "F", label: "Needs Improvement" };
};

// ─── Circular progress ring ───────────────────────────────────────────────────

const Ring = ({ score, size = 72, stroke = 6, color }: { score: number; size?: number; stroke?: number; color: string }) => {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - score / 100);
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="hsl(38 30% 88%)" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 1s ease" }}
      />
    </svg>
  );
};

// ─── Subject card ─────────────────────────────────────────────────────────────

const SubjectCard = ({ s, delay, progress }: {
  s: { subject_name: string; average_score: number; total_quizzes: number; total_xp: number };
  delay: number;
  progress?: SubjectProgress;
}) => {
  const mastery = getMastery(s.average_score);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-card rounded-2xl p-5 border border-border/60 shadow-sm flex flex-col gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-display font-bold text-foreground text-sm truncate">{s.subject_name}</h4>
          <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full mt-2 inline-flex items-center border", mastery.bg, mastery.color, mastery.border)}>
            {mastery.label}
          </span>
        </div>
        <div className="relative flex items-center justify-center flex-shrink-0">
          <Ring score={Math.round(s.average_score)} color={mastery.ring} size={64} stroke={5} />
          <span className="absolute text-xs font-display font-bold text-foreground">{Math.round(s.average_score)}%</span>
        </div>
      </div>

      {/* Topic progress bar */}
      {progress && progress.total_topics > 0 && (
        <div>
          <div className="flex items-center justify-between text-[10px] mb-1">
            <span className="text-muted-foreground">{progress.topics_attempted}/{progress.total_topics} topics covered</span>
            <span className="font-bold text-foreground">{Math.round(progress.progress_percentage)}%</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${progress.progress_percentage}%`,
                background: `linear-gradient(90deg, ${mastery.ring}, ${mastery.ring}dd)`,
              }}
            />
          </div>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-2 text-center border-t border-border/40 pt-3">
        <div className="bg-muted/40 rounded-xl p-2">
          <p className="text-sm font-bold text-foreground">{s.total_quizzes}</p>
          <p className="text-[10px] text-muted-foreground font-medium">Quizzes Taken</p>
        </div>
        <div className="bg-xp/8 rounded-xl p-2 border border-xp/20">
          <p className="text-sm font-bold text-xp">{s.total_xp.toLocaleString()} XP</p>
          <p className="text-[10px] text-muted-foreground font-medium">XP Earned</p>
        </div>
        {progress && (
          <div>
            <p className="text-xs font-bold text-foreground">{Math.round(progress.average_accuracy)}%</p>
            <p className="text-[10px] text-muted-foreground">Accuracy</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ─── Empty State ──────────────────────────────────────────────────────────────

const EmptyAnalytics = ({ onQuiz }: { onQuiz: () => void }) => (
  <div className="py-16 text-center">
    <div className="w-20 h-20 mx-auto rounded-2xl gradient-primary flex items-center justify-center mb-6 shadow-lg">
      <TrendingUp className="w-10 h-10 text-primary-foreground" />
    </div>
    <h2 className="text-2xl font-display font-bold text-foreground mb-3">No Analytics Yet</h2>
    <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6 leading-relaxed">
      Complete your first quiz to start seeing your performance analytics here. All data shown will be based on your real quiz results.
    </p>
    <button
      onClick={onQuiz}
      className="flex items-center gap-2 gradient-primary text-primary-foreground px-6 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity shadow-sm mx-auto"
    >
      <Brain className="w-4 h-4" /> Take a Quiz <ArrowRight className="w-4 h-4" />
    </button>
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

const AnalyticsPage = () => {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const { getToken } = useAuth();
  const { user } = useUser();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [mySubjects, setMySubjects] = useState<Subject[]>([]);
  const [subjectProgress, setSubjectProgress] = useState<SubjectProgress[]>([]);
  const [recentQuizzes, setRecentQuizzes] = useState<QuizSummary[]>([]);
  const [expandedQuiz, setExpandedQuiz] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const token = await getToken();
        if (!token) return;
        const email = user?.primaryEmailAddress?.emailAddress || "";
        const [dashStats, subs, progress, quizzes] = await Promise.all([
          api.getDashboardStats(token, user?.id, email),
          api.getMySubjects(token, user?.id, email),
          api.getSubjectProgress(token, user?.id, email).catch(() => []),
          api.getRecentQuizzes(token, user?.id, email).catch(() => []),
        ]);
        if (!cancelled) {
          setStats(dashStats);
          setMySubjects(subs);
          setSubjectProgress(progress);
          setRecentQuizzes(quizzes);
        }
      } catch (err) {
        console.error("Failed to load analytics:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [getToken, user]);

  const displayName = profile?.full_name ?? profile?.username ?? "Student";

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
    xp: s.total_xp,
  }));

  return (
    <AppLayout>
      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between mb-7">
        <div>
          <BlurText text="Analytics" delay={50} animateBy="words" direction="top" className="text-3xl font-display font-bold text-foreground mb-1" />
          <p className="text-sm text-muted-foreground">Performance report for <span className="font-semibold text-foreground">{displayName}</span></p>
        </div>
      </motion.div>

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <span className="w-10 h-10 rounded-full border-3 border-primary/30 border-t-primary animate-spin" />
        </div>
      ) : totalQuizzes === 0 ? (
        <EmptyAnalytics onQuiz={() => navigate("/quizzes")} />
      ) : (
        <>
          {/* ── Report card header ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="bg-card border border-border/60 rounded-2xl p-5 sm:p-6 mb-6 shadow-sm"
          >
            <div className="flex items-center gap-6 sm:gap-10 flex-wrap">
              {/* Grade circle */}
              <div className="flex-shrink-0 flex flex-col items-center gap-1.5">
                <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center shadow-md">
                  <span className="text-3xl font-display font-black text-primary-foreground">{overallGrade.grade}</span>
                </div>
                <p className="text-xs font-semibold text-muted-foreground">{overallGrade.label}</p>
              </div>

              {/* KPI summary */}
              <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { icon: Target, label: "Overall Score", value: `${Math.round(avgScore)}%`, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20", hint: "Weighted average" },
                  { icon: Star, label: "Total XP", value: totalXP.toLocaleString(), color: "text-xp", bg: "bg-xp/10", border: "border-xp/20", hint: "From all quizzes" },
                  { icon: BookOpen, label: "Quizzes Taken", value: String(totalQuizzes), color: "text-accent", bg: "bg-accent/10", border: "border-accent/20", hint: `Across ${subjectStats.length} subjects` },
                  { icon: Zap, label: "Subjects", value: String(mySubjects.length), color: "text-streak", bg: "bg-streak/10", border: "border-streak/20", hint: profile?.grade?.name ?? "—" },
                ].map((k) => (
                  <div key={k.label} className={cn("flex flex-col gap-1.5 p-3 rounded-xl border", k.bg, k.border)}>
                    <div className="flex items-center gap-1.5">
                      <k.icon className={`w-3.5 h-3.5 ${k.color}`} />
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">{k.label}</p>
                    </div>
                    <p className={`text-xl font-display font-bold ${k.color}`}>{k.value}</p>
                    <p className="text-[10px] text-muted-foreground">{k.hint}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── Subject cards with topic progress ── */}
          {subjectStats.length > 0 && (
            <div className="mb-6">
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">
                Subject Breakdown
              </motion.p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {subjectStats.map((s, i) => {
                  const progress = subjectProgress.find(p => p.subject_id === s.subject_id);
                  return (
                    <SubjectCard
                      key={s.subject_id}
                      s={s}
                      delay={0.18 + i * 0.05}
                      progress={progress}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Topic-level progress ── */}
          {subjectProgress.filter(p => p.topics.length > 0 && p.total_quizzes > 0).length > 0 && (
            <div className="mb-6">
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Topic Coverage
              </motion.p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {subjectProgress
                  .filter(p => p.total_quizzes > 0)
                  .map((sp, i) => (
                  <motion.div
                    key={sp.subject_id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.42 + i * 0.05 }}
                    className="bg-card rounded-2xl p-5 border border-border/50"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-display font-bold text-foreground text-sm">{sp.subject_name}</h4>
                      <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        {sp.topics_attempted}/{sp.total_topics} topics
                      </span>
                    </div>
                    {/* Overall progress bar */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-[10px] mb-1">
                        <span className="text-muted-foreground">Coverage</span>
                        <span className="font-bold text-foreground">{Math.round(sp.progress_percentage)}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${sp.progress_percentage}%`,
                            background: "linear-gradient(90deg, hsl(88 29% 65%), hsl(88 29% 55%))",
                          }}
                        />
                      </div>
                    </div>
                    {/* Topic list */}
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {sp.topics.map((t) => (
                        <div key={t.topic_id} className="flex items-center gap-2">
                          <div className={cn(
                            "w-1.5 h-1.5 rounded-full flex-shrink-0",
                            t.attempted ? "bg-success" : "bg-muted-foreground/30"
                          )} />
                          <span className="text-[11px] text-foreground flex-1 truncate">{t.topic_name}</span>
                          {t.attempted ? (
                            <span className={cn(
                              "text-[10px] font-bold",
                              t.accuracy_percentage >= 70 ? "text-success" : t.accuracy_percentage >= 40 ? "text-warning" : "text-destructive"
                            )}>
                              {Math.round(t.accuracy_percentage)}%
                            </span>
                          ) : (
                            <span className="text-[10px] text-muted-foreground/50">—</span>
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
              {/* Score per subject bar chart */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-card border border-border/60 rounded-2xl p-6 shadow-sm">
                <h3 className="font-display font-bold text-foreground mb-1">Score by Subject</h3>
                <p className="text-xs text-muted-foreground mb-5">Average quiz score per subject</p>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={barData} layout="vertical" barGap={3}>
                    <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} horizontal={false} />
                    <XAxis type="number" tick={CHART.tick} domain={[0, 100]} unit="%" />
                    <YAxis type="category" dataKey="name" tick={{ ...CHART.tick, fontSize: 10 }} width={65} />
                    <Tooltip contentStyle={CHART.tooltip} formatter={(v: number) => [`${v}%`]} />
                    <Bar dataKey="score" name="Score" fill="hsl(88 29% 65%)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Skill radar */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="bg-card border border-border/60 rounded-2xl p-6 shadow-sm">
                <h3 className="font-display font-bold text-foreground mb-1">Skill Radar</h3>
                <p className="text-xs text-muted-foreground mb-5">Competency across subjects</p>
                <ResponsiveContainer width="100%" height={210}>
                  <RadarChart data={radarData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
                    <PolarGrid stroke={CHART.grid} />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9.5, fill: "hsl(28 20% 50%)" }} />
                    <PolarRadiusAxis tick={false} domain={[0, 100]} />
                    <Radar name="Score" dataKey="score" stroke="hsl(88 29% 55%)" fill="hsl(88 29% 69%)" fillOpacity={0.3} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </motion.div>
            </div>
          )}

          {/* ── Recent quizzes ── */}
          {stats && stats.recent_quizzes.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-card border border-border/60 rounded-2xl p-5 sm:p-6 shadow-sm">
              <h3 className="font-display font-bold text-foreground mb-1">Recent Quiz Results</h3>
              <p className="text-xs text-muted-foreground mb-4">Your last {stats.recent_quizzes.length} quiz attempts</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {stats.recent_quizzes.map((q, i) => {
                  const g = getGrade(q.score_percentage);
                  const isExpanded = expandedQuiz === q.attempt_id;
                  const correctCount = q.answers.filter(a => a.is_correct).length;
                  return (
                    <div key={i} className="bg-muted/30 rounded-xl p-3.5 border border-border/50 text-center hover:bg-muted/50 transition-colors">
                      <div className={cn(
                        "w-10 h-10 mx-auto rounded-full flex items-center justify-center text-lg font-display font-bold mb-2.5 border",
                        q.score_percentage >= 70 ? "bg-success/10 text-success border-success/20"
                          : q.score_percentage >= 40 ? "bg-warning/10 text-warning border-warning/20"
                            : "bg-destructive/10 text-destructive border-destructive/20"
                      )}>
                        {g.grade}
                      </div>
                      <p className="text-xs font-bold text-foreground truncate">{q.subject_name}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{q.total_correct}/{q.total_questions} · {Math.round(q.score_percentage)}%</p>
                      <p className="text-[10px] font-semibold text-xp mt-1">+{q.xp_earned} XP</p>
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
