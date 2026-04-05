import { motion } from "framer-motion";
import { Trophy, Star, Zap, TrendingUp, Brain, ChevronDown, MapPin, Medal, Globe, Map, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import BlurText from "@/components/BlurText";
import { useEffect, useState, useMemo } from "react";
import { useProfile } from "@/hooks/useProfile";
import { useAuth, useUser } from "@clerk/clerk-react";
import {
  api,
  type DashboardStats,
  type District,
  type Province,
  type DistrictLeaderboard,
  type ProvinceLeaderboard,
  type NationalLeaderboard,
  type SubjectLeaderboard,
} from "@/lib/api";
import { cn } from "@/lib/utils";


// ─── Types ────────────────────────────────────────────────────────────────────

type LeaderboardTab = "district" | "province" | "national" | "subject";

type LeaderboardEntry = {
  rank: number;
  username: string | null;
  total_xp: number;
  is_current_user: boolean;
};


// ─── Rank badge colors ────────────────────────────────────────────────────────

const rankMedals: Record<number, { color: string; bg: string }> = {
  1: { color: "text-yellow-500", bg: "bg-yellow-500/10" },
  2: { color: "text-gray-400", bg: "bg-gray-400/10" },
  3: { color: "text-amber-600", bg: "bg-amber-600/10" },
};

const TAB_CONFIG: { key: LeaderboardTab; label: string; icon: typeof MapPin }[] = [
  { key: "district", label: "District", icon: MapPin },
  { key: "province", label: "Province", icon: Map },
  { key: "national", label: "National", icon: Globe },
  { key: "subject", label: "Subject", icon: BookOpen },
];


// ─── Reusable leaderboard list component ──────────────────────────────────────

const LeaderboardList = ({
  entries,
  showUserPosition,
  emptyMessage,
  onTakeQuiz,
}: {
  entries: LeaderboardEntry[];
  showUserPosition: boolean;
  emptyMessage: string;
  onTakeQuiz: () => void;
}) => {
  const top10 = entries.filter((_, i) => i < 10);
  const userEntry = entries.find((e) => e.is_current_user && e.rank > 10);

  if (top10.length === 0) {
    return (
      <div className="py-16 text-center">
        <Trophy className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
        <button
          onClick={onTakeQuiz}
          className="mt-4 flex items-center gap-2 gradient-primary text-primary-foreground px-5 py-2 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity shadow-sm mx-auto"
        >
          <Brain className="w-4 h-4" /> Be the first — Take a Quiz
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-2">
        {top10.map((entry, i) => {
          const medal = rankMedals[entry.rank];
          return (
            <motion.div
              key={`${entry.rank}-${entry.username}-${i}`}
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
      {userEntry && showUserPosition && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
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
  );
};


// ─── Page ─────────────────────────────────────────────────────────────────────

const LeaderboardPage = () => {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const { getToken } = useAuth();
  const { user } = useUser();

  // Stats
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Active tab
  const [activeTab, setActiveTab] = useState<LeaderboardTab>("district");

  // District data
  const [allDistricts, setAllDistricts] = useState<District[]>([]);
  const [selectedDistrictId, setSelectedDistrictId] = useState<number | undefined>(undefined);
  const [districtsLoading, setDistrictsLoading] = useState(true);
  const [districtLb, setDistrictLb] = useState<DistrictLeaderboard | null>(null);
  const [districtLbLoading, setDistrictLbLoading] = useState(true);

  // Province data
  const [allProvinces, setAllProvinces] = useState<Province[]>([]);
  const [selectedProvinceId, setSelectedProvinceId] = useState<number | undefined>(undefined);
  const [provincesLoading, setProvincesLoading] = useState(true);
  const [provinceLb, setProvinceLb] = useState<ProvinceLeaderboard | null>(null);
  const [provinceLbLoading, setProvinceLbLoading] = useState(true);

  // National data
  const [nationalLb, setNationalLb] = useState<NationalLeaderboard | null>(null);
  const [nationalLbLoading, setNationalLbLoading] = useState(true);

  // Subject data
  type SubjectOption = { id: number; name: string };
  const [allSubjects, setAllSubjects] = useState<SubjectOption[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | undefined>(undefined);
  const [subjectsLoading, setSubjectsLoading] = useState(true);
  const [subjectLb, setSubjectLb] = useState<SubjectLeaderboard | null>(null);
  const [subjectLbLoading, setSubjectLbLoading] = useState(true);

  // ── Load meta data ──
  useEffect(() => {
    (async () => {
      try {
        const [districts, provinces, subjects] = await Promise.all([
          api.getDistricts(),
          api.getProvinces(),
          api.getAvailableSubjects(),
        ]);
        setAllDistricts(districts);
        setAllProvinces(provinces);
        setAllSubjects(subjects.map((s: any) => ({ id: s.id, name: s.name })));
        // Default to first subject
        if (subjects.length > 0) {
          setSelectedSubjectId(subjects[0].id);
        }
      } catch (err) {
        console.error("Failed to load meta:", err);
      } finally {
        setDistrictsLoading(false);
        setProvincesLoading(false);
        setSubjectsLoading(false);
      }
    })();
  }, []);

  // ── Set defaults from profile ──
  useEffect(() => {
    if (profile?.district && selectedDistrictId === undefined) {
      setSelectedDistrictId(profile.district.id);
    }
    if (profile?.district?.province && selectedProvinceId === undefined) {
      setSelectedProvinceId(profile.district.province.id);
    }
  }, [profile, selectedDistrictId, selectedProvinceId]);

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

  // ── Load district leaderboard ──
  useEffect(() => {
    if (selectedDistrictId === undefined) return;
    let cancelled = false;
    setDistrictLbLoading(true);
    (async () => {
      try {
        const token = await getToken();
        if (!token) return;
        const email = user?.primaryEmailAddress?.emailAddress || "";
        const data = await api.getDistrictLeaderboard(token, selectedDistrictId, user?.id, email);
        if (!cancelled) setDistrictLb(data);
      } catch (err) {
        console.error("Failed to load district leaderboard:", err);
      } finally {
        if (!cancelled) setDistrictLbLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [getToken, user, selectedDistrictId]);

  // ── Load province leaderboard ──
  useEffect(() => {
    if (selectedProvinceId === undefined || activeTab !== "province") return;
    let cancelled = false;
    setProvinceLbLoading(true);
    (async () => {
      try {
        const token = await getToken();
        if (!token) return;
        const email = user?.primaryEmailAddress?.emailAddress || "";
        const data = await api.getProvinceLeaderboard(token, selectedProvinceId, user?.id, email);
        if (!cancelled) setProvinceLb(data);
      } catch (err) {
        console.error("Failed to load province leaderboard:", err);
      } finally {
        if (!cancelled) setProvinceLbLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [getToken, user, selectedProvinceId, activeTab]);

  // ── Load national leaderboard ──
  useEffect(() => {
    if (activeTab !== "national") return;
    let cancelled = false;
    setNationalLbLoading(true);
    (async () => {
      try {
        const token = await getToken();
        if (!token) return;
        const email = user?.primaryEmailAddress?.emailAddress || "";
        const data = await api.getNationalLeaderboard(token, user?.id, email);
        if (!cancelled) setNationalLb(data);
      } catch (err) {
        console.error("Failed to load national leaderboard:", err);
      } finally {
        if (!cancelled) setNationalLbLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [getToken, user, activeTab]);

  // ── Load subject leaderboard ──
  useEffect(() => {
    if (selectedSubjectId === undefined || activeTab !== "subject") return;
    let cancelled = false;
    setSubjectLbLoading(true);
    (async () => {
      try {
        const token = await getToken();
        if (!token) return;
        const email = user?.primaryEmailAddress?.emailAddress || "";
        const data = await api.getSubjectLeaderboard(token, selectedSubjectId, user?.id, email);
        if (!cancelled) setSubjectLb(data);
      } catch (err) {
        console.error("Failed to load subject leaderboard:", err);
      } finally {
        if (!cancelled) setSubjectLbLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [getToken, user, selectedSubjectId, activeTab]);

  // ── Derived state ──
  const isOwnDistrict = profile?.district?.id === selectedDistrictId;
  const isOwnProvince = profile?.district?.province?.id === selectedProvinceId;

  const currentLoading =
    activeTab === "district" ? districtLbLoading :
    activeTab === "province" ? provinceLbLoading :
    activeTab === "subject" ? subjectLbLoading :
    nationalLbLoading;

  const currentEntries: LeaderboardEntry[] = useMemo(() => {
    if (activeTab === "district") return districtLb?.entries ?? [];
    if (activeTab === "province") return provinceLb?.entries ?? [];
    if (activeTab === "subject") return subjectLb?.entries ?? [];
    return nationalLb?.entries ?? [];
  }, [activeTab, districtLb, provinceLb, nationalLb, subjectLb]);

  const currentShowUserPosition =
    activeTab === "district" ? isOwnDistrict :
    activeTab === "province" ? isOwnProvince :
    true; // always show for national & subject

  const currentLabel =
    activeTab === "district" ? (districtLb?.district_name ?? "Select district") :
    activeTab === "province" ? (provinceLb?.province_name ?? "Select province") :
    activeTab === "subject" ? (subjectLb?.subject_name ?? "Select subject") :
    "Sri Lanka";

  const currentEmptyMessage =
    activeTab === "district" ? "No students with XP in this district yet." :
    activeTab === "province" ? "No students with XP in this province yet." :
    activeTab === "subject" ? "No students with XP in this subject yet." :
    "No students with XP yet.";

  return (
    <AppLayout>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <BlurText text="Leaderboard" delay={50} animateBy="words" direction="top" className="text-3xl font-display font-bold text-foreground mb-1" />
        <p className="text-muted-foreground text-sm">See how you stack up against other students</p>
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

            {/* Tab bar */}
            <div className="flex items-center gap-1 mb-6 bg-muted/50 rounded-xl p-1">
              {TAB_CONFIG.map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all",
                      isActive
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Filter bar + label */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center shadow-sm">
                  {activeTab === "district" && <MapPin className="w-5 h-5 text-accent-foreground" />}
                  {activeTab === "province" && <Map className="w-5 h-5 text-accent-foreground" />}
                  {activeTab === "national" && <Globe className="w-5 h-5 text-accent-foreground" />}
                  {activeTab === "subject" && <BookOpen className="w-5 h-5 text-accent-foreground" />}
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    {activeTab === "district" ? "District" : activeTab === "province" ? "Province" : activeTab === "subject" ? "Subject" : "National"}
                  </p>
                  <p className="text-sm font-bold text-foreground">{currentLabel}</p>
                </div>
              </div>

              {/* Dropdown — district, province, or subject */}
              {activeTab === "district" && (
                <div className="relative">
                  <select
                    id="district-select"
                    value={selectedDistrictId ?? ""}
                    onChange={(e) => setSelectedDistrictId(Number(e.target.value))}
                    disabled={districtsLoading}
                    className="appearance-none bg-card border border-border/50 text-foreground text-sm font-semibold rounded-xl pl-4 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all cursor-pointer hover:bg-muted/50"
                  >
                    {allDistricts.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
              )}

              {activeTab === "province" && (
                <div className="relative">
                  <select
                    id="province-select"
                    value={selectedProvinceId ?? ""}
                    onChange={(e) => setSelectedProvinceId(Number(e.target.value))}
                    disabled={provincesLoading}
                    className="appearance-none bg-card border border-border/50 text-foreground text-sm font-semibold rounded-xl pl-4 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all cursor-pointer hover:bg-muted/50"
                  >
                    {allProvinces.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
              )}

              {activeTab === "subject" && (
                <div className="relative">
                  <select
                    id="subject-select"
                    value={selectedSubjectId ?? ""}
                    onChange={(e) => setSelectedSubjectId(Number(e.target.value))}
                    disabled={subjectsLoading}
                    className="appearance-none bg-card border border-border/50 text-foreground text-sm font-semibold rounded-xl pl-4 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all cursor-pointer hover:bg-muted/50"
                  >
                    {allSubjects.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
              )}
            </div>

            {/* Leaderboard content */}
            {currentLoading ? (
              <div className="flex items-center justify-center py-16">
                <span className="w-8 h-8 rounded-full border-3 border-primary/30 border-t-primary animate-spin" />
              </div>
            ) : (
              <LeaderboardList
                entries={currentEntries}
                showUserPosition={currentShowUserPosition}
                emptyMessage={currentEmptyMessage}
                onTakeQuiz={() => navigate("/quizzes")}
              />
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
            className="bg-card rounded-2xl p-5 border border-border/60 shadow-sm"
          >
            <p className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
              <Star className="w-4 h-4 text-xp" /> Your Stats
            </p>

            {statsLoading ? (
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
          {!statsLoading && stats && stats.subject_stats.length > 0 && (
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

          {/* How to earn XP */}
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
