import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Star, Brain, BookOpen, TrendingUp, BarChart3, ArrowRight,
  Calendar, Trophy, Check, GraduationCap, ChevronRight, Zap,
  Flame, Target, ChevronDown, MousePointerClick,
} from "lucide-react";
import BlurText from "@/components/BlurText";
import { Link, useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import StatCard from "@/components/StatCard";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { cn } from "@/lib/utils";
import StreakDisplay from "@/components/StreakDisplay";
import { useProfile } from "@/hooks/useProfile";
import { useStreak } from "@/hooks/useStreak";
import { useToast } from "@/hooks/use-toast";
import { useAuth, useUser } from "@clerk/clerk-react";
import { api, type Subject, type DashboardStats, type StudyStreak, type XpSummary } from "@/lib/api";

const foxMascot = "/fox/mascot.png";

// ─── Subject accent colors (left border only) ─────────────────────────────────
const SUBJECT_ACCENTS = [
  { borderColor: "#4ade80", iconBg: "bg-emerald-100 dark:bg-emerald-900/30", iconText: "text-emerald-600 dark:text-emerald-400" },
  { borderColor: "#fb923c", iconBg: "bg-orange-100 dark:bg-orange-900/30", iconText: "text-orange-600 dark:text-orange-400" },
  { borderColor: "#60a5fa", iconBg: "bg-blue-100 dark:bg-blue-900/30", iconText: "text-blue-600 dark:text-blue-400" },
  { borderColor: "#a78bfa", iconBg: "bg-violet-100 dark:bg-violet-900/30", iconText: "text-violet-600 dark:text-violet-400" },
  { borderColor: "#f472b6", iconBg: "bg-pink-100 dark:bg-pink-900/30", iconText: "text-pink-600 dark:text-pink-400" },
  { borderColor: "#34d399", iconBg: "bg-teal-100 dark:bg-teal-900/30", iconText: "text-teal-600 dark:text-teal-400" },
];
const getAccent = (i: number) => SUBJECT_ACCENTS[i % SUBJECT_ACCENTS.length];

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
const todayShort = new Date().toLocaleDateString("en-US", {
  weekday: "short", month: "short", day: "numeric",
});

// ─── Live Clock ───────────────────────────────────────────────────────────────

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

const LiveClock = () => {
  const { h12, mm, ss, period } = useLiveClock();
  return (
    <div className="flex items-stretch gap-0 bg-card border border-border/60 rounded-xl overflow-hidden select-none">
      <div className="flex items-center gap-0.5 px-3 py-2">
        <span className="text-sm font-mono font-bold text-foreground tabular-nums">{h12}</span>
        <span className="text-sm font-mono font-bold text-primary animate-pulse mx-0.5">:</span>
        <span className="text-sm font-mono font-bold text-foreground tabular-nums">{mm}</span>
        <span className="text-sm font-mono text-muted-foreground/40 animate-pulse mx-0.5">:</span>
        <span className="text-sm font-mono text-muted-foreground tabular-nums">{ss}</span>
      </div>
      <div className="bg-primary/10 flex items-center px-2">
        <span className="text-[10px] font-bold text-primary tracking-wider">{period}</span>
      </div>
    </div>
  );
};

// ─── Section Header ───────────────────────────────────────────────────────────

const SectionHeader = ({ title, linkTo, linkLabel = "View All", delay = 0 }: {
  title: string; linkTo?: string; linkLabel?: string; delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="flex items-center justify-between mb-4"
  >
    <h2 className="text-sm md:text-[15px] font-semibold text-foreground">{title}</h2>
    {linkTo && (
      <Link
        to={linkTo}
        className="flex items-center gap-0.5 md:gap-1 text-[11px] md:text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        {linkLabel}
        <ChevronRight className="w-3 h-3 md:hidden" />
        <ArrowRight className="hidden md:block w-3.5 h-3.5" />
      </Link>
    )}
  </motion.div>
);

// ─── Empty State ──────────────────────────────────────────────────────────────

const EmptyState = ({ icon: Icon, message, actionLabel, onAction }: {
  icon: React.ElementType; message: string; actionLabel?: string; onAction?: () => void;
}) => (
  <div className="py-10 md:py-12 text-center">
    <Icon className="w-8 h-8 text-muted-foreground/20 mx-auto mb-3" />
    <p className="text-xs md:text-sm text-muted-foreground">{message}</p>
    {actionLabel && onAction && (
      <button
        onClick={onAction}
        className="mt-3 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
      >
        {actionLabel}
      </button>
    )}
  </div>
);

// ─── Quick Action Card ────────────────────────────────────────────────────────

const QuickActionCard = ({ icon: Icon, label, desc, badge, badgeColor, onClick, iconBg, iconColor }: {
  icon: React.ElementType;
  label: string;
  desc: string;
  badge?: string | null;
  badgeColor?: string;
  onClick: () => void;
  iconBg: string;
  iconColor: string;
}) => (
  <button
    onClick={onClick}
    className="group flex items-center gap-4 w-full bg-card border border-border/60 rounded-xl md:rounded-2xl px-4 py-4 hover:shadow-md hover:border-border hover:-translate-y-0.5 transition-all duration-200 text-left active:scale-[0.99]"
  >
    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110", iconBg)}>
      <Icon className={cn("w-5 h-5", iconColor)} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{label}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
    </div>
    {badge && (
      <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full border flex-shrink-0", badgeColor)}>
        {badge}
      </span>
    )}
    <ArrowRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200 flex-shrink-0" />
  </button>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

const Dashboard = () => {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const { getToken } = useAuth();
  const { user } = useUser();
  const displayName = profile?.full_name?.split(" ")[0] ?? profile?.username ?? "Student";

  const [mySubjects, setMySubjects] = useState<Subject[]>([]);
  const [subjectsLoading, setSubjectsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [streak, setStreak] = useState<StudyStreak | null>(null);
  const [xpSummary, setXpSummary] = useState<XpSummary | null>(null);
  const [showSecondary, setShowSecondary] = useState(false);
  const { toast } = useToast();
  const { streak: streakFromHook, error: streakError } = useStreak();

  // Handle broken streak notification once per session
  useEffect(() => {
    if (streakFromHook && streakFromHook.current_streak === 0 && streakFromHook.longest_streak > 0) {
      const alerted = sessionStorage.getItem("streak_broken_alerted");
      if (!alerted) {
        toast({
          title: "Streak Broken",
          description: "Oh no! Your daily streak has been reset. Start a new one today!",
          className: "bg-red-500/20 text-red-950 dark:text-red-50 border border-red-500/30 backdrop-blur-md shadow-lg",
        });
        sessionStorage.setItem("streak_broken_alerted", "true");
      }
    }
  }, [streakFromHook, toast]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const token = await getToken();
        if (!token) return;
        const email = user?.primaryEmailAddress?.emailAddress || "";
        const [subs, dashStats, streakData, xpData] = await Promise.all([
          api.getMySubjects(token, user?.id, email),
          api.getDashboardStats(token, user?.id, email),
          api.getStudyStreak(token, user?.id, email).catch(() => null),
          api.getXpSummary(token, user?.id, email).catch(() => null),
        ]);
        if (!cancelled) {
          setMySubjects(subs);
          setStats(dashStats);
          setStreak(streakData);
          setXpSummary(xpData);
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
  }, [getToken, user?.id, user?.primaryEmailAddress?.emailAddress]);

  const subjectScores = (stats?.subject_stats ?? []).map((s) => ({
    subject: (s.subject_name || "").length > 8 ? (s.subject_name || "").slice(0, 7) + "…" : (s.subject_name || ""),
    score: Math.round(s.average_score),
  }));

  const formatXP = (xp: number) => xp.toLocaleString();

  return (
    <AppLayout>

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start md:items-center justify-between gap-4 mb-6 md:mb-8"
      >
        <div className="min-w-0">
          <BlurText
            text={`${getGreeting()}, ${displayName}`}
            delay={40}
            animateBy="words"
            direction="top"
            className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground"
          />
          <div className="flex items-center gap-1.5 mt-1">
            <Calendar className="w-3 h-3 text-muted-foreground/60" />
            <span className="text-[11px] md:hidden text-muted-foreground">{todayShort}</span>
            <span className="hidden md:inline text-xs text-muted-foreground">{todayLabel}</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-shrink-0">
          <div className="hidden md:block">
            <LiveClock />
          </div>
          <Link
            to="/courses"
            className="flex items-center gap-1.5 gradient-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 active:scale-95 transition-all shadow-sm px-4 py-2 text-xs md:px-5 md:py-2.5 md:text-sm"
          >
            <span className="hidden md:inline">Continue Learning</span>
            <span className="md:hidden">Study</span>
            <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </Link>
        </div>
      </motion.div>

      {/* ── Grade banner (inline pill) ── */}
      {profile?.grade && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="flex items-center gap-2 flex-wrap mb-6 md:mb-8"
        >
          <div className="flex items-center gap-1.5 bg-primary/10 border border-primary/20 text-primary rounded-full px-3 py-1 text-[11px] font-semibold">
            <GraduationCap className="w-3 h-3" />
            <span>{profile.grade.name}</span>
          </div>
          {profile.district && (
            <span className="text-[11px] text-muted-foreground">
              {profile.district.name}{profile.province ? `, ${profile.province.name}` : ""}
            </span>
          )}
          {!subjectsLoading && mySubjects.length > 0 && (
            <span className="text-[11px] text-muted-foreground">· {mySubjects.length} subjects enrolled</span>
          )}
        </motion.div>
      )}

      {/* ── Primary KPIs (3 cards) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-3 md:mb-4">
        <StatCard
          icon={Star}
          label="Total XP"
          value={statsLoading ? "…" : formatXP(stats?.total_xp ?? 0)}
          subtitle={xpSummary ? `${formatXP(xpSummary.total_bonus_xp)} bonus XP earned` : undefined}
          colorClass="text-amber-500"
          accentColor="#f59e0b"
          iconBgClass="bg-amber-100 dark:bg-amber-900/20"
          delay={0}
        />
        <StreakDisplay className="border-l-[3px] border-l-[#f97316]" />
        <StatCard
          icon={TrendingUp}
          label="Avg Score"
          value={statsLoading ? "…" : stats?.average_score != null ? `${stats.average_score}%` : "—"}
          subtitle={stats?.average_score == null ? "No quizzes yet" : "Across all subjects"}
          colorClass="text-primary"
          accentColor="#acd663"
          iconBgClass="bg-primary/10"
          delay={0.12}
        />
      </div>

      {/* ── Secondary KPIs (collapsible) ── */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="mb-6 md:mb-8">
        <button
          onClick={() => setShowSecondary(!showSecondary)}
          className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors mb-2"
        >
          <ChevronDown className={cn("w-3 h-3 transition-transform duration-200", showSecondary && "rotate-180")} />
          {showSecondary ? "Hide" : "Show"} more stats
        </button>
        <AnimatePresence>
          {showSecondary && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-3 gap-2 md:gap-3">
                <StatCard
                  icon={Brain}
                  label="Quizzes Taken"
                  value={statsLoading ? "…" : String(stats?.total_quizzes ?? 0)}
                  colorClass="text-violet-500"
                  iconBgClass="bg-violet-100 dark:bg-violet-900/20"
                  delay={0}
                  size="sm"
                />
                <StatCard
                  icon={Target}
                  label="Correct Answers"
                  value={statsLoading ? "…" : xpSummary ? String(xpSummary.total_correct_answers) : "0"}
                  colorClass="text-sky-500"
                  iconBgClass="bg-sky-100 dark:bg-sky-900/20"
                  delay={0.04}
                  size="sm"
                />
                <StatCard
                  icon={BookOpen}
                  label="Subjects"
                  value={subjectsLoading ? "…" : String(mySubjects.length)}
                  colorClass="text-primary"
                  iconBgClass="bg-primary/10"
                  delay={0.08}
                  size="sm"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Quick Actions ── */}
      <div className="mb-6 md:mb-8">
        <SectionHeader title="Quick Actions" delay={0.2} />

        {/* Mobile: horizontal scroll chips */}
        <div className="flex gap-2.5 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide md:hidden">
          {[
            { icon: Brain, label: "Quizzes", sublabel: "Test knowledge", onClick: () => navigate("/quizzes"), iconBg: "bg-primary/15", iconColor: "text-primary" },
            { icon: BarChart3, label: "Analytics", sublabel: "Your progress", onClick: () => navigate("/analytics"), iconBg: "bg-violet-100", iconColor: "text-violet-600" },
            { icon: MousePointerClick, label: "AI Tutor", sublabel: "Ask anything", onClick: () => navigate("/chatbot"), iconBg: "bg-amber-100", iconColor: "text-amber-600" },
          ].map((item) => (
            <button
              key={item.label}
              onClick={item.onClick}
              className="flex-shrink-0 w-[120px] bg-card border border-border/60 rounded-xl p-3.5 flex flex-col gap-2 text-left hover:shadow-md hover:border-primary/20 transition-all duration-200 active:scale-95"
            >
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", item.iconBg)}>
                <item.icon className={cn("w-4 h-4", item.iconColor)} />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">{item.label}</p>
                <p className="text-[10px] text-muted-foreground">{item.sublabel}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Desktop: clean list-style action cards */}
        <div className="hidden md:flex flex-col gap-2.5">
          <QuickActionCard
            icon={Brain}
            label="Quizzes"
            desc="Select a subject and test your knowledge"
            badge={subjectsLoading ? null : `${mySubjects.length} subjects`}
            badgeColor="text-primary bg-primary/8 border-primary/20"
            onClick={() => navigate("/quizzes")}
            iconBg="bg-primary/12"
            iconColor="text-primary"
          />
          <QuickActionCard
            icon={BarChart3}
            label="Analytics"
            desc="Track your progress and performance"
            badge={(!statsLoading && stats && stats.total_quizzes > 0) ? `${stats.total_quizzes} completed` : null}
            badgeColor="text-violet-600 bg-violet-50 border-violet-200"
            onClick={() => navigate("/analytics")}
            iconBg="bg-violet-100 dark:bg-violet-900/30"
            iconColor="text-violet-600 dark:text-violet-400"
          />
          <QuickActionCard
            icon={MousePointerClick}
            label="AI Tutor"
            desc="Ask anything about your studies"
            badge="Online"
            badgeColor="text-emerald-600 bg-emerald-50 border-emerald-200"
            onClick={() => navigate("/chatbot")}
            iconBg="bg-amber-100 dark:bg-amber-900/30"
            iconColor="text-amber-600 dark:text-amber-400"
          />
        </div>
      </div>

      {/* ── Performance + Recent Quizzes ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">

        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          className="lg:col-span-2 bg-card border border-border/60 rounded-xl md:rounded-2xl p-4 md:p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Subject Performance</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">Average quiz scores by subject</p>
            </div>
            {!statsLoading && stats && stats.total_quizzes > 0 && (
              <span className="text-[10px] font-semibold text-primary bg-primary/8 border border-primary/20 px-2 py-0.5 rounded-full">
                {formatXP(stats.total_xp)} XP
              </span>
            )}
          </div>

          {statsLoading ? (
            <div className="flex items-center justify-center py-10">
              <span className="w-6 h-6 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
            </div>
          ) : subjectScores.length === 0 ? (
            <EmptyState
              icon={BarChart3}
              message="Complete a quiz to see your performance chart."
              actionLabel="Go to Quizzes"
              onAction={() => navigate("/quizzes")}
            />
          ) : (
            <ResponsiveContainer width="100%" height={140} className="md:h-[170px]">
              <BarChart data={subjectScores} margin={{ top: 4, right: 4, bottom: 0, left: -24 }}>
                <XAxis dataKey="subject" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} domain={[0, 100]} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "10px",
                    fontSize: "11px",
                    color: "hsl(var(--foreground))",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  }}
                  cursor={{ fill: "hsl(var(--muted) / 0.5)" }}
                />
                <Bar dataKey="score" fill="#acd663" radius={[5, 5, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Recent Quizzes */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32 }}
          className="bg-card border border-border/60 rounded-xl md:rounded-2xl p-4 md:p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <h3 className="text-sm font-semibold text-foreground">Recent Quizzes</h3>
          </div>

          {statsLoading ? (
            <div className="flex items-center justify-center py-8">
              <span className="w-5 h-5 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
            </div>
          ) : !stats || stats.recent_quizzes.length === 0 ? (
            <EmptyState
              icon={Brain}
              message="No quizzes completed yet."
              actionLabel="Take a Quiz"
              onAction={() => navigate("/quizzes")}
            />
          ) : (
            <div className="flex flex-col gap-1">
              {stats.recent_quizzes.map((q, i) => (
                <button
                  key={i}
                  onClick={() => navigate(`/quiz/review?session_id=${q.session_id}`)}
                  className="flex items-center gap-2.5 w-full text-left rounded-xl px-3 py-2.5 hover:bg-muted/50 transition-colors group"
                >
                  <div className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0",
                    q.score_percentage >= 70
                      ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                      : q.score_percentage >= 40
                        ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                        : "bg-red-100 dark:bg-red-900/30 text-red-500"
                  )}>
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors">{q.subject_name}</p>
                    <p className="text-[10px] text-muted-foreground">{q.total_correct}/{q.total_questions} correct</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-xs font-bold text-foreground">{Math.round(q.score_percentage)}%</span>
                    <p className="text-[10px] text-amber-500 font-semibold">+{q.xp_earned} XP</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* ── My Subjects ── */}
      <div>
        <SectionHeader title="My Subjects" linkTo="/courses" delay={0.35} />

        {subjectsLoading ? (
          <div className="flex items-center justify-center py-10">
            <span className="w-6 h-6 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
          </div>
        ) : mySubjects.length === 0 ? (
          <div className="bg-card border border-border/60 rounded-2xl p-4">
            <EmptyState
              icon={BookOpen}
              message="No subjects enrolled yet."
              actionLabel="Go to Settings to add subjects"
              onAction={() => navigate("/settings")}
            />
          </div>
        ) : (
          <>
            {/* Mobile: 2-col compact grid */}
            <div className="grid grid-cols-2 gap-2.5 md:hidden">
              {mySubjects.map((subject, i) => {
                const accent = getAccent(i);
                const subjectStat = stats?.subject_stats?.find(s => s.subject_id === subject.id);
                return (
                  <motion.button
                    key={subject.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.38 + i * 0.04 }}
                    onClick={() => navigate(`/subject/${subject.id}`)}
                    className="group bg-card border border-border/60 border-l-[3px] rounded-xl p-3 text-left hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 active:scale-95 flex flex-col gap-2"
                    style={{ borderLeftColor: accent.borderColor }}
                  >
                    <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0", accent.iconBg)}>
                      <BookOpen className={cn("w-3.5 h-3.5", accent.iconText)} />
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold text-foreground leading-tight line-clamp-2">{subject.name}</h3>
                      {subjectStat && (
                        <p className="text-[9px] text-muted-foreground mt-0.5">{subjectStat.total_quizzes} quiz{subjectStat.total_quizzes !== 1 ? "zes" : ""}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-semibold text-primary group-hover:text-primary/80 transition-colors mt-auto">
                      <Zap className="w-2.5 h-2.5" /> Quiz
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Desktop: clean card grid */}
            <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {mySubjects.map((subject, i) => {
                const accent = getAccent(i);
                const subjectStat = stats?.subject_stats?.find(s => s.subject_id === subject.id);
                return (
                  <motion.div
                    key={subject.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.05 }}
                    className="group bg-card border border-border/60 border-l-[3px] rounded-2xl p-5 hover:shadow-md hover:-translate-y-0.5 hover:border-border transition-all duration-200"
                    style={{ borderLeftColor: accent.borderColor }}
                  >
                    {/* Icon + XP badge */}
                    <div className="flex items-start justify-between mb-3.5">
                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", accent.iconBg)}>
                        <BookOpen className={cn("w-5 h-5", accent.iconText)} />
                      </div>
                      {subjectStat ? (
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                          <Star className="w-2.5 h-2.5 fill-current opacity-80" />
                          {formatXP(subjectStat.total_xp)} XP
                        </span>
                      ) : (
                        <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">0 XP</span>
                      )}
                    </div>

                    {/* Name */}
                    <h3 className="text-sm font-semibold text-foreground mb-0.5 truncate" title={subject.name}>{subject.name}</h3>
                    <p className="text-[10px] text-muted-foreground mb-3">{profile?.grade?.name ?? "—"}</p>

                    {/* Stats */}
                    {subjectStat && (
                      <div className="flex items-center gap-3 mb-4 text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Brain className="w-3 h-3" />
                          {subjectStat.total_quizzes} quiz{subjectStat.total_quizzes !== 1 ? "zes" : ""}
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          {Math.round(subjectStat.average_score)}% avg
                        </span>
                      </div>
                    )}

                    {/* CTAs */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/subject/${subject.id}`)}
                        className="flex-1 py-1.5 text-[11px] font-semibold rounded-lg gradient-primary text-primary-foreground hover:opacity-90 active:scale-95 transition-all duration-150"
                      >
                        Explore
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("/quizzes", { state: { preselectedSubjectId: subject.id } });
                        }}
                        className="flex-1 py-1.5 text-[11px] font-semibold rounded-lg border border-border/80 text-foreground hover:bg-muted/60 hover:border-border active:scale-95 transition-all duration-150"
                      >
                        Quiz
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}
      </div>

    </AppLayout>
  );
};

export default Dashboard;
