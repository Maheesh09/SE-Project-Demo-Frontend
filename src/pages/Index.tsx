import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import {
  Star, Zap, BookOpen, TrendingUp, Brain, BarChart3, ArrowRight,
  Bell, Calendar, Trophy, CheckCircle2, AlertCircle, X, Check,
  Clock, Target, Flame,
} from "lucide-react";
import BlurText from "@/components/BlurText";
import { Link, useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import StatCard from "@/components/StatCard";
import { BentoCardGrid, MagicCard } from "@/components/MagicCard";
import AnimatedList from "@/components/AnimatedList";
import chatbotOwl from "@/assets/chatbot-owl.png";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, AreaChart, Area } from "recharts";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

// ─── Data ─────────────────────────────────────────────────────────────────────

const subjectScores = [
  { subject: "Science", score: 72 },
  { subject: "English", score: 90 },
  { subject: "Maths", score: 45 },
  { subject: "Civics", score: 30 },
  { subject: "History", score: 55 },
  { subject: "Health", score: 65 },
];

const weeklyXP = [
  { day: "Mon", xp: 80 },
  { day: "Tue", xp: 140 },
  { day: "Wed", xp: 60 },
  { day: "Thu", xp: 190 },
  { day: "Fri", xp: 220 },
  { day: "Sat", xp: 100 },
  { day: "Sun", xp: 50 },
];

const courses = [
  { name: "Science", progress: 72, completed: 17, total: 24, xp: 340 },
  { name: "English", progress: 90, completed: 18, total: 20, xp: 520 },
  { name: "Maths", progress: 45, completed: 8, total: 18, xp: 210 },
  { name: "Civics", progress: 30, completed: 9, total: 30, xp: 150 },
  { name: "History", progress: 55, completed: 11, total: 20, xp: 280 },
  { name: "Health Sci", progress: 65, completed: 13, total: 20, xp: 310 },
];

const leaderboard = [
  { rank: 1, name: "Amal P.", xp: 5800, level: 24, streak: 30 },
  { rank: 2, name: "You", xp: 4600, level: 20, streak: 7, isYou: true },
  { rank: 3, name: "Ishani T.", xp: 3400, level: 15, streak: 11 },
  { rank: 4, name: "Nimal S.", xp: 3100, level: 14, streak: 6 },
  { rank: 5, name: "Kavya R.", xp: 2850, level: 13, streak: 4 },
];

// ─── Notifications ────────────────────────────────────────────────────────────

type Notif = {
  id: number;
  type: "achievement" | "quiz" | "streak" | "leaderboard" | "reminder";
  title: string;
  body: string;
  time: string;
  route: string;   // ← where to navigate on click
  read: boolean;
};

const initialNotifications: Notif[] = [
  { id: 1, type: "achievement", title: "Achievement Unlocked", body: "You earned the 'English Master' badge — 90% progress!", time: "2 min ago", route: "/analytics", read: false },
  { id: 2, type: "streak", title: "7-Day Streak!", body: "Amazing! You've studied 7 days in a row. Keep it up!", time: "1 hr ago", route: "/", read: false },
  { id: 3, type: "quiz", title: "Quiz Result Ready", body: "Science: Forces & Motion — you scored 100%. Excellent!", time: "3 hr ago", route: "/quizzes", read: false },
  { id: 4, type: "leaderboard", title: "Leaderboard Update", body: "You moved to Rank #2 in Colombo district this week!", time: "5 hr ago", route: "/leaderboard", read: true },
  { id: 5, type: "reminder", title: "Study Reminder", body: "You haven't practised Maths today — 15 min can make a difference!", time: "Yesterday", route: "/courses", read: true },
];

const notifConfig: Record<Notif["type"], { icon: React.ElementType; color: string; bg: string }> = {
  achievement: { icon: Trophy, color: "text-xp", bg: "bg-xp/10" },
  quiz: { icon: CheckCircle2, color: "text-success", bg: "bg-success/10" },
  streak: { icon: Zap, color: "text-streak", bg: "bg-streak/10" },
  leaderboard: { icon: Trophy, color: "text-accent", bg: "bg-accent/10" },
  reminder: { icon: AlertCircle, color: "text-warning", bg: "bg-warning/10" },
};

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

