import { motion, AnimatePresence } from "framer-motion"; //dashboard
import { useState, useEffect } from "react";
import {
  Star, Brain, BookOpen, TrendingUp, BarChart3, ArrowRight,
  Calendar, Trophy, Check, GraduationCap, ChevronRight,
} from "lucide-react";
import BlurText from "@/components/BlurText";
import { Link, useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import StatCard from "@/components/StatCard";
import { BentoCardGrid, MagicCard } from "@/components/MagicCard";
const foxMascot = "/fox/mascot.png";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { cn } from "@/lib/utils";
import { useProfile } from "@/hooks/useProfile";
import { useAuth, useUser } from "@clerk/clerk-react";
import { api, type Subject, type DashboardStats } from "@/lib/api";


// ─── Subject color palette ────────────────────────────────────────────────────

const SUBJECT_COLORS = [
  { gradient: "from-[#b2c59d] to-[#9cb282]", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-400" },
  { gradient: "from-[#eed4b5] to-[#d6bc99]", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-400" },
  { gradient: "from-[#bac8e0] to-[#99aec4]", bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", dot: "bg-blue-400" },
  { gradient: "from-[#d4b8e0] to-[#bb9cce]", bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", dot: "bg-purple-400" },
  { gradient: "from-[#e0c5b5] to-[#c8a996]", bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", dot: "bg-orange-400" },
  { gradient: "from-[#b5dce0] to-[#96c4c8]", bg: "bg-teal-50", text: "text-teal-700", border: "border-teal-200", dot: "bg-teal-400" },
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
  weekday: "short", month: "short", day: "numeric",
});

// ─── Section header ───────────────────────────────────────────────────────────

const SectionHeader = ({ title, linkTo, linkLabel = "View All", delay = 0 }: {
  title: string; linkTo?: string; linkLabel?: string; delay?: number;
}) => (
  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
    className="flex items-center justify-between mb-2.5">
    <h2 className="text-sm font-display font-bold text-foreground">{title}</h2>
    {linkTo && (
      <Link to={linkTo} className="flex items-center gap-0.5 text-[11px] font-semibold text-primary hover:text-primary/80 transition-colors">
        {linkLabel} <ChevronRight className="w-3 h-3" />
      </Link>
    )}
  </motion.div>
);

// ─── Empty state component ────────────────────────────────────────────────────

const EmptyState = ({ icon: Icon, message, actionLabel, onAction }: {
  icon: React.ElementType; message: string; actionLabel?: string; onAction?: () => void;
}) => (
  <div className="py-8 text-center">
    <Icon className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
    <p className="text-xs text-muted-foreground">{message}</p>
    {actionLabel && onAction && (
      <button onClick={onAction} className="mt-2 text-xs font-bold text-primary hover:text-primary/80 transition-colors">
        {actionLabel}
      </button>
    )}
  </div>
);


// ─── Quick Action Card ─────────────────────────────────────────────────────────

const QuickActionCard = ({
  icon: Icon,
  label,
  sublabel,
  onClick,
  iconClass,
  iconBg,
  badge,
}: {
  icon: React.ElementType;
  label: string;
  sublabel?: string;
  onClick: () => void;
  iconClass: string;
  iconBg: string;
  badge?: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    className="flex-shrink-0 w-[130px] sm:w-auto sm:flex-1 bg-card border border-border/60 rounded-xl p-3.5 flex flex-col gap-2.5 text-left hover:shadow-md hover:-translate-y-0.5 hover:border-primary/20 transition-all duration-200 active:scale-95"
  >
    <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0", iconBg)}>
      <Icon className={cn("w-4.5 h-4.5", iconClass)} />
    </div>
    <div>
      <p className="text-sm font-bold text-foreground leading-tight">{label}</p>
      {sublabel && <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{sublabel}</p>}
    </div>
    {badge && <div className="mt-auto">{badge}</div>}
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

  const subjectScores = (stats?.subject_stats ?? []).map((s) => ({
    subject: s.subject_name.length > 8 ? s.subject_name.slice(0, 7) + "…" : s.subject_name,
    score: Math.round(s.average_score),
  }));

  const formatXP = (xp: number) => xp.toLocaleString();

  return (
    <AppLayout>

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between gap-3 mb-4"
      >
        <div className="min-w-0">
          <BlurText
            text={`${getGreeting()}, ${displayName}`}
            delay={40}
            animateBy="words"
            direction="top"
            className="text-xl sm:text-2xl font-display font-bold text-foreground truncate"
          />
          <div className="flex items-center gap-1 mt-0.5">
            <Calendar className="w-3 h-3 text-muted-foreground" />
            <span className="text-[11px] text-muted-foreground">{todayLabel}</span>
          </div>
        </div>
        <Link
          to="/courses"
          className="flex-shrink-0 flex items-center gap-1.5 gradient-primary text-primary-foreground px-3.5 py-2 rounded-xl font-semibold text-xs hover:opacity-90 transition-opacity shadow-sm"
        >
          Study <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </motion.div>

      {/* ── Grade Banner (slim) ── */}
      {profile?.grade && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-4 bg-card border border-border/60 border-l-4 border-l-primary rounded-xl px-3.5 py-2.5 flex items-center justify-between gap-3 shadow-sm"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
              <GraduationCap className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-foreground truncate">{profile.grade.name}</p>
              {profile.district && (
                <p className="text-[10px] text-muted-foreground truncate">
                  {profile.district.name}{profile.province ? `, ${profile.province.name}` : ""}
                </p>
              )}
            </div>
          </div>
          {/* Subject pills - limited on mobile */}
          <div className="flex items-center gap-1 flex-shrink-0 overflow-hidden max-w-[50%]">
            {!subjectsLoading && mySubjects.slice(0, 3).map((s, i) => {
              const color = getSubjectColor(i);
              return (
                <span
                  key={s.id}
                  className={`hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${color.bg} ${color.text} ${color.border}`}
                >
                  {s.name.length > 8 ? s.name.slice(0, 7) + "…" : s.name}
                </span>
              );
            })}
            {!subjectsLoading && mySubjects.length > 0 && (
              <span className="inline-flex sm:hidden text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                {mySubjects.length} subjects
              </span>
            )}
            {subjectsLoading && (
              <span className="w-4 h-4 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
            )}
          </div>
        </motion.div>
      )}

      {/* ── KPI row (2x2 compact grid) ── */}
      <div className="grid grid-cols-2 gap-2.5 mb-4">
        <StatCard
          icon={Star}
          label="Total XP"
          value={statsLoading ? "…" : formatXP(stats?.total_xp ?? 0)}
          colorClass="text-xp"
          delay={0}
        />
        <StatCard
          icon={Brain}
          label="Quizzes Taken"
          value={statsLoading ? "…" : String(stats?.total_quizzes ?? 0)}
          colorClass="text-streak"
          delay={0.06}
        />
        <StatCard
          icon={BookOpen}
          label="Subjects"
          value={subjectsLoading ? "…" : String(mySubjects.length)}
          colorClass="text-primary"
          delay={0.12}
        />
        <StatCard
          icon={TrendingUp}
          label="Avg Score"
          value={statsLoading ? "…" : stats?.average_score != null ? `${stats.average_score}%` : "—"}
          colorClass="text-success"
          delay={0.18}
        />
      </div>

      {/* ── Quick Actions (horizontal scroll on mobile) ── */}
      <div className="mb-4">
        <SectionHeader title="Quick Actions" delay={0.22} />
        <div className="flex gap-2.5 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 scrollbar-hide">
          <QuickActionCard
            icon={Brain}
            label="Quizzes"
            sublabel="Test your knowledge"
            onClick={() => navigate("/quizzes")}
            iconClass="text-primary-foreground"
            iconBg="gradient-primary"
            badge={
              !subjectsLoading && (
                <span className="text-[10px] font-semibold text-primary">
                  {mySubjects.length} subject{mySubjects.length !== 1 ? "s" : ""}
                </span>
              )
            }
          />
          <QuickActionCard
            icon={BarChart3}
            label="Analytics"
            sublabel="View your progress"
            onClick={() => navigate("/analytics")}
            iconClass="text-accent-foreground"
            iconBg="gradient-accent"
            badge={
              !statsLoading && stats && stats.total_quizzes > 0 && (
                <span className="text-[10px] font-semibold text-accent">
                  {stats.total_quizzes} completed
                </span>
              )
            }
          />
          <QuickActionCard
            icon={Brain}
            label="AI Tutor"
            sublabel="Ask anything"
            onClick={() => navigate("/chatbot")}
            iconClass="text-amber-700"
            iconBg="bg-amber-100"
            badge={
              <span className="flex items-center gap-1 text-[10px] font-semibold text-success">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                Online
              </span>
            }
          />
        </div>
      </div>

      {/* ── Performance + Recent Quizzes ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2.5 mb-4">

        {/* Subject Performance chart */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          className="lg:col-span-2 bg-card border border-border/60 rounded-xl p-3.5 shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-xs font-bold text-foreground">Subject Performance</h3>
              <p className="text-[10px] text-muted-foreground">Avg quiz scores per subject</p>
            </div>
            {!statsLoading && stats && stats.total_quizzes > 0 && (
              <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                {formatXP(stats.total_xp)} XP
              </span>
            )}
          </div>

          {statsLoading ? (
            <div className="flex items-center justify-center py-6">
              <span className="w-5 h-5 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
            </div>
          ) : subjectScores.length === 0 ? (
            <EmptyState
              icon={BarChart3}
              message="Complete a quiz to see your performance chart."
              actionLabel="Go to Quizzes"
              onAction={() => navigate("/quizzes")}
            />
          ) : (
            <ResponsiveContainer width="100%" height={110}>
              <BarChart data={subjectScores} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <XAxis dataKey="subject" tick={{ fontSize: 9, fill: "hsl(28 15% 45%)" }} />
                <YAxis tick={{ fontSize: 9, fill: "hsl(28 15% 45%)" }} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ background: "hsl(48 40% 97%)", border: "1px solid hsl(48 25% 85%)", borderRadius: "8px", fontSize: "11px" }}
                  cursor={{ fill: "hsl(48 25% 85% / 0.4)" }}
                />
                <Bar dataKey="score" fill="#acd663" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Recent Quiz Results */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.31 }}
          className="bg-card border border-border/60 rounded-xl p-3.5 shadow-sm"
        >
          <div className="flex items-center gap-1.5 mb-3">
            <Trophy className="w-3.5 h-3.5 text-accent" />
            <h3 className="text-xs font-bold text-foreground">Recent Quizzes</h3>
          </div>

          {statsLoading ? (
            <div className="flex items-center justify-center py-6">
              <span className="w-5 h-5 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
            </div>
          ) : !stats || stats.recent_quizzes.length === 0 ? (
            <EmptyState
              icon={Brain}
              message="No quizzes yet. Start one now!"
              actionLabel="Take a Quiz"
              onAction={() => navigate("/quizzes")}
            />
          ) : (
            <div className="flex flex-col gap-1">
              {stats.recent_quizzes.map((q, i) => (
                <button
                  key={i}
                  onClick={() => navigate(`/quiz/review?session_id=${q.session_id}`)}
                  className="flex items-center gap-2 w-full text-left rounded-lg px-2 py-1.5 hover:bg-muted/50 transition-colors cursor-pointer group"
                >
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0",
                    q.score_percentage >= 70 ? "bg-success/15 text-success" : q.score_percentage >= 40 ? "bg-amber-100 text-amber-600" : "bg-destructive/10 text-destructive"
                  )}>
                    <Check className="w-3 h-3" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold text-foreground truncate group-hover:text-primary transition-colors">{q.subject_name}</p>
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

      {/* ── My Subjects ── */}
      <div>
        <SectionHeader title="My Subjects" linkTo="/courses" delay={0.35} />
        {subjectsLoading ? (
          <div className="flex items-center justify-center py-8">
            <span className="w-6 h-6 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
          </div>
        ) : mySubjects.length === 0 ? (
          <div className="bg-card border border-border/60 rounded-xl p-4">
            <EmptyState
              icon={BookOpen}
              message="No subjects enrolled yet."
              actionLabel="Go to Settings to add subjects"
              onAction={() => navigate("/settings")}
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {mySubjects.map((subject, i) => {
              const color = getSubjectColor(i);
              const subjectStat = stats?.subject_stats?.find(s => s.subject_id === subject.id);
              return (
                <motion.button
                  key={subject.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.38 + i * 0.04 }}
                  onClick={() => navigate(`/subject/${subject.id}`)}
                  className="group bg-card border border-border/60 rounded-xl p-3 text-left hover:shadow-md hover:-translate-y-0.5 hover:border-primary/20 transition-all duration-200 active:scale-95 flex flex-col gap-2"
                >
                  {/* Color dot + icon */}
                  <div className="flex items-center justify-between">
                    <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${color.gradient} flex items-center justify-center flex-shrink-0`}>
                      <BookOpen className="w-3.5 h-3.5 text-white" />
                    </div>
                    {subjectStat ? (
                      <span className="flex items-center gap-0.5 text-[9px] font-bold text-xp">
                        <Star className="w-2.5 h-2.5 fill-current" />
                        {formatXP(subjectStat.total_xp)}
                      </span>
                    ) : (
                      <span className="text-[9px] text-muted-foreground/60">0 XP</span>
                    )}
                  </div>

                  {/* Name */}
                  <div>
                    <h3 className="text-xs font-bold text-foreground leading-tight line-clamp-2">{subject.name}</h3>
                    <p className="text-[9px] text-muted-foreground mt-0.5">{profile?.grade?.name ?? "—"}</p>
                  </div>

                  {/* Quiz CTA */}
                  <div className="flex items-center gap-1 text-[10px] font-bold text-primary group-hover:text-primary/80 transition-colors mt-auto">
                    <Brain className="w-2.5 h-2.5" />
                    Quiz
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}
      </div>

    </AppLayout>
  );
};

export default Dashboard;
