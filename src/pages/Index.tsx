import { motion } from "framer-motion";
import { Star, Zap, BookOpen, TrendingUp, Brain, BarChart3, ArrowRight } from "lucide-react";
import BlurText from "@/components/BlurText";
import { Link, useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import StatCard from "@/components/StatCard";
import { BentoCardGrid, MagicCard } from "@/components/MagicCard";
import AnimatedList from "@/components/AnimatedList";
import chatbotOwl from "@/assets/chatbot-owl.png";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";

const subjectScores = [
  { subject: "Science", score: 72 },
  { subject: "English", score: 90 },
  { subject: "Maths", score: 45 },
  { subject: "Civics", score: 30 },
  { subject: "History", score: 55 },
  { subject: "Health", score: 65 },
];

const courses = [
  { name: "Science", progress: 72, completed: 17, total: 24, xp: 340 },
  { name: "English", progress: 90, completed: 18, total: 20, xp: 520 },
  { name: "Maths", progress: 45, completed: 8, total: 18, xp: 210 },
  { name: "Civics", progress: 30, completed: 9, total: 30, xp: 150 },
  { name: "History", progress: 55, completed: 11, total: 20, xp: 280 },
  { name: "Health Science", progress: 65, completed: 13, total: 20, xp: 310 },
];

const leaderboard = [
  { rank: 1, name: "Sarah K.", xp: 3200, level: 15 },
  { rank: 2, name: "You", xp: 2450, level: 12, isYou: true },
  { rank: 3, name: "Mike R.", xp: 2100, level: 11 },
  { rank: 4, name: "Emma L.", xp: 1950, level: 10 },
  { rank: 5, name: "James P.", xp: 1800, level: 9 },
];

const Index = () => {
  const navigate = useNavigate();

  const leaderboardItems = leaderboard.map((entry) => (
    <div className="flex items-center gap-3" key={entry.rank}>
      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${entry.rank <= 3 ? 'gradient-accent text-accent-foreground' : 'bg-muted text-muted-foreground'
        }`}>
        {entry.rank}
      </span>
      <div className="flex-1">
        <p className={`text-sm font-semibold ${entry.isYou ? 'text-primary' : 'text-foreground'}`}>{entry.name}</p>
        <p className="text-xs text-muted-foreground">Lvl {entry.level}</p>
      </div>
      <span className="text-sm font-bold text-foreground">{entry.xp.toLocaleString()} XP</span>
    </div>
  ));

  return (
    <AppLayout>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <BlurText
            text="Welcome back, User!"
            delay={50}
            animateBy="words"
            direction="top"
            className="text-3xl font-display font-bold text-foreground"
          />
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

      {/* Bento Cards */}
      <BentoCardGrid className="grid grid-cols-3 gap-4 mb-8">
        {/* Go to Quizzes */}
        <MagicCard onClick={() => navigate('/quizzes')} enableTilt={true} enableMagnetism={true} enableStars={true} glowColor="178,197,157">
          <div className="flex flex-col h-full bg-background/60 p-4 rounded-xl border border-transparent hover:border-border/50 transition-colors">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-3">
              <Brain className="w-6 h-6 text-primary-foreground" />
            </div>
            <h2 className="text-xl font-display font-bold text-foreground mb-1">Go to Quizzes</h2>
            <p className="text-sm text-muted-foreground">Test your knowledge and earn XP rewards</p>
            <div className="mt-auto pt-3 flex gap-2">
              <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">6 available</span>
              <span className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent font-medium">+50-120 XP</span>
            </div>
          </div>
        </MagicCard>

        {/* Analytics */}
        <MagicCard onClick={() => navigate('/analytics')} enableTilt={true} enableMagnetism={true} enableStars={true} glowColor="212,168,122">
          <div className="flex flex-col h-full bg-background/60 p-4 rounded-xl border border-transparent hover:border-border/50 transition-colors">
            <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center mb-3">
              <BarChart3 className="w-6 h-6 text-accent-foreground" />
            </div>
            <h2 className="text-xl font-display font-bold text-foreground mb-1">Analytics</h2>
            <div className="mt-auto h-[80px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectScores}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(40 15% 85%)" />
                  <XAxis dataKey="subject" tick={{ fontSize: 9, fill: 'hsl(30 10% 50%)' }} />
                  <YAxis hide />
                  <Tooltip contentStyle={{ background: 'hsl(40 25% 97%)', border: '1px solid hsl(40 15% 85%)', borderRadius: '8px', fontSize: '11px' }} />
                  <Bar dataKey="score" fill="hsl(100 25% 55%)" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </MagicCard>

        {/* AI Chatbot */}
        <MagicCard onClick={() => navigate('/chatbot')} enableTilt={true} enableMagnetism={true} enableStars={true} glowColor="176,138,104">
          <div className="flex flex-col items-center justify-center h-full bg-background/60 p-4 rounded-xl border border-transparent hover:border-border/50 text-center transition-colors">
            <img src={chatbotOwl} alt="AI Chatbot" className="w-20 h-20 object-contain mb-2" />
            <h2 className="text-xl font-display font-bold text-foreground mb-1">AI Chatbot</h2>
            <p className="text-sm text-muted-foreground">Get instant help with your studies</p>
            <div className="mt-3 flex items-center gap-1.5 bg-background/80 px-3 py-1.5 rounded-full border border-border/50">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse-glow" />
              <span className="text-xs font-medium text-success">Online</span>
            </div>
          </div>
        </MagicCard>
      </BentoCardGrid>

      {/* Courses + Leaderboard */}
      <div className="grid grid-cols-3 gap-6">
        {/* My Courses Card */}
        <div className="col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-display font-bold text-foreground">My Courses</h2>
            <Link to="/courses" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="glass rounded-2xl p-4">
            <BentoCardGrid className="grid grid-cols-3 gap-3">
              {courses.map((course, i) => (
                <MagicCard
                  key={course.name}
                  glowColor="178,197,157"
                  enableTilt={true}
                  enableMagnetism={true}
                  particleCount={5}
                  className="rounded-xl overflow-hidden cursor-pointer"
                  onClick={() => navigate('/courses')}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    className="p-4"
                  >
                    <div className="relative z-10 w-full">
                      <h3 className="text-sm font-display font-bold text-foreground transition-colors">{course.name}</h3>
                      <div className="mt-3 h-1.5 rounded-full bg-border overflow-hidden relative">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${course.progress}%` }}
                          transition={{ delay: 0.5 + i * 0.05, duration: 1, ease: "easeOut" }}
                          className="h-full rounded-full gradient-primary absolute left-0 top-0"
                        />
                      </div>
                      <div className="mt-2.5 flex items-center justify-between">
                        <span className="text-xs text-muted-foreground transition-colors">{course.progress}% done</span>
                        <span className="flex items-center gap-1 text-xs font-medium text-xp transition-colors">
                          <Star className="w-3.5 h-3.5 fill-current opacity-70" />
                          {course.xp}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </MagicCard>
              ))}
            </BentoCardGrid>
          </div>
        </div>

        {/* Leaderboard using AnimatedList */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-display font-bold text-foreground">Leaderboard</h2>
            <Link to="/leaderboard" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="glass rounded-2xl overflow-hidden">
            <AnimatedList
              items={leaderboardItems}
              onItemSelect={(_, index) => navigate('/leaderboard')}
              showGradients={true}
              enableArrowNavigation={true}
              displayScrollbar={false}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
