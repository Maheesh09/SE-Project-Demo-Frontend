import { motion } from "framer-motion";
import { Star, Zap, BookOpen, TrendingUp, Brain, BarChart3, MessageCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import StatCard from "@/components/StatCard";
import CourseCard from "@/components/CourseCard";
import LeaderboardRow from "@/components/LeaderboardRow";

const courses = [
  { name: "Science", progress: 72, completed: 17, total: 24, xp: 340, colorClass: "bg-course-science" },
  { name: "English", progress: 90, completed: 18, total: 20, xp: 520, colorClass: "bg-course-english" },
  { name: "Maths", progress: 45, completed: 8, total: 18, xp: 210, colorClass: "bg-course-maths" },
  { name: "Civics", progress: 30, completed: 9, total: 30, xp: 150, colorClass: "bg-course-civics" },
  { name: "History", progress: 55, completed: 11, total: 20, xp: 280, colorClass: "bg-course-history" },
  { name: "Health Science", progress: 65, completed: 13, total: 20, xp: 310, colorClass: "bg-course-health" },
];

const leaderboard = [
  { rank: 1, name: "Sarah K.", xp: 3200, level: 15 },
  { rank: 2, name: "You", xp: 2450, level: 12, isYou: true },
  { rank: 3, name: "Mike R.", xp: 2100, level: 11 },
  { rank: 4, name: "Emma L.", xp: 1950, level: 10 },
  { rank: 5, name: "James P.", xp: 1800, level: 9 },
];

const Index = () => {
  return (
    <AppLayout>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl font-display font-bold text-foreground">
            Welcome back, Learner!
          </h1>
          <p className="text-muted-foreground mt-1">
            Keep up the momentum — you're on a <span className="font-semibold text-streak">7-day streak!</span>
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 gradient-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold text-sm shadow-glow hover:opacity-90 transition-opacity"
          >
            Continue Learning
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard icon={Star} label="Total XP" value="2,450" subtitle="+120 this week" colorClass="text-xp" delay={0} />
        <StatCard icon={Zap} label="Day Streak" value="7" subtitle="Best: 14 days" colorClass="text-streak" delay={0.1} />
        <StatCard icon={BookOpen} label="Courses Active" value="6" subtitle="2 completed" colorClass="text-primary" delay={0.2} />
        <StatCard icon={TrendingUp} label="Quiz Score" value="87%" subtitle="+5%" colorClass="text-success" delay={0.3} />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Link to="/quizzes" className="block glass glass-hover rounded-2xl p-6 group">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="font-display font-bold text-foreground group-hover:text-primary transition-colors">Go to Quizzes</h3>
            <p className="text-sm text-muted-foreground mt-1">Test your knowledge and earn XP</p>
            <div className="mt-3 flex gap-2">
              <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">6 available</span>
              <span className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent font-medium">+50-120 XP</span>
            </div>
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Link to="/analytics" className="block glass glass-hover rounded-2xl p-6 group">
            <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-secondary-foreground" />
            </div>
            <h3 className="font-display font-bold text-foreground group-hover:text-primary transition-colors">Analytics</h3>
            <p className="text-sm text-muted-foreground mt-1">Track your learning progress</p>
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Link to="/chatbot" className="block glass glass-hover rounded-2xl p-6 group relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center mb-4">
              <MessageCircle className="w-6 h-6 text-accent-foreground" />
            </div>
            <h3 className="font-display font-bold text-foreground group-hover:text-primary transition-colors">AI Chatbot</h3>
            <p className="text-sm text-muted-foreground mt-1">Get instant help with your studies</p>
            <div className="mt-3 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse-glow" />
              <span className="text-xs font-medium text-success">Online</span>
            </div>
          </Link>
        </motion.div>
      </div>

      {/* Courses + Leaderboard */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-display font-bold text-foreground">My Courses</h2>
            <Link to="/courses" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {courses.map((course, i) => (
              <CourseCard key={course.name} {...course} delay={0.3 + i * 0.05} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-display font-bold text-foreground mb-4">Leaderboard</h2>
          <div className="glass rounded-2xl p-2 space-y-1">
            {leaderboard.map((entry) => (
              <LeaderboardRow key={entry.rank} {...entry} />
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
