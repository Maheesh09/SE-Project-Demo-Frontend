import { motion } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import BlurText from "@/components/BlurText";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  AreaChart, Area, BarChart, Bar, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";
import {
  TrendingUp, TrendingDown, Minus, BookOpen, Target, Clock,
  Star, Zap, AlertTriangle, CheckCircle, ChevronRight,
} from "lucide-react";

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

// ─── Data ─────────────────────────────────────────────────────────────────────

const subjects = [
  { name: "English", score: 90, prev: 82, target: 85, lessons: 18, total: 20, quizzes: 9, passed: 9, studyHrs: 12 },
  { name: "Science", score: 72, prev: 65, target: 80, lessons: 17, total: 24, quizzes: 8, passed: 6, studyHrs: 9 },
  { name: "Health Sci", score: 65, prev: 60, target: 75, lessons: 13, total: 20, quizzes: 6, passed: 5, studyHrs: 7 },
  { name: "History", score: 55, prev: 48, target: 65, lessons: 11, total: 20, quizzes: 6, passed: 4, studyHrs: 5 },
  { name: "Maths", score: 45, prev: 50, target: 70, lessons: 8, total: 18, quizzes: 7, passed: 3, studyHrs: 6 },
  { name: "Civics", score: 30, prev: 28, target: 60, lessons: 9, total: 30, quizzes: 5, passed: 2, studyHrs: 3 },
];

const weeklyProgress = [
  { week: "Wk 1", xp: 150, score: 54 },
  { week: "Wk 2", xp: 230, score: 58 },
  { week: "Wk 3", xp: 280, score: 61 },
  { week: "Wk 4", xp: 310, score: 63 },
  { week: "Wk 5", xp: 380, score: 66 },
  { week: "Wk 6", xp: 420, score: 69 },
  { week: "Wk 7", xp: 520, score: 76 },
];

const dailyStudy = [
  { day: "Mon", min: 45 },
  { day: "Tue", min: 90 },
  { day: "Wed", min: 30 },
  { day: "Thu", min: 75 },
  { day: "Fri", min: 110 },
  { day: "Sat", min: 60 },
  { day: "Sun", min: 20 },
];

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

const avgScore = Math.round(subjects.reduce((s, c) => s + c.score, 0) / subjects.length);
const totalXP = 2450;
const totalStudyMin = dailyStudy.reduce((s, d) => s + d.min, 0);
const overallGrade = getGrade(avgScore);

const timeRanges = ["This Week", "This Month", "All Time"];

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

