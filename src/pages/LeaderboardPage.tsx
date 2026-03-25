import { motion } from "framer-motion";
import { Trophy, Star, Zap, TrendingUp, Brain, ArrowRight, ChevronDown, MapPin, Medal } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import BlurText from "@/components/BlurText";
import { useEffect, useState } from "react";
import { useProfile } from "@/hooks/useProfile";
import { useAuth, useUser } from "@clerk/clerk-react";
import { api, type DashboardStats, type District, type DistrictLeaderboard } from "@/lib/api";
import { cn } from "@/lib/utils";


// ─── Rank badge colors ────────────────────────────────────────────────────────

const rankMedals: Record<number, { color: string; bg: string }> = {
  1: { color: "text-yellow-500", bg: "bg-yellow-500/10" },
  2: { color: "text-gray-400", bg: "bg-gray-400/10" },
  3: { color: "text-amber-600", bg: "bg-amber-600/10" },
};


// ─── Page ─────────────────────────────────────────────────────────────────────

const LeaderboardPage = () => {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const { getToken } = useAuth();
  const { user } = useUser();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // District dropdown
  const [allDistricts, setAllDistricts] = useState<District[]>([]);
  const [selectedDistrictId, setSelectedDistrictId] = useState<number | undefined>(undefined);
  const [districtsLoading, setDistrictsLoading] = useState(true);

  // Leaderboard data
  const [leaderboard, setLeaderboard] = useState<DistrictLeaderboard | null>(null);
  const [lbLoading, setLbLoading] = useState(true);

  // ── Load districts list ──
  useEffect(() => {
    (async () => {
      try {
        const districts = await api.getDistricts();
        setAllDistricts(districts);
      } catch (err) {
        console.error("Failed to load districts:", err);
      } finally {
        setDistrictsLoading(false);
      }
    })();
  }, []);

  // ── Set default district from profile ──
  useEffect(() => {
    if (profile?.district && selectedDistrictId === undefined) {
      setSelectedDistrictId(profile.district.id);
    }
  }, [profile, selectedDistrictId]);

  // ── Load stats ──
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
        if (!cancelled) setStatsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [getToken, user]);

  // ── Load leaderboard when district changes ──
  useEffect(() => {
    if (selectedDistrictId === undefined) return;
    let cancelled = false;
    setLbLoading(true);
    (async () => {
      try {
        const token = await getToken();
        if (!token) return;
        const email = user?.primaryEmailAddress?.emailAddress || "";
        const data = await api.getDistrictLeaderboard(token, selectedDistrictId, user?.id, email);
        if (!cancelled) setLeaderboard(data);
      } catch (err) {
        console.error("Failed to load leaderboard:", err);
      } finally {
        if (!cancelled) setLbLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [getToken, user, selectedDistrictId]);

  // Split entries: top 10 + current user row (if appended outside top 10)
  const top10 = leaderboard?.entries.filter((_, i) => i < 10) ?? [];
  const userEntry = leaderboard?.entries.find(
    (e) => e.is_current_user && e.rank > 10
  );
  const isOwnDistrict = profile?.district?.id === selectedDistrictId;

  return (
    <AppLayout>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <BlurText text="District Leaderboard" delay={50} animateBy="words" direction="top" className="text-3xl font-display font-bold text-foreground mb-1" />
        <p className="text-muted-foreground text-sm">See how you stack up against students in your district</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Main panel ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <div className="glass rounded-2xl p-6 sm:p-8">

            {/* District selector */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center shadow-sm">
                  <MapPin className="w-5 h-5 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">District</p>
                  <p className="text-sm font-bold text-foreground">
                    {leaderboard?.district_name ?? "Select district"}
                  </p>
                </div>
              </div>

              <div className="relative">
                <select
                  id="district-select"
                  value={selectedDistrictId ?? ""}
                  onChange={(e) => setSelectedDistrictId(Number(e.target.value))}
                  disabled={districtsLoading}
                  className="appearance-none bg-card border border-border/50 text-foreground text-sm font-semibold rounded-xl pl-4 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all cursor-pointer hover:bg-muted/50"
                >
                  {allDistricts.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {/* Leaderboard list */}
            {lbLoading ? (
              <div className="flex items-center justify-center py-16">
                <span className="w-8 h-8 rounded-full border-3 border-primary/30 border-t-primary animate-spin" />
              </div>
            ) : top10.length === 0 ? (
              <div className="py-16 text-center">
                <Trophy className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No students with XP in this district yet.</p>
                <button
                  onClick={() => navigate("/quizzes")}
                  className="mt-4 flex items-center gap-2 gradient-primary text-primary-foreground px-5 py-2 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity shadow-sm mx-auto"
                >
                  <Brain className="w-4 h-4" /> Be the first — Take a Quiz
                </button>
              </div>
            ) : (
              <>
                {/* Top 10 list */}
                <div className="space-y-2">
                  {top10.map((entry, i) => {
                    const medal = rankMedals[entry.rank];
                    return (
                      <motion.div
                        key={`${entry.rank}-${entry.username}`}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * i }}
                        className={cn(
                          "flex items-center gap-4 px-4 py-3 rounded-xl transition-colors",
                          entry.is_current_user
                            ? "bg-primary/5 border border-primary/20 shadow-sm"
                            : "hover:bg-muted/50"
                        )}
                      >
                        {/* Rank */}
                        <div className="w-9 flex justify-center flex-shrink-0">
                          {medal ? (
                            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", medal.bg)}>
                              <Medal className={cn("w-4.5 h-4.5", medal.color)} />
                            </div>
                          ) : (
                            <span className="text-sm font-bold text-muted-foreground">#{entry.rank}</span>
                          )}
                        </div>

                        {/* Username */}
                        <div className="flex-1 min-w-0">
                          <p className={cn(
                            "text-sm font-semibold truncate",
                            entry.is_current_user ? "text-primary" : "text-foreground"
                          )}>
                            {entry.username ?? "Anonymous"}
                            {entry.is_current_user && (
                              <span className="ml-2 text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                You
                              </span>
                            )}
                          </p>
                        </div>

                        {/* XP */}
                        <span className="text-sm font-bold text-foreground flex-shrink-0">
                          {entry.total_xp.toLocaleString()} <span className="text-xs text-muted-foreground font-semibold">XP</span>
                        </span>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Current user outside top 10 */}
                {userEntry && isOwnDistrict && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    {/* Separator */}
                    <div className="flex items-center gap-3 my-4">
                      <div className="flex-1 border-t border-border/50 border-dashed" />
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Your Position</span>
                      <div className="flex-1 border-t border-border/50 border-dashed" />
                    </div>

                    <div className="flex items-center gap-4 px-4 py-3 rounded-xl bg-primary/5 border border-primary/20 shadow-sm">
                      <div className="w-9 flex justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-primary">#{userEntry.rank}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-primary truncate">
                          {userEntry.username ?? "Anonymous"}
                          <span className="ml-2 text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                            You
                          </span>
                        </p>
                      </div>
                      <span className="text-sm font-bold text-foreground flex-shrink-0">
                        {userEntry.total_xp.toLocaleString()} <span className="text-xs text-muted-foreground font-semibold">XP</span>
                      </span>
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </motion.div>

        {/* ── Right sidebar ── */}
        <div className="flex flex-col gap-4">

          {/* Your Stats */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-card rounded-2xl p-5 border border-border/50"
          >
            <p className="text-sm font-bold text-foreground mb-4 flex items-center gap-1.5">
              <Star className="w-4 h-4 text-xp" /> Your Stats
            </p>

            {statsLoading ? (
              <div className="flex items-center justify-center py-6">
                <span className="w-6 h-6 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
              </div>
            ) : (
              <div className="space-y-0">
                {([
                  { label: "Total XP", value: stats ? stats.total_xp.toLocaleString() : "0", icon: Zap, color: "text-xp" },
                  { label: "Quizzes Taken", value: String(stats?.total_quizzes ?? 0), icon: Brain, color: "text-primary" },
                  { label: "Avg Score", value: stats?.average_score != null ? `${stats.average_score}%` : "—", icon: TrendingUp, color: "text-success" },
                  { label: "Subjects", value: String(stats?.subject_stats?.length ?? 0), icon: Star, color: "text-streak" },
                ] as const).map((s) => (
                  <div key={s.label} className="flex items-center justify-between py-2.5 border-b border-border/40 last:border-0">
                    <div className="flex items-center gap-2">
                      <s.icon className={`w-3.5 h-3.5 ${s.color}`} />
                      <span className="text-xs text-muted-foreground">{s.label}</span>
                    </div>
                    <span className={`text-sm font-bold ${s.color}`}>{s.value}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Subject breakdown */}
          {!statsLoading && stats && stats.subject_stats.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-2xl p-5 border border-border/50"
            >
              <p className="text-sm font-bold text-foreground mb-3 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-primary" /> Per-Subject
              </p>
              <div className="space-y-3">
                {stats.subject_stats.map((s) => (
                  <div key={s.subject_id}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-medium text-foreground">{s.subject_name}</span>
                      <span className="text-muted-foreground">{Math.round(s.average_score)}% · {s.total_xp} XP</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-border overflow-hidden">
                      <div
                        className="h-full rounded-full gradient-primary"
                        style={{ width: `${Math.min(100, s.average_score)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* How to earn XP */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-card rounded-2xl p-5 border border-border/50"
          >
            <p className="text-sm font-bold text-foreground mb-3 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-primary" /> How to Earn XP
            </p>
            <ul className="space-y-2">
              {["Complete quizzes to earn XP", "Higher scores = more XP", "Try different subjects"].map((tip) => (
                <li key={tip} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <span className="text-primary mt-0.5">•</span> {tip}
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