// ─── Notification Panel ───────────────────────────────────────────────────────

const NotificationPanel = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState<Notif[]>(initialNotifications);
  const ref = useRef<HTMLDivElement>(null);

  const unread = notifs.filter((n) => !n.read).length;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const markAllRead = () => setNotifs((n) => n.map((x) => ({ ...x, read: true })));
  const dismiss = (id: number, e: React.MouseEvent) => { e.stopPropagation(); setNotifs((n) => n.filter((x) => x.id !== id)); };

  const handleClick = (notif: Notif) => {
    setNotifs((n) => n.map((x) => x.id === notif.id ? { ...x, read: true } : x));
    setOpen(false);
    navigate(notif.route);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "relative w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-200",
          open
            ? "gradient-primary text-primary-foreground border-transparent shadow-sm"
            : "bg-card border-border/50 text-muted-foreground hover:bg-muted/60 hover:text-foreground"
        )}
      >
        <Bell className="w-4 h-4" />
        {unread > 0 && (
          <motion.span
            key={unread}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 min-w-[16px] h-4 rounded-full bg-destructive text-[9px] font-black text-white flex items-center justify-center border-2 border-background px-0.5"
          >
            {unread}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 top-11 w-[380px] bg-card border border-border/50 rounded-2xl shadow-xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/40">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-foreground">Notifications</h3>
                {unread > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-destructive/10 text-destructive">{unread} new</span>
                )}
              </div>
              <button onClick={markAllRead} className="flex items-center gap-1 text-[11px] font-semibold text-primary hover:text-primary/80 transition-colors">
                <Check className="w-3 h-3" /> Mark all read
              </button>
            </div>

            {/* List */}
            <div className="max-h-[400px] overflow-y-auto divide-y divide-border/30">
              {notifs.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground text-sm">All caught up!</div>
              ) : notifs.map((n) => {
                const { icon: NIcon, color, bg } = notifConfig[n.type];
                return (
                  <motion.div
                    key={n.id}
                    layout
                    exit={{ opacity: 0, x: -10 }}
                    onClick={() => handleClick(n)}
                    className={cn(
                      "flex items-start gap-3 px-4 py-3.5 hover:bg-muted/30 transition-colors cursor-pointer group",
                      !n.read && "bg-primary/[0.03]"
                    )}
                  >
                    <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5", bg)}>
                      <NIcon className={cn("w-4 h-4", color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-bold text-foreground leading-snug">{n.title}</p>
                        <button
                          onClick={(e) => dismiss(n.id, e)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-muted flex-shrink-0 -mt-0.5"
                        >
                          <X className="w-3 h-3 text-muted-foreground" />
                        </button>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{n.body}</p>
                      <div className="flex items-center justify-between mt-1.5">
                        <p className="text-[10px] text-muted-foreground/70 font-medium">{n.time}</p>
                        <span className="text-[10px] font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                          Go <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                    {!n.read && <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />}
                  </motion.div>
                );
              })}
            </div>

            <div className="px-4 py-2.5 border-t border-border/40 bg-muted/20 text-center">
              <p className="text-[11px] text-muted-foreground">Click a notification to go to the relevant page</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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

// ─── Page ─────────────────────────────────────────────────────────────────────

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Derive display name — prefer fullName, fall back to username or 'Student'
  const displayName = user?.fullName || user?.username || "Student";
  const gradeLabel = user?.grade ? ` · ${user.grade}` : "";
  const districtLabel = user?.district ? ` · ${user.district} District` : "";

  const leaderboardItems = leaderboard.map((entry) => (
    <div className="flex items-center gap-3 px-2 py-1" key={entry.rank}>
      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${entry.rank === 1 ? "gradient-accent text-accent-foreground" : entry.rank === 2 ? "bg-muted text-muted-foreground" : "gradient-primary text-primary-foreground"
        }`}>{entry.rank}</span>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold truncate ${entry.isYou ? "text-primary" : "text-foreground"}`}>
          {entry.name} {entry.isYou && <span className="text-xs font-normal text-primary/70">(You)</span>}
        </p>
        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">Level {entry.level} · {entry.streak}d streak</p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-sm font-bold text-foreground">{entry.xp.toLocaleString()} XP</p>
        <div className="h-1 w-16 rounded-full bg-border overflow-hidden mt-1">
          <div className="h-full rounded-full gradient-primary" style={{ width: `${(entry.xp / 5800) * 100}%` }} />
        </div>
      </div>
    </div>
  ));

  return (
    <AppLayout>

      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-7">
        <div>
          <BlurText text={`${getGreeting()}, ${displayName}!`} delay={40} animateBy="words" direction="top" className="text-3xl font-display font-bold text-foreground" />
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" />
              <span>{todayLabel}</span>
            </div>
            <span className="text-border/60 select-none">·</span>
            <span className="flex items-center gap-1 text-xs font-semibold text-streak">
              <Flame className="w-3.5 h-3.5" /> 7-day streak!
            </span>
            {gradeLabel && <span className="text-xs text-muted-foreground font-medium">{gradeLabel}{districtLabel}</span>}
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <LiveClock />
          <NotificationPanel />
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 gradient-primary text-primary-foreground px-5 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity shadow-sm"
          >
            Continue Learning <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>

      {/* ── KPI row ── */}
      <div className="grid grid-cols-4 gap-4 mb-7">
        <StatCard icon={Star} label="Total XP" value="2,450" subtitle="+120 this week" subtitleTrend="up" colorClass="text-xp" delay={0} />
        <StatCard icon={Zap} label="Day Streak" value="7" subtitle="Best: 14 days" subtitleTrend="neutral" colorClass="text-streak" delay={0.07} />
        <StatCard icon={BookOpen} label="Courses Active" value="6" subtitle="2 completed" subtitleTrend="up" colorClass="text-primary" delay={0.14} />
        <StatCard icon={TrendingUp} label="Avg Quiz Score" value="87%" subtitle="+5% this week" subtitleTrend="up" colorClass="text-success" delay={0.21} />
      </div>

      {/* ── Progress + Quick-action row ── */}
      <div className="grid grid-cols-3 gap-4 mb-7">

        {/* Weekly XP chart */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="col-span-2 glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-display font-bold text-foreground">Weekly XP Activity</h3>
              <p className="text-xs text-muted-foreground">XP earned each day this week</p>
            </div>
            <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">840 XP this week</span>
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <AreaChart data={weeklyXP} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: "hsl(28 20% 50%)" }} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(28 20% 50%)" }} />
              <Tooltip contentStyle={{ background: "hsl(38 62% 92%)", border: "1px solid hsl(38 30% 82%)", borderRadius: "8px", fontSize: "11px" }} />
              <Area type="monotone" dataKey="xp" stroke="hsl(88 29% 55%)" fill="hsl(88 29% 69%)" fillOpacity={0.2} strokeWidth={2} dot={{ fill: "hsl(88 29% 55%)", r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Today's goals */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}
          className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-4 h-4 text-accent" />
            <h3 className="text-sm font-display font-bold text-foreground">Today's Goals</h3>
          </div>
          <div className="flex flex-col gap-3">
            {[
              { label: "Complete 1 quiz", done: true, xp: 50 },
              { label: "Study 60 min", done: true, xp: 30 },
              { label: "Finish Science ch.18", done: false, xp: 100 },
              { label: "Review Civics notes", done: false, xp: 40 },
            ].map((g) => (
              <div key={g.label} className="flex items-center gap-2.5">
                <div className={cn("w-4.5 h-4.5 rounded-full flex items-center justify-center flex-shrink-0",
                  g.done ? "bg-success" : "border-2 border-border")}>
                  {g.done && <Check className="w-2.5 h-2.5 text-white" />}
                </div>
                <p className={cn("text-xs flex-1", g.done ? "text-muted-foreground line-through" : "text-foreground font-medium")}>{g.label}</p>
                <span className="text-[10px] font-bold text-xp">+{g.xp}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-border/40">
            <div className="flex justify-between text-[11px] text-muted-foreground mb-1.5 font-medium">
              <span>Daily progress</span><span className="text-foreground font-bold">2 / 4</span>
            </div>
            <div className="h-1.5 rounded-full bg-border overflow-hidden">
              <div className="h-full rounded-full gradient-primary" style={{ width: "50%" }} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Quick action bento ── */}
      <SectionHeader title="Quick Actions" delay={0.3} />
      <BentoCardGrid className="grid grid-cols-3 gap-4 mb-7">

        <MagicCard onClick={() => navigate("/quizzes")} enableTilt enableMagnetism enableStars glowColor="178,197,157">
          <div className="flex flex-col h-full bg-card p-5 rounded-xl border border-transparent hover:border-border/50 transition-colors">
            <div className="w-11 h-11 rounded-xl gradient-primary flex items-center justify-center mb-4 shadow-sm">
              <Brain className="w-5 h-5 text-primary-foreground" />
            </div>
            <h2 className="text-base font-display font-bold text-foreground mb-1">Quizzes</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">Test your knowledge and earn XP rewards</p>
            <div className="mt-auto pt-4 flex gap-2 flex-wrap">
              <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-semibold">6 available</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-accent/10 text-accent font-semibold">+50–120 XP</span>
            </div>
          </div>
        </MagicCard>

        <MagicCard onClick={() => navigate("/analytics")} enableTilt enableMagnetism enableStars glowColor="212,168,122">
          <div className="flex flex-col h-full bg-card p-5 rounded-xl border border-transparent hover:border-border/50 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="w-11 h-11 rounded-xl gradient-accent flex items-center justify-center shadow-sm">
                <BarChart3 className="w-5 h-5 text-accent-foreground" />
              </div>
              <span className="text-[10px] font-bold text-accent uppercase tracking-wider">Live</span>
            </div>
            <h2 className="text-base font-display font-bold text-foreground mb-2">Analytics</h2>
            <div className="h-[68px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectScores} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                  <XAxis dataKey="subject" tick={{ fontSize: 8, fill: "hsl(28 20% 50%)" }} />
                  <YAxis hide />
                  <Tooltip contentStyle={{ background: "hsl(38 62% 92%)", border: "1px solid hsl(38 30% 82%)", borderRadius: "8px", fontSize: "11px" }} cursor={{ fill: "hsl(38 30% 82% / 0.4)" }} />
                  <Bar dataKey="score" fill="hsl(88 29% 65%)" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
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

      {/* ── Courses + Leaderboard ── */}
      <div className="grid grid-cols-3 gap-6">

        <div className="col-span-2">
          <SectionHeader title="My Courses" linkTo="/courses" delay={0.35} />
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.37 }} className="glass rounded-2xl p-4">
            <BentoCardGrid className="grid grid-cols-3 gap-3">
              {courses.map((course, i) => (
                <MagicCard key={course.name} glowColor="178,197,157" enableTilt enableMagnetism particleCount={5} className="rounded-xl overflow-hidden cursor-pointer" onClick={() => navigate("/subject/" + course.name.toLowerCase().replace(/\s+/g, '-'))}>
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.05 }} className="p-4">
                    <h3 className="text-sm font-display font-bold text-foreground mb-0.5">{course.name}</h3>
                    <p className="text-[10px] text-muted-foreground mb-2.5">{course.completed}/{course.total} lessons</p>
                    <div className="h-1.5 rounded-full bg-border overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${course.progress}%` }} transition={{ delay: 0.55 + i * 0.05, duration: 1, ease: "easeOut" }} className="h-full rounded-full gradient-primary" />
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-muted-foreground">{course.progress}%</span>
                      <span className="flex items-center gap-0.5 text-[10px] font-semibold text-xp"><Star className="w-3 h-3 fill-current opacity-70" />{course.xp}</span>
                    </div>
                  </motion.div>
                </MagicCard>
              ))}
            </BentoCardGrid>
          </motion.div>
        </div>

        <div>
          <SectionHeader title="District Leaderboard" linkTo="/leaderboard" delay={0.35} />
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.37 }} className="glass rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-border/40 flex items-center justify-between bg-muted/20">
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Your rank</p>
                <p className="text-xl font-display font-black text-primary">#2</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">XP to #1</p>
                <p className="text-sm font-bold text-foreground">1,200 XP</p>
              </div>
            </div>
            <AnimatedList items={leaderboardItems} onItemSelect={() => navigate("/leaderboard")} showGradients enableArrowNavigation displayScrollbar={false} />
          </motion.div>
        </div>
      </div>

    </AppLayout>
  );
};

export default Index;
