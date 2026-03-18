import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import {
  Star, Zap, BookOpen, TrendingUp, Brain, BarChart3, ArrowRight,
  Bell, Calendar, Trophy, CheckCircle2, X, Check,
  Clock, Target, Flame, GraduationCap, Info,
} from "lucide-react";
import BlurText from "@/components/BlurText";
import { Link, useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import StatCard from "@/components/StatCard";
import { BentoCardGrid, MagicCard } from "@/components/MagicCard";
import chatbotOwl from "@/assets/chatbot-owl.png";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { cn } from "@/lib/utils";
import { useProfile } from "@/hooks/useProfile";
import { useAuth, useUser } from "@clerk/clerk-react";
import { api, type Subject, type DashboardStats } from "@/lib/api";


// ─── Subject color palette ────────────────────────────────────────────────────

const SUBJECT_COLORS = [
  { gradient: "from-[#b2c59d] to-[#9cb282]", bg: "bg-emerald-100", text: "text-emerald-700" },
  { gradient: "from-[#eed4b5] to-[#d6bc99]", bg: "bg-amber-100", text: "text-amber-700" },
  { gradient: "from-[#bac8e0] to-[#99aec4]", bg: "bg-blue-100", text: "text-blue-700" },
  { gradient: "from-[#d4b8e0] to-[#bb9cce]", bg: "bg-purple-100", text: "text-purple-700" },
  { gradient: "from-[#e0c5b5] to-[#c8a996]", bg: "bg-orange-100", text: "text-orange-700" },
  { gradient: "from-[#b5dce0] to-[#96c4c8]", bg: "bg-teal-100", text: "text-teal-700" },
];

const getSubjectColor = (index: number) => SUBJECT_COLORS[index % SUBJECT_COLORS.length];


// ─── Helpers ──────────────────────────────────────────────────────────────────

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

const todayLabel = new Date().toLocaleDateString("en-US", {
  weekday: "long", month: "long", day: "numeric",
});

const useLiveClock = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const period = time.getHours() >= 12 ? "PM" : "AM";
  const h12 = (time.getHours() % 12 || 12).toString().padStart(2, "0");
  const mm = time.getMinutes().toString().padStart(2, "0");
  const ss = time.getSeconds().toString().padStart(2, "0");
  return { h12, mm, ss, period };
};

// ─── Clock ────────────────────────────────────────────────────────────────────

const LiveClock = () => {
  const { h12, mm, ss, period } = useLiveClock();
  return (
    <div className="flex items-stretch gap-0 bg-card border border-border/50 rounded-xl overflow-hidden shadow-sm select-none">
      {/* Time segments */}
      <div className="flex items-center gap-0.5 px-3 py-2">
        <span className="text-sm font-mono font-black text-foreground tabular-nums">{h12}</span>
        <span className="text-sm font-mono font-black text-primary/70 animate-pulse mx-0.5">:</span>
        <span className="text-sm font-mono font-black text-foreground tabular-nums">{mm}</span>
        <span className="text-sm font-mono text-muted-foreground/50 animate-pulse mx-0.5">:</span>
        <span className="text-sm font-mono font-semibold text-muted-foreground tabular-nums">{ss}</span>
      </div>
      {/* AM/PM badge */}
      <div className="bg-primary/10 flex items-center px-2.5">
        <span className="text-[10px] font-black text-primary tracking-wider">{period}</span>
      </div>
    </div>
  );
};


// ─── Section header ───────────────────────────────────────────────────────────

const SectionHeader = ({ title, linkTo, linkLabel = "View All", delay = 0 }: {
  title: string; linkTo?: string; linkLabel?: string; delay?: number;
}) => (
  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
    className="flex items-center justify-between mb-4">
    <h2 className="text-base font-display font-bold text-foreground">{title}</h2>
    {linkTo && (
      <Link to={linkTo} className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors">
        {linkLabel} <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    )}
  </motion.div>
);

// ─── Empty state component ────────────────────────────────────────────────────

const EmptyState = ({ icon: Icon, message, actionLabel, onAction }: {
  icon: React.ElementType; message: string; actionLabel?: string; onAction?: () => void;
}) => (
  <div className="py-10 text-center">
    <Icon className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
    <p className="text-sm text-muted-foreground">{message}</p>
    {actionLabel && onAction && (
      <button onClick={onAction} className="mt-3 text-xs font-bold text-primary hover:text-primary/80 transition-colors">
        {actionLabel}
      </button>
    )}
  </div>
);