const SubjectCard = ({ s, delay }: { s: typeof subjects[0]; delay: number }) => {
  const mastery = getMastery(s.score);
  const delta = s.score - s.prev;
  const isUp = delta > 0;
  const onTarget = s.score >= s.target;
  const accuracy = Math.round((s.passed / s.quizzes) * 100);

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
          <h4 className="font-display font-bold text-foreground text-sm">{s.name}</h4>
          <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mt-1 inline-block", mastery.bg, mastery.color)}>
            {mastery.label}
          </span>
        </div>
        <div className="relative flex items-center justify-center">
          <Ring score={s.score} color={mastery.ring} size={60} stroke={5} />
          <span className="absolute text-sm font-display font-bold text-foreground">{s.score}%</span>
        </div>
      </div>

      {/* Target bar */}
      <div>
        <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
          <span>Progress to target ({s.target}%)</span>
          <span className={onTarget ? "text-success font-semibold" : "text-warning font-semibold"}>
            {onTarget ? "On target" : `${s.target - s.score}% away`}
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-border overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${Math.min(100, (s.score / s.target) * 100)}%`,
              background: onTarget ? "hsl(88 29% 55%)" : "hsl(30 52% 65%)",
            }}
          />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 text-center border-t border-border/40 pt-3">
        <div>
          <p className="text-xs font-bold text-foreground">{s.lessons}/{s.total}</p>
          <p className="text-[10px] text-muted-foreground">Lessons</p>
        </div>
        <div>
          <p className="text-xs font-bold text-foreground">{accuracy}%</p>
          <p className="text-[10px] text-muted-foreground">Quiz Accuracy</p>
        </div>
        <div>
          <p className="text-xs font-bold text-foreground">{s.studyHrs}h</p>
          <p className="text-[10px] text-muted-foreground">Study Time</p>
        </div>
      </div>

      {/* Trend */}
      <div className={cn("flex items-center gap-1.5 text-[11px] font-semibold rounded-xl px-3 py-1.5", isUp ? "bg-success/10 text-success" : delta < 0 ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground")}>
        {isUp ? <TrendingUp className="w-3.5 h-3.5" /> : delta < 0 ? <TrendingDown className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
        {Math.abs(delta)}% vs last period · {isUp ? "Improving" : delta < 0 ? "Declined" : "No change"}
      </div>
    </motion.div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const AnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState("This Month");
  const radarData = subjects.map((s) => ({ subject: s.name, score: s.score, target: s.target }));

  const struggling = subjects.filter((s) => s.score < 50);
  const onTrack = subjects.filter((s) => s.score >= s.target);

  return (
    <AppLayout>
      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between mb-6">
        <div>
          <BlurText text="Analytics" delay={50} animateBy="words" direction="top" className="text-3xl font-display font-bold text-foreground mb-1" />
          <p className="text-sm text-muted-foreground">Complete learning performance report for <span className="font-semibold text-foreground">User</span></p>
        </div>
        <div className="flex gap-1.5 bg-card border border-border/50 rounded-xl p-1">
          {timeRanges.map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={cn(
                "text-xs font-semibold px-3 py-1.5 rounded-lg transition-all",
                timeRange === r
                  ? "gradient-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >{r}</button>
          ))}
        </div>
      </motion.div>

      {/* ── Report card header ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="bg-card border border-border/50 rounded-2xl p-6 mb-6"
      >
        <div className="flex items-center gap-8">
          {/* Grade circle */}
          <div className="flex-shrink-0 flex flex-col items-center gap-1">
            <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center shadow-md">
              <span className="text-3xl font-display font-black text-primary-foreground">{overallGrade.grade}</span>
            </div>
            <p className="text-xs font-semibold text-muted-foreground">{overallGrade.label}</p>
          </div>

          {/* KPI summary */}
          <div className="flex-1 grid grid-cols-5 gap-4">
            {[
              { icon: Target, label: "Overall Score", value: `${avgScore}%`, color: "text-primary", hint: "Average across all subjects" },
              { icon: Star, label: "Total XP", value: `${totalXP.toLocaleString()}`, color: "text-xp", hint: "Points earned to date" },
              { icon: Clock, label: "Study Time", value: `${Math.floor(totalStudyMin / 60)}h ${totalStudyMin % 60}m`, color: "text-accent", hint: "This week" },
              { icon: BookOpen, label: "Subjects On Track", value: `${onTrack.length} / ${subjects.length}`, color: "text-success", hint: "At or above target" },
              { icon: Zap, label: "Active Streak", value: "7 Days", color: "text-streak", hint: "Current daily streak" },
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

        {/* Priority alerts */}
        {struggling.length > 0 && (
          <div className="mt-5 pt-4 border-t border-border/40 flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-foreground">Action Required</p>
              <p className="text-xs text-muted-foreground">
                {struggling.map((s) => s.name).join(" and ")} {struggling.length === 1 ? "is" : "are"} below 50%.
                Consider dedicating <span className="text-warning font-semibold">20 extra minutes daily</span> to these subjects.
              </p>
            </div>
            {onTrack.length > 0 && (
              <>
                <div className="w-px h-6 bg-border/50 ml-2 mr-2 mt-0.5" />
                <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-foreground">Doing Well</p>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-success font-semibold">{onTrack.map((s) => s.name).join(", ")}</span> — at or above personal target. Keep it up!
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </motion.div>

      {/* ── Subject cards ── */}
      <div className="mb-2">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Subject Breakdown
        </motion.p>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {subjects.map((s, i) => <SubjectCard key={s.name} s={s} delay={0.18 + i * 0.05} />)}
        </div>
      </div>

      {/* ── Charts row ── */}
      <div className="grid grid-cols-3 gap-6 mb-6">

        {/* Overall score trend */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="col-span-2 glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-display font-bold text-foreground">Score Trend Over Time</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Overall average score progression week by week</p>
            </div>
            <div className="flex items-center gap-1.5 bg-success/10 text-success text-xs font-bold px-2.5 py-1 rounded-full">
              <TrendingUp className="w-3.5 h-3.5" /> +22pts in 7 weeks
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={weeklyProgress}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
              <XAxis dataKey="week" tick={CHART.tick} />
              <YAxis tick={CHART.tick} domain={[40, 100]} unit="%" />
              <Tooltip contentStyle={CHART.tooltip} formatter={(v) => [`${v}%`, "Avg Score"]} />
              <ReferenceLine y={avgScore} stroke="hsl(30 52% 65%)" strokeDasharray="4 4" label={{ value: "Current", position: "right", fontSize: 10, fill: "hsl(30 52% 65%)" }} />
              <Area type="monotone" dataKey="score" stroke="hsl(88 29% 55%)" fill="hsl(88 29% 69%)" fillOpacity={0.2} strokeWidth={2.5} dot={{ fill: "hsl(88 29% 55%)", r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Skill radar */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="glass rounded-2xl p-6">
          <h3 className="font-display font-bold text-foreground mb-1">Skill Radar</h3>
          <p className="text-xs text-muted-foreground mb-4">Competency across all subjects</p>
          <ResponsiveContainer width="100%" height={210}>
            <RadarChart data={radarData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
              <PolarGrid stroke={CHART.grid} />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9.5, fill: "hsl(28 20% 50%)" }} />
              <PolarRadiusAxis tick={false} domain={[0, 100]} />
              <Radar name="Target" dataKey="target" stroke="hsl(30 52% 65%)" fill="hsl(30 52% 65%)" fillOpacity={0.1} strokeWidth={1.5} strokeDasharray="4 4" />
              <Radar name="Score" dataKey="score" stroke="hsl(88 29% 55%)" fill="hsl(88 29% 69%)" fillOpacity={0.3} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-4 mt-1">
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground"><span className="w-3 h-0.5 bg-primary rounded inline-block" /> Score</div>
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground"><span className="w-3 h-0.5 bg-accent rounded inline-block" style={{ borderTop: "1.5px dashed hsl(30 52% 65%)", background: "none" }} /> Target</div>
          </div>
        </motion.div>
      </div>

      {/* ── Bottom row: bar chart + study time + recommendations ── */}
      <div className="grid grid-cols-3 gap-6">
        {/* Quiz score per subject */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass rounded-2xl p-6">
          <h3 className="font-display font-bold text-foreground mb-1">Score vs Target</h3>
          <p className="text-xs text-muted-foreground mb-4">Current score compared to your goal</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={subjects} layout="vertical" barGap={3}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} horizontal={false} />
              <XAxis type="number" tick={CHART.tick} domain={[0, 100]} unit="%" />
              <YAxis type="category" dataKey="name" tick={{ ...CHART.tick, fontSize: 10 }} width={65} />
              <Tooltip contentStyle={CHART.tooltip} formatter={(v) => [`${v}%`]} />
              <Bar dataKey="score" name="Score" fill="hsl(88 29% 65%)" radius={[0, 4, 4, 0]} />
              <Bar dataKey="target" name="Target" fill="hsl(30 52% 65%)" radius={[0, 4, 4, 0]} opacity={0.45} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Daily study time */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }} className="glass rounded-2xl p-6">
          <h3 className="font-display font-bold text-foreground mb-1">Daily Study Time</h3>
          <p className="text-xs text-muted-foreground mb-4">Minutes per day this week · Total: {Math.floor(totalStudyMin / 60)}h {totalStudyMin % 60}m</p>
          <div className="flex items-end justify-between gap-1.5 h-[160px] px-1">
            {dailyStudy.map((d) => {
              const pct = (d.min / 120) * 100;
              const isToday = d.day === "Fri";
              return (
                <div key={d.day} className="flex flex-col items-center gap-1.5 flex-1">
                  <span className="text-[10px] text-muted-foreground">{d.min}m</span>
                  <div className="w-full rounded-t-md overflow-hidden flex-1 flex items-end bg-border/30">
                    <div
                      className={cn("w-full rounded-t-md transition-all duration-700", isToday ? "gradient-primary" : "bg-primary/50")}
                      style={{ height: `${pct}%` }}
                    />
                  </div>
                  <span className={cn("text-[10px] font-semibold", isToday ? "text-primary" : "text-muted-foreground")}>{d.day}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-3 pt-3 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
            <span>Goal: <span className="text-foreground font-semibold">60 min/day</span></span>
            <span className="text-success font-semibold">4/7 days met goal</span>
          </div>
        </motion.div>

        {/* Recommendations */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="glass rounded-2xl p-6 flex flex-col gap-4">
          <div>
            <h3 className="font-display font-bold text-foreground mb-1">Recommendations</h3>
            <p className="text-xs text-muted-foreground">Based on your performance data</p>
          </div>

          {[
            {
              priority: "High",
              color: "border-destructive/40 bg-destructive/5",
              badge: "bg-destructive/10 text-destructive",
              icon: AlertTriangle,
              iconColor: "text-destructive",
              title: "Focus on Civics & Maths",
              desc: "Both are below 50%. Practice 1 quiz per day in each subject.",
            },
            {
              priority: "Medium",
              color: "border-warning/40 bg-warning/5",
              badge: "bg-warning/10 text-warning",
              icon: Target,
              iconColor: "text-warning",
              title: "Push History to target",
              desc: "You're 10% away from your 65% target. 2 more lessons will get you there.",
            },
            {
              priority: "Low",
              color: "border-success/40 bg-success/5",
              badge: "bg-success/10 text-success",
              icon: CheckCircle,
              iconColor: "text-success",
              title: "Maintain English & Science",
              desc: "You're ahead of target. Review once a week to retain knowledge.",
            },
            {
              priority: "Habit",
              color: "border-primary/30 bg-primary/5",
              badge: "bg-primary/10 text-primary",
              icon: Clock,
              iconColor: "text-primary",
              title: "Study 60 min daily",
              desc: "Wed, Thu, Sun fell short of daily goal. Consistency drives results.",
            },
          ].map((r) => (
            <div key={r.title} className={cn("rounded-xl border p-3 flex items-start gap-3", r.color)}>
              <r.icon className={cn("w-4 h-4 flex-shrink-0 mt-0.5", r.iconColor)} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-xs font-bold text-foreground">{r.title}</p>
                  <span className={cn("text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full", r.badge)}>{r.priority}</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{r.desc}</p>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
            </div>
          ))}
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default AnalyticsPage;
