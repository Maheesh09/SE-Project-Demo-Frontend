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
  Star, Zap, Brain, ArrowRight,
} from "lucide-react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useProfile } from "@/hooks/useProfile";
import { api, type DashboardStats, type Subject } from "@/lib/api";
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

const getMastery = (score: number): { label: string; color: string; bg: string; ring: string } => {
  if (score >= 85) return { label: "Advanced", color: "text-success", bg: "bg-success/10", ring: "hsl(88 29% 55%)" };
  if (score >= 65) return { label: "Proficient", color: "text-primary", bg: "bg-primary/10", ring: "hsl(88 29% 69%)" };
  if (score >= 45) return { label: "Developing", color: "text-warning", bg: "bg-warning/10", ring: "hsl(30 52% 65%)" };
  return { label: "Needs Help", color: "text-destructive", bg: "bg-destructive/10", ring: "hsl(0 60% 60%)" };
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
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="hsl(38 30% 82%)" strokeWidth={stroke} />
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

const SubjectCard = ({ s, delay }: {
  s: { subject_name: string; average_score: number; total_quizzes: number; total_xp: number };
  delay: number;
}) => {
  const mastery = getMastery(s.average_score);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-card rounded-2xl p-5 border border-border/50 flex flex-col gap-4"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-display font-bold text-foreground text-sm">{s.subject_name}</h4>
          <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mt-1 inline-block", mastery.bg, mastery.color)}>
            {mastery.label}
          </span>
        </div>
        <div className="relative flex items-center justify-center">
          <Ring score={Math.round(s.average_score)} color={mastery.ring} size={60} stroke={5} />
          <span className="absolute text-sm font-display font-bold text-foreground">{Math.round(s.average_score)}%</span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-2 text-center border-t border-border/40 pt-3">
        <div>
          <p className="text-xs font-bold text-foreground">{s.total_quizzes}</p>
          <p className="text-[10px] text-muted-foreground">Quizzes Taken</p>
        </div>
        <div>
          <p className="text-xs font-bold text-xp">{s.total_xp.toLocaleString()} XP</p>
          <p className="text-[10px] text-muted-foreground">XP Earned</p>
        </div>
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

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const token = await getToken();
        if (!token) return;
        const email = user?.primaryEmailAddress?.emailAddress || "";
        const [dashStats, subs] = await Promise.all([
          api.getDashboardStats(token, user?.id, email),
          api.getMySubjects(token, user?.id, email),
        ]);
        if (!cancelled) {
          setStats(dashStats);
          setMySubjects(subs);
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

  // Derived data from real stats
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
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between mb-6">
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
            className="bg-card border border-border/50 rounded-2xl p-6 mb-6"
          >
            <div className="flex items-center gap-8 flex-wrap">
              {/* Grade circle */}
              <div className="flex-shrink-0 flex flex-col items-center gap-1">
                <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center shadow-md">
                  <span className="text-3xl font-display font-black text-primary-foreground">{overallGrade.grade}</span>
                </div>
                <p className="text-xs font-semibold text-muted-foreground">{overallGrade.label}</p>
              </div>

              {/* KPI summary */}
              <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { icon: Target, label: "Overall Score", value: `${Math.round(avgScore)}%`, color: "text-primary", hint: "Weighted average" },
                  { icon: Star, label: "Total XP", value: totalXP.toLocaleString(), color: "text-xp", hint: "From all quizzes" },
                  { icon: BookOpen, label: "Quizzes Taken", value: String(totalQuizzes), color: "text-accent", hint: `Across ${subjectStats.length} subjects` },
                  { icon: Zap, label: "Subjects", value: String(mySubjects.length), color: "text-streak", hint: profile?.grade?.name ?? "—" },
                ].map((k) => (
                  <div key={k.label} className="flex flex-col gap-1 border-l border-border/40 pl-4 first:border-0 first:pl-0">
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

          {/* ── Subject cards ── */}
          {subjectStats.length > 0 && (
            <div className="mb-6">
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Subject Breakdown
              </motion.p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {subjectStats.map((s, i) => <SubjectCard key={s.subject_id} s={s} delay={0.18 + i * 0.05} />)}
              </div>
            </div>
          )}

          {/* ── Charts ── */}
          {subjectStats.length > 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Score per subject bar chart */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass rounded-2xl p-6">
                <h3 className="font-display font-bold text-foreground mb-1">Score by Subject</h3>
                <p className="text-xs text-muted-foreground mb-4">Average quiz score per subject</p>
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
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="glass rounded-2xl p-6">
                <h3 className="font-display font-bold text-foreground mb-1">Skill Radar</h3>
                <p className="text-xs text-muted-foreground mb-4">Competency across subjects</p>
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
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass rounded-2xl p-6">
              <h3 className="font-display font-bold text-foreground mb-1">Recent Quiz Results</h3>
              <p className="text-xs text-muted-foreground mb-4">Your last {stats.recent_quizzes.length} quiz attempts</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {stats.recent_quizzes.map((q, i) => {
                  const g = getGrade(q.score_percentage);
                  return (
                    <div key={i} className="bg-card rounded-xl p-4 border border-border/50 text-center">
                      <div className={cn(
                        "w-10 h-10 mx-auto rounded-full flex items-center justify-center text-lg font-display font-bold mb-2",
                        q.score_percentage >= 70 ? "bg-success/10 text-success"
                          : q.score_percentage >= 40 ? "bg-warning/10 text-warning"
                            : "bg-destructive/10 text-destructive"
                      )}>
                        {g.grade}
                      </div>
                      <p className="text-xs font-bold text-foreground truncate">{q.subject_name}</p>
                      <p className="text-[10px] text-muted-foreground">{q.total_correct}/{q.total_questions} · {Math.round(q.score_percentage)}%</p>
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
