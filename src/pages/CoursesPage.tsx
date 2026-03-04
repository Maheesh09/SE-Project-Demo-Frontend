import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, BookOpen, Clock, TrendingUp, Award, Flame, ChevronRight, CheckCircle2, PlayCircle, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import BlurText from "@/components/BlurText";
import { cn } from "@/lib/utils";

const allCourses = [
  { id: "c1", name: "Science", description: "Physics, Chemistry, and Biology fundamentals for curious minds.", status: "in-progress", progress: 72, completed: 17, total: 24, xp: 340, timeLeft: "2h 30m", nextLesson: "Newton's Laws of Motion", color: "from-[#b2c59d] to-[#9cb282]" },
  { id: "c2", name: "English", description: "Classic and modern literature analysis, critical thinking, and essay writing.", status: "in-progress", progress: 90, completed: 18, total: 20, xp: 520, timeLeft: "45m", nextLesson: "Shakespeare's Sonnets", color: "from-[#eed4b5] to-[#d6bc99]" },
  { id: "c3", name: "Maths", description: "Algebra, Calculus, and Geometry fundamentals for building strong math skills.", status: "in-progress", progress: 45, completed: 8, total: 18, xp: 210, timeLeft: "4h 10m", nextLesson: "Quadratic Equations", color: "from-[#eed4b5] to-[#d6bc99]" },
  { id: "c4", name: "Civics", description: "Understanding government, rights, duties, and the democratic process.", status: "completed", progress: 100, completed: 30, total: 30, xp: 150, timeLeft: "0m", nextLesson: "Final Exam Review", color: "from-[#b2c59d] to-[#b08a68]" },
  { id: "c5", name: "History", description: "Exploring ancient civilizations, world wars, and cultural evolution.", status: "in-progress", progress: 55, completed: 11, total: 20, xp: 280, timeLeft: "3h 20m", nextLesson: "World War II Overview", color: "from-[#b2c59d] to-[#9cb282]" },
  { id: "c6", name: "Health Sci", description: "Nutrition, anatomy, wellness, and preventive healthcare knowledge.", status: "locked", progress: 0, completed: 0, total: 20, xp: 0, timeLeft: "5h 00m", nextLesson: "Digestive System", color: "from-muted-foreground/30 to-muted-foreground/10" },
];

const totalXP = allCourses.reduce((s, c) => s + c.xp, 0);
const avgProgress = Math.round(allCourses.reduce((s, c) => s + c.progress, 0) / allCourses.length);
const completedLessons = allCourses.reduce((s, c) => s + c.completed, 0);
const totalLessons = allCourses.reduce((s, c) => s + c.total, 0);

const CoursesPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"all" | "in-progress" | "completed">("in-progress");

  const filteredCourses = allCourses.filter(c => {
    if (activeTab === "all") return true;
    if (activeTab === "in-progress") return c.status === "in-progress" || c.status === "locked";
    return c.status === "completed";
  });

  return (
    <AppLayout>

      {/* ── Page Header ── */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <BlurText text="My Courses" delay={50} animateBy="words" direction="top" className="text-3xl font-display font-bold text-foreground mb-1" />
          <p className="text-sm text-muted-foreground">Pick up where you left off or start something new.</p>
        </div>
        <div className="flex bg-card border border-border/50 p-1.5 rounded-xl shadow-sm w-fit">
          {(["all", "in-progress", "completed"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all duration-200",
                activeTab === tab ? "bg-primary/10 text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.replace("-", " ")}
            </button>
          ))}
        </div>
      </motion.div>

      {/* ── Stats Row ── */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Star, label: "Total XP Earned", value: `${totalXP.toLocaleString()}`, color: "text-xp", bg: "bg-xp/10" },
          { icon: TrendingUp, label: "Avg Progress", value: `${avgProgress}%`, color: "text-primary", bg: "bg-primary/10" },
          { icon: CheckCircle2, label: "Lessons Done", value: `${completedLessons}`, color: "text-success", bg: "bg-success/10" },
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

        {/* ── Main Course Grid ── */}
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <AnimatePresence mode="popLayout">
              {filteredCourses.map((course, i) => (
                <motion.div
                  key={course.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.25, delay: i * 0.05 }}
                  className={cn(
                    "flex flex-col bg-card border rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all group",
                    course.status === "locked" ? "border-border/40 opacity-75" : "border-border/60 hover:border-primary/40"
                  )}
                >
                  {/* Decorative Header */}
                  <div className={cn("h-24 bg-gradient-to-br relative p-5 flex items-start justify-between", course.color)}>
                    {course.status === "locked" && (
                      <div className="absolute inset-0 bg-background/40 backdrop-blur-[2px] z-0" />
                    )}
                    <div className="relative z-10">
                      <h3 className="text-xl font-display font-bold text-white drop-shadow-sm mb-1">{course.name}</h3>
                      <p className="text-xs font-medium text-white/90 drop-shadow-sm flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" />
                        {course.completed} / {course.total} Lessons
                      </p>
                    </div>
                    {course.status === "completed" && (
                      <div className="relative z-10 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shadow-sm text-white">
                        <Award className="w-5 h-5" />
                      </div>
                    )}
                    {course.status === "locked" && (
                      <div className="relative z-10 w-8 h-8 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center shadow-sm text-white">
                        <Lock className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-5 flex-1 flex flex-col">
                    <p className="text-sm text-muted-foreground leading-relaxed mb-6 line-clamp-2 min-h-[40px]">
                      {course.description}
                    </p>

                    {/* Progress Track */}
                    <div className="mb-5 mt-auto">
                      <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider mb-2">
                        <span className={course.progress === 100 ? "text-success" : "text-muted-foreground"}>
                          {course.progress === 100 ? "Completed" : `${course.progress}% done`}
                        </span>
                        <span className="flex items-center gap-1 text-xp"><Star className="w-3.5 h-3.5" /> {course.xp} XP</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${course.progress}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className={cn("h-full rounded-full transition-colors", course.progress === 100 ? "bg-success" : "gradient-primary")}
                        />
                      </div>
                    </div>

                    {/* Up Next & CTA */}
                    <div className="bg-muted/40 rounded-2xl p-4 flex items-center justify-between">
                      <div className="flex-1 min-w-0 pr-4">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                          {course.status === "completed" ? "Review" : "Up Next"}
                        </p>
                        <p className="text-sm font-semibold text-foreground truncate">{course.nextLesson}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <Clock className="w-3.5 h-3.5" /> {course.timeLeft} video
                        </p>
                      </div>
                      <button
                        onClick={() => navigate("/subject/" + course.title.toLowerCase().replace(/\s+/g, '-'))}
                        disabled={course.status === "locked"}
                        className={cn(
                          "w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center transition-all shadow-sm",
                          course.status === "completed" ? "bg-success text-white hover:opacity-90" :
                            course.status === "locked" ? "bg-muted text-muted-foreground opacity-50 cursor-not-allowed" :
                              "gradient-primary text-white hover:opacity-90 group-hover:scale-105"
                        )}
                      >
                        <PlayCircle className={cn("w-6 h-6", course.status === "locked" && "hidden")} />
                        {course.status === "locked" && <Lock className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {filteredCourses.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-1 md:col-span-2 py-24 flex flex-col items-center justify-center text-center border-2 border-dashed border-border/50 rounded-3xl bg-muted/10">
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                  <BookOpen className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-display font-bold text-foreground mb-1">No courses found</h3>
                <p className="text-sm text-muted-foreground max-w-sm mb-6">You haven't added or completed any courses in this category yet. Start learning to see them here.</p>
                <button
                  onClick={() => setActiveTab("all")}
                  className="px-6 py-2.5 bg-background border border-border rounded-xl text-sm font-bold text-foreground hover:bg-muted transition-colors shadow-sm"
                >
                  Explore All Subjects
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {/* ── Sidebar (Achievements & Tips) ── */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="w-full lg:w-[320px] flex flex-col gap-5">

          {/* Pro Upgrade Banner */}
          <div className="bg-gradient-to-br from-accent to-background border border-accent/30 rounded-3xl p-6 relative overflow-hidden shadow-sm">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-accent/20 blur-3xl rounded-full" />
            <Award className="w-8 h-8 text-accent mb-3 relative z-10" />
            <h3 className="text-lg font-display font-bold text-foreground mb-1 relative z-10">MindUp Pro</h3>
            <p className="text-sm text-foreground/80 mb-4 relative z-10 leading-relaxed">
              Unlock the Health Science module, custom quizzes, and advanced analytics.
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
                { icon: Star, label: "English Master", sub: "90% progress", color: "text-xp", bg: "bg-xp/10" },
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
