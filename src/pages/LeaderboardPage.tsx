import { motion } from "framer-motion";
import { Trophy, Star, Zap, TrendingUp, Brain, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import BlurText from "@/components/BlurText";
import { useEffect, useState } from "react";
import { useProfile } from "@/hooks/useProfile";
import { useAuth, useUser } from "@clerk/clerk-react";
import { api, type DashboardStats } from "@/lib/api";


// ─── Page ─────────────────────────────────────────────────────────────────────

const LeaderboardPage = () => {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const { getToken } = useAuth();
  const { user } = useUser();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const token = await getToken();
        if (!token) return;
        const email = user?.primaryEmailAddress?.emailAddress || "";
        const data = await api.getDashboardStats(token, user?.id, email);
        if (!cancelled) setStats(data);
      } catch (err) {
        console.error("Failed to load stats:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [getToken, user]);

  return (
    <AppLayout>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-7">
        <BlurText text="Leaderboard" delay={50} animateBy="words" direction="top" className="text-3xl font-display font-bold text-foreground mb-1" />
        <p className="text-muted-foreground text-sm">See how you're doing</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Main panel — Coming soon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <div className="bg-card border border-border/60 rounded-2xl p-8 sm:p-12 text-center shadow-sm">
            <div className="w-20 h-20 rounded-2xl gradient-accent flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Trophy className="w-10 h-10 text-accent-foreground" />
            </div>
            <div className="inline-flex items-center gap-1.5 bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Coming Soon
            </div>
            <h2 className="text-2xl font-display font-bold text-foreground mb-3">
              District Leaderboard
            </h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mb-8 leading-relaxed">
              We're building a real-time leaderboard where you can compare your XP and quiz scores with students in your district and across Sri Lanka. Stay tuned!
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <button
                onClick={() => navigate("/quizzes")}
                className="flex items-center gap-2 gradient-primary text-primary-foreground px-6 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity shadow-sm"
              >
                <Brain className="w-4 h-4" /> Take a Quiz
              </button>
              <Link
                to="/courses"
                className="flex items-center gap-2 bg-card border border-border/60 text-foreground px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-muted/50 transition-colors"
              >
                Browse Courses <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Right sidebar — Your real stats */}
        <div className="flex flex-col gap-4">
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-card rounded-2xl p-5 border border-border/60 shadow-sm"
          >
            <p className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
              <Star className="w-4 h-4 text-xp" /> Your Stats
            </p>

            {loading ? (
              <div className="flex items-center justify-center py-6">
                <span className="w-6 h-6 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
              </div>
            ) : (
              <div className="space-y-0">
                {([
                  { label: "Total XP", value: stats ? stats.total_xp.toLocaleString() : "0", icon: Zap, color: "text-xp", bg: "bg-xp/10" },
                  { label: "Quizzes Taken", value: String(stats?.total_quizzes ?? 0), icon: Brain, color: "text-primary", bg: "bg-primary/10" },
                  { label: "Avg Score", value: stats?.average_score != null ? `${stats.average_score}%` : "—", icon: TrendingUp, color: "text-success", bg: "bg-success/10" },
                  { label: "Subjects", value: String(stats?.subject_stats?.length ?? 0), icon: Star, color: "text-streak", bg: "bg-streak/10" },
                ] as const).map((s) => (
                  <div key={s.label} className="flex items-center justify-between py-2.5 border-b border-border/40 last:border-0">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-lg ${s.bg} flex items-center justify-center`}>
                        <s.icon className={`w-3.5 h-3.5 ${s.color}`} />
                      </div>
                      <span className="text-sm text-muted-foreground font-medium">{s.label}</span>
                    </div>
                    <span className={`text-sm font-bold ${s.color}`}>{s.value}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Subject breakdown */}
          {!loading && stats && stats.subject_stats.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-2xl p-5 border border-border/60 shadow-sm"
            >
              <p className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" /> Per-Subject
              </p>
              <div className="space-y-3.5">
                {stats.subject_stats.map((s) => (
                  <div key={s.subject_id}>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-semibold text-foreground">{s.subject_name}</span>
                      <span className="text-muted-foreground">{Math.round(s.average_score)}% · <span className="text-xp font-semibold">{s.total_xp} XP</span></span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full gradient-primary transition-all duration-700"
                        style={{ width: `${Math.min(100, s.average_score)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-card rounded-2xl p-5 border border-border/60 shadow-sm"
          >
            <p className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" /> How to Earn XP
            </p>
            <ul className="space-y-2.5">
              {["Complete quizzes to earn XP", "Higher scores = more XP", "Try different subjects"].map((tip) => (
                <li key={tip} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <div className="w-4 h-4 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary font-bold text-[8px]">✓</span>
                  </div>
                  {tip}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
};

export default LeaderboardPage;