// ─── Page ─────────────────────────────────────────────────────────────────────

const Dashboard = () => {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const { getToken } = useAuth();
  const { user } = useUser();
  const displayName = profile?.full_name?.split(" ")[0] ?? profile?.username ?? "Student";

  // ── Fetch user's enrolled subjects from the API ──
  const [mySubjects, setMySubjects] = useState<Subject[]>([]);
  const [subjectsLoading, setSubjectsLoading] = useState(true);

  // ── Fetch real dashboard stats from the API ──
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const token = await getToken();
        if (!token) return;
        const email = user?.primaryEmailAddress?.emailAddress || "";
        const [subs, dashStats] = await Promise.all([
          api.getMySubjects(token, user?.id, email),
          api.getDashboardStats(token, user?.id, email),
        ]);
        if (!cancelled) {
          setMySubjects(subs);
          setStats(dashStats);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        if (!cancelled) {
          setSubjectsLoading(false);
          setStatsLoading(false);
        }
      }
    })();
    return () => { cancelled = true; };
  }, [getToken, user]);

  // Build subject scores chart from REAL data
  const subjectScores = (stats?.subject_stats ?? []).map((s) => ({
    subject: s.subject_name.length > 8 ? s.subject_name.slice(0, 7) + "…" : s.subject_name,
    score: Math.round(s.average_score),
  }));

  // Format XP
  const formatXP = (xp: number) => xp.toLocaleString();

  return (
    <AppLayout>

      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-7">
        <div>
          <BlurText text={`${getGreeting()}, ${displayName}`} delay={40} animateBy="words" direction="top" className="text-3xl font-display font-bold text-foreground" />
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" />
              <span>{todayLabel}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center flex-wrap sm:flex-nowrap gap-2.5">
          <LiveClock />
          <Link
            to="/courses"
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 gradient-primary text-primary-foreground px-5 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity shadow-sm"
          >
            Continue Learning <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>

      {/* ── Grade Badge ── */}
      {profile?.grade && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-7"
        >
          <div className="glass rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center shadow-md">
                <GraduationCap className="w-7 h-7 text-primary-foreground" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Your Grade</p>
                <h3 className="text-xl font-display font-black text-foreground">{profile.grade.name}</h3>
                {profile.district && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {profile.district.name}{profile.province ? `, ${profile.province.name}` : ""}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {!subjectsLoading && mySubjects.length > 0 && mySubjects.map((s, i) => {
                const color = getSubjectColor(i);
                return (
                  <span
                    key={s.id}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-bold ${color.bg} ${color.text}`}
                  >
                    {s.name}
                  </span>
                );
              })}
              {subjectsLoading && (
                <span className="w-5 h-5 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* ── KPI row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        <StatCard
          icon={Star}
          label="Total XP"
          value={statsLoading ? "…" : formatXP(stats?.total_xp ?? 0)}
          subtitle={stats?.total_xp === 0 ? "Take a quiz to earn XP" : "Earned from quizzes"}
          subtitleTrend="neutral"
          colorClass="text-xp"
          delay={0}
        />
        <StatCard
          icon={Brain}
          label="Quizzes Taken"
          value={statsLoading ? "…" : String(stats?.total_quizzes ?? 0)}
          subtitle={stats?.total_quizzes === 0 ? "Start your first quiz!" : `Across ${stats?.subject_stats?.length ?? 0} subjects`}
          subtitleTrend="neutral"
          colorClass="text-streak"
          delay={0.07}
        />
        <StatCard
          icon={BookOpen}
          label="Subjects"
          value={subjectsLoading ? "…" : String(mySubjects.length)}
          subtitle={profile?.grade?.name ?? "—"}
          subtitleTrend="neutral"
          colorClass="text-primary"
          delay={0.14}
        />
        <StatCard
          icon={TrendingUp}
          label="Avg Quiz Score"
          value={statsLoading ? "…" : stats?.average_score != null ? `${stats.average_score}%` : "—"}
          subtitle={stats?.average_score == null ? "No quizzes yet" : "Across all subjects"}
          subtitleTrend="neutral"
          colorClass="text-success"
          delay={0.21}
        />
      </div>

      {/* ── Subject Performance + Recent Activity ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-7">

        {/* Subject Performance chart (real data) */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="lg:col-span-2 glass rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-display font-bold text-foreground">Subject Performance</h3>
              <p className="text-xs text-muted-foreground">Average quiz scores by subject</p>
            </div>
            {!statsLoading && stats && stats.total_quizzes > 0 && (
              <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                {formatXP(stats.total_xp)} XP total
              </span>
            )}
          </div>

          {statsLoading ? (
            <div className="flex items-center justify-center py-8">
              <span className="w-6 h-6 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
            </div>
          ) : subjectScores.length === 0 ? (
            <EmptyState
              icon={BarChart3}
              message="No quiz data yet. Complete a quiz to see your performance chart."
              actionLabel="Go to Quizzes"
              onAction={() => navigate("/quizzes")}
            />
          ) : (
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={subjectScores} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <XAxis dataKey="subject" tick={{ fontSize: 10, fill: "hsl(28 20% 50%)" }} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(28 20% 50%)" }} domain={[0, 100]} />
                <Tooltip contentStyle={{ background: "hsl(38 62% 92%)", border: "1px solid hsl(38 30% 82%)", borderRadius: "8px", fontSize: "11px" }} cursor={{ fill: "hsl(38 30% 82% / 0.4)" }} />
                <Bar dataKey="score" fill="hsl(88 29% 65%)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Recent Quiz Results (real data) */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}
          className="glass rounded-2xl p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-4 h-4 text-accent" />
            <h3 className="text-sm font-display font-bold text-foreground">Recent Quizzes</h3>
            <span className="ml-auto text-[10px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">Click to review</span>
          </div>

          {statsLoading ? (
            <div className="flex items-center justify-center py-8">
              <span className="w-6 h-6 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
            </div>
          ) : !stats || stats.recent_quizzes.length === 0 ? (
            <EmptyState
              icon={Brain}
              message="No quizzes completed yet. Start one now!"
              actionLabel="Take a Quiz"
              onAction={() => navigate("/quizzes")}
            />
          ) : (
            <div className="flex flex-col gap-3">
              {stats.recent_quizzes.map((q, i) => (
                <button
                  key={i}
                  onClick={() => navigate(`/quiz/review?session_id=${q.session_id}`)}
                  className="flex items-center gap-2.5 w-full text-left rounded-xl px-2 py-1.5 -mx-2 hover:bg-muted/40 transition-colors cursor-pointer group"
                >
                  <div className={cn(
                    "w-4.5 h-4.5 rounded-full flex items-center justify-center flex-shrink-0",
                    q.score_percentage >= 70 ? "bg-success" : q.score_percentage >= 40 ? "bg-amber-400" : "bg-destructive"
                  )}>
                    <Check className="w-2.5 h-2.5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate group-hover:text-primary transition-colors">{q.subject_name}</p>
                    <p className="text-[10px] text-muted-foreground">{q.total_correct}/{q.total_questions} correct</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-xs font-bold text-foreground">{Math.round(q.score_percentage)}%</span>
                    <p className="text-[10px] font-semibold text-xp">+{q.xp_earned} XP</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* ── Quick action bento ── */}
      <SectionHeader title="Quick Actions" delay={0.3} />
      <BentoCardGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-7">

        <MagicCard onClick={() => navigate("/quizzes")} enableTilt enableMagnetism enableStars glowColor="178,197,157">
          <div className="flex flex-col h-full bg-card p-5 rounded-xl border border-transparent hover:border-border/50 transition-colors">
            <div className="w-11 h-11 rounded-xl gradient-primary flex items-center justify-center mb-4 shadow-sm">
              <Brain className="w-5 h-5 text-primary-foreground" />
            </div>
            <h2 className="text-base font-display font-bold text-foreground mb-1">Quizzes</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">Select a subject and test your knowledge</p>
            <div className="mt-auto pt-4 flex gap-2 flex-wrap">
              <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-semibold">
                {subjectsLoading ? "…" : `${mySubjects.length} subjects`}
              </span>
              {!statsLoading && stats && stats.total_quizzes > 0 && (
                <span className="text-xs px-2.5 py-1 rounded-full bg-accent/10 text-accent font-semibold">
                  {stats.total_quizzes} completed
                </span>
              )}
            </div>
          </div>
        </MagicCard>

        <MagicCard onClick={() => navigate("/analytics")} enableTilt enableMagnetism enableStars glowColor="212,168,122">
          <div className="flex flex-col h-full bg-card p-5 rounded-xl border border-transparent hover:border-border/50 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="w-11 h-11 rounded-xl gradient-accent flex items-center justify-center shadow-sm">
                <BarChart3 className="w-5 h-5 text-accent-foreground" />
              </div>
            </div>
            <h2 className="text-base font-display font-bold text-foreground mb-2">Analytics</h2>
            <div className="h-[68px]">
              {subjectScores.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={subjectScores} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                    <XAxis dataKey="subject" tick={{ fontSize: 8, fill: "hsl(28 20% 50%)" }} />
                    <YAxis hide />
                    <Tooltip contentStyle={{ background: "hsl(38 62% 92%)", border: "1px solid hsl(38 30% 82%)", borderRadius: "8px", fontSize: "11px" }} cursor={{ fill: "hsl(38 30% 82% / 0.4)" }} />
                    <Bar dataKey="score" fill="hsl(88 29% 65%)" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-[10px] text-muted-foreground">Complete quizzes to see analytics</p>
                </div>
              )}
            </div>
          </div>
        </MagicCard>

        <MagicCard onClick={() => navigate("/chatbot")} enableTilt enableMagnetism enableStars glowColor="176,138,104">
          <div className="flex flex-col items-center justify-center h-full bg-card p-5 rounded-xl border border-transparent hover:border-border/50 text-center transition-colors">
            <img src={chatbotOwl} alt="AI Tutor" className="w-16 h-16 object-contain mb-3 drop-shadow-sm" />
            <h2 className="text-base font-display font-bold text-foreground mb-1">AI Tutor</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">Ask anything about your studies</p>
            <div className="mt-3 flex items-center gap-1.5 bg-background/80 px-3 py-1.5 rounded-full border border-border/50">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              <span className="text-xs font-semibold text-success">Online · Ready</span>
            </div>
          </div>
        </MagicCard>
      </BentoCardGrid>

      {/* ── Divider ── */}
      <div className="border-t border-border/40 mb-7" />

      {/* ── My Subjects ── */}
      <div>
        <SectionHeader title="My Subjects" linkTo="/courses" delay={0.35} />
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.37 }} className="glass rounded-2xl p-4">
          {subjectsLoading ? (
            <div className="flex items-center justify-center py-12">
              <span className="w-8 h-8 rounded-full border-3 border-primary/30 border-t-primary animate-spin" />
            </div>
          ) : mySubjects.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              message="No subjects enrolled yet."
              actionLabel="Go to Settings to add subjects"
              onAction={() => navigate("/settings")}
            />
          ) : (
            <BentoCardGrid className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {mySubjects.map((subject, i) => {
                const color = getSubjectColor(i);
                // Find real stats for this subject
                const subjectStat = stats?.subject_stats?.find(s => s.subject_id === subject.id);
                return (
                  <MagicCard
                    key={subject.id}
                    glowColor="178,197,157"
                    enableTilt
                    enableMagnetism
                    particleCount={5}
                    className="rounded-xl overflow-hidden cursor-pointer"
                    onClick={() => navigate(`/subject/${subject.id}`)}
                  >
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.05 }} className="p-4">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${color.gradient} flex items-center justify-center mb-3 shadow-sm`}>
                        <BookOpen className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-sm font-display font-bold text-foreground mb-0.5">{subject.name}</h3>
                      <p className="text-[10px] text-muted-foreground">{profile?.grade?.name ?? "—"}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <button
                          onClick={(e) => { e.stopPropagation(); navigate("/quizzes", { state: { preselectedSubjectId: subject.id } }); }}
                          className="text-[10px] font-bold text-primary hover:text-primary/80 flex items-center gap-1"
                        >
                          <Brain className="w-3 h-3" /> Start Quiz
                        </button>
                        {subjectStat ? (
                          <span className="flex items-center gap-0.5 text-[10px] font-semibold text-xp">
                            <Star className="w-3 h-3 fill-current opacity-70" />{formatXP(subjectStat.total_xp)} XP
                          </span>
                        ) : (
                          <span className="text-[10px] text-muted-foreground">No quizzes yet</span>
                        )}
                      </div>
                    </motion.div>
                  </MagicCard>
                );
              })}
            </BentoCardGrid>
          )}
        </motion.div>
      </div>

    </AppLayout>
  );
};

export default Dashboard;
