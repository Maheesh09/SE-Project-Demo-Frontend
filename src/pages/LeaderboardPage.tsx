import { motion } from "framer-motion";
import { Trophy, Star, Zap, TrendingUp, Brain, ChevronDown, MapPin, Medal, Globe, Map, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { useEffect, useState, useMemo } from "react";
import { useProfile } from "@/hooks/useProfile";
import { useAuth, useUser } from "@clerk/clerk-react";
import {
  api, type DashboardStats, type District, type Province,
  type DistrictLeaderboard, type ProvinceLeaderboard,
  type NationalLeaderboard, type SubjectLeaderboard,
} from "@/lib/api";
import { cn } from "@/lib/utils";

type LeaderboardTab = "district" | "province" | "national" | "subject";
type LeaderboardEntry = { rank: number; username: string | null; total_xp: number; is_current_user: boolean; };

const rankMedals: Record<number, { color: string; bg: string }> = {
  1: { color: "text-yellow-500", bg: "bg-yellow-50 dark:bg-yellow-900/20" },
  2: { color: "text-slate-400", bg: "bg-slate-50 dark:bg-slate-900/20" },
  3: { color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
};

const TAB_CONFIG: { key: LeaderboardTab; label: string; icon: typeof MapPin }[] = [
  { key: "district", label: "District", icon: MapPin },
  { key: "province", label: "Province", icon: Map },
  { key: "national", label: "National", icon: Globe },
  { key: "subject", label: "Subject", icon: BookOpen },
];

const LeaderboardList = ({ entries, showUserPosition, emptyMessage, onTakeQuiz }: {
  entries: LeaderboardEntry[]; showUserPosition: boolean; emptyMessage: string; onTakeQuiz: () => void;
}) => {
  const top10 = entries.filter((_, i) => i < 10);
  const userEntry = entries.find((e) => e.is_current_user && e.rank > 10);

  if (top10.length === 0) {
    return (
      <div className="py-14 text-center">
        <Trophy className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
        <p className="text-sm text-muted-foreground mb-4">{emptyMessage}</p>
        <button
          onClick={onTakeQuiz}
          className="inline-flex items-center gap-2 gradient-primary text-primary-foreground px-4 py-2 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity shadow-sm"
        >
          <Brain className="w-4 h-4" /> Be the first — Take a Quiz
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-1.5">
        {top10.map((entry, i) => {
          const medal = rankMedals[entry.rank];
          return (
            <motion.div
              key={`${entry.rank}-${entry.username}-${i}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.04 * i }}
              className={cn(
                "flex items-center gap-4 px-4 py-3 rounded-xl transition-colors",
                entry.is_current_user ? "bg-primary/5 border border-primary/20" : "hover:bg-muted/50"
              )}
            >
              <div className="w-8 flex justify-center flex-shrink-0">
                {medal ? (
                  <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center", medal.bg)}>
                    <Medal className={cn("w-4 h-4", medal.color)} />
                  </div>
                ) : (
                  <span className="text-sm font-semibold text-muted-foreground">#{entry.rank}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn("text-sm font-medium truncate", entry.is_current_user ? "text-primary" : "text-foreground")}>
                  {entry.username ?? "Anonymous"}
                  {entry.is_current_user && (
                    <span className="ml-2 text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">You</span>
                  )}
                </p>
              </div>
              <span className="text-sm font-semibold text-foreground flex-shrink-0">
                {entry.total_xp.toLocaleString()} <span className="text-xs text-muted-foreground">XP</span>
              </span>
            </motion.div>
          );
        })}
      </div>

      {userEntry && showUserPosition && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 border-t border-dashed border-border/50" />
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Your Position</span>
            <div className="flex-1 border-t border-dashed border-border/50" />
          </div>
          <div className="flex items-center gap-4 px-4 py-3 rounded-xl bg-primary/5 border border-primary/20">
            <div className="w-8 flex justify-center">
              <span className="text-sm font-semibold text-primary">#{userEntry.rank}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-primary truncate">
                {userEntry.username ?? "Anonymous"}
                <span className="ml-2 text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">You</span>
              </p>
            </div>
            <span className="text-sm font-semibold text-foreground flex-shrink-0">
              {userEntry.total_xp.toLocaleString()} <span className="text-xs text-muted-foreground">XP</span>
            </span>
          </div>
        </motion.div>
      )}
    </>
  );
};

const LeaderboardPage = () => {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const { getToken } = useAuth();
  const { user } = useUser();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<LeaderboardTab>("district");

  const [allDistricts, setAllDistricts] = useState<District[]>([]);
  const [selectedDistrictId, setSelectedDistrictId] = useState<number | undefined>(undefined);
  const [districtsLoading, setDistrictsLoading] = useState(true);
  const [districtLb, setDistrictLb] = useState<DistrictLeaderboard | null>(null);
  const [districtLbLoading, setDistrictLbLoading] = useState(true);

  const [allProvinces, setAllProvinces] = useState<Province[]>([]);
  const [selectedProvinceId, setSelectedProvinceId] = useState<number | undefined>(undefined);
  const [provincesLoading, setProvincesLoading] = useState(true);
  const [provinceLb, setProvinceLb] = useState<ProvinceLeaderboard | null>(null);
  const [provinceLbLoading, setProvinceLbLoading] = useState(true);

  const [nationalLb, setNationalLb] = useState<NationalLeaderboard | null>(null);
  const [nationalLbLoading, setNationalLbLoading] = useState(true);

  type SubjectOption = { id: number; name: string };
  const [allSubjects, setAllSubjects] = useState<SubjectOption[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | undefined>(undefined);
  const [subjectsLoading, setSubjectsLoading] = useState(true);
  const [subjectLb, setSubjectLb] = useState<SubjectLeaderboard | null>(null);
  const [subjectLbLoading, setSubjectLbLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [districts, provinces, subjects] = await Promise.all([
          api.getDistricts(), api.getProvinces(), api.getAvailableSubjects(),
        ]);
        setAllDistricts(districts); setAllProvinces(provinces);
        setAllSubjects(subjects.map((s: any) => ({ id: s.id, name: s.name })));
        if (subjects.length > 0) setSelectedSubjectId(subjects[0].id);
      } catch (err) { console.error(err); }
      finally { setDistrictsLoading(false); setProvincesLoading(false); setSubjectsLoading(false); }
    })();
  }, []);

  useEffect(() => {
    if (profile?.district && selectedDistrictId === undefined) setSelectedDistrictId(profile.district.id);
    if (profile?.district?.province && selectedProvinceId === undefined) setSelectedProvinceId(profile.district.province.id);
  }, [profile]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const token = await getToken(); if (!token) return;
        const email = user?.primaryEmailAddress?.emailAddress || "";
        const data = await api.getDashboardStats(token, user?.id, email);
        if (!cancelled) setStats(data);
      } catch (err) { console.error(err); }
      finally { if (!cancelled) setStatsLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [getToken, user]);

  useEffect(() => {
    if (selectedDistrictId === undefined) return;
    let cancelled = false; setDistrictLbLoading(true);
    (async () => {
      try {
        const token = await getToken(); if (!token) return;
        const email = user?.primaryEmailAddress?.emailAddress || "";
        const data = await api.getDistrictLeaderboard(token, selectedDistrictId, user?.id, email);
        if (!cancelled) setDistrictLb(data);
      } catch (err) { console.error(err); }
      finally { if (!cancelled) setDistrictLbLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [getToken, user, selectedDistrictId]);

  useEffect(() => {
    if (selectedProvinceId === undefined || activeTab !== "province") return;
    let cancelled = false; setProvinceLbLoading(true);
    (async () => {
      try {
        const token = await getToken(); if (!token) return;
        const email = user?.primaryEmailAddress?.emailAddress || "";
        const data = await api.getProvinceLeaderboard(token, selectedProvinceId, user?.id, email);
        if (!cancelled) setProvinceLb(data);
      } catch (err) { console.error(err); }
      finally { if (!cancelled) setProvinceLbLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [getToken, user, selectedProvinceId, activeTab]);

  useEffect(() => {
    if (activeTab !== "national") return;
    let cancelled = false; setNationalLbLoading(true);
    (async () => {
      try {
        const token = await getToken(); if (!token) return;
        const email = user?.primaryEmailAddress?.emailAddress || "";
        const data = await api.getNationalLeaderboard(token, user?.id, email);
        if (!cancelled) setNationalLb(data);
      } catch (err) { console.error(err); }
      finally { if (!cancelled) setNationalLbLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [getToken, user, activeTab]);

  useEffect(() => {
    if (selectedSubjectId === undefined || activeTab !== "subject") return;
    let cancelled = false; setSubjectLbLoading(true);
    (async () => {
      try {
        const token = await getToken(); if (!token) return;
        const email = user?.primaryEmailAddress?.emailAddress || "";
        const data = await api.getSubjectLeaderboard(token, selectedSubjectId, user?.id, email);
        if (!cancelled) setSubjectLb(data);
      } catch (err) { console.error(err); }
      finally { if (!cancelled) setSubjectLbLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [getToken, user, selectedSubjectId, activeTab]);

  const currentLoading = activeTab === "district" ? districtLbLoading : activeTab === "province" ? provinceLbLoading : activeTab === "subject" ? subjectLbLoading : nationalLbLoading;
  const currentEntries: LeaderboardEntry[] = useMemo(() => {
    if (activeTab === "district") return districtLb?.entries ?? [];
    if (activeTab === "province") return provinceLb?.entries ?? [];
    if (activeTab === "subject") return subjectLb?.entries ?? [];
    return nationalLb?.entries ?? [];
  }, [activeTab, districtLb, provinceLb, nationalLb, subjectLb]);

  const currentLabel =
    activeTab === "district" ? (districtLb?.district_name ?? "Select district") :
      activeTab === "province" ? (provinceLb?.province_name ?? "Select province") :
        activeTab === "subject" ? (subjectLb?.subject_name ?? "Select subject") : "Sri Lanka";

  return (
    <AppLayout>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Leaderboard</h1>
        <p className="text-sm text-muted-foreground mt-1">See how you stack up against other students</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* ── Main panel ── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="lg:col-span-2">
          <div className="bg-card border border-border/60 rounded-2xl p-5 sm:p-6">

            {/* Tab bar */}
            <div className="flex items-center gap-1 mb-5 bg-muted/40 rounded-xl p-1">
              {TAB_CONFIG.map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                      isActive ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <tab.icon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Label + filter */}
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                </p>
                <p className="text-sm font-semibold text-foreground">{currentLabel}</p>
              </div>

              {activeTab === "district" && (
                <div className="relative">
                  <select id="district-select" value={selectedDistrictId ?? ""} onChange={(e) => setSelectedDistrictId(Number(e.target.value))} disabled={districtsLoading}
                    className="appearance-none bg-card border border-border/60 text-foreground text-sm font-medium rounded-xl pl-3.5 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all cursor-pointer hover:bg-muted/40">
                    {allDistricts.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                </div>
              )}
              {activeTab === "province" && (
                <div className="relative">
                  <select id="province-select" value={selectedProvinceId ?? ""} onChange={(e) => setSelectedProvinceId(Number(e.target.value))} disabled={provincesLoading}
                    className="appearance-none bg-card border border-border/60 text-foreground text-sm font-medium rounded-xl pl-3.5 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all cursor-pointer hover:bg-muted/40">
                    {allProvinces.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                </div>
              )}
              {activeTab === "subject" && (
                <div className="relative">
                  <select id="subject-select" value={selectedSubjectId ?? ""} onChange={(e) => setSelectedSubjectId(Number(e.target.value))} disabled={subjectsLoading}
                    className="appearance-none bg-card border border-border/60 text-foreground text-sm font-medium rounded-xl pl-3.5 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all cursor-pointer hover:bg-muted/40">
                    {allSubjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                </div>
              )}
            </div>

            {currentLoading ? (
              <div className="flex items-center justify-center py-14">
                <span className="w-7 h-7 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
              </div>
            ) : (
              <LeaderboardList
                entries={currentEntries}
                showUserPosition={activeTab !== "district" || profile?.district?.id === selectedDistrictId}
                emptyMessage={`No students with XP in this ${activeTab} yet.`}
                onTakeQuiz={() => navigate("/quizzes")}
              />
            )}
          </div>
        </motion.div>

        {/* ── Right sidebar ── */}
        <div className="flex flex-col gap-4">

          {/* Your Stats */}
          <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.12 }}
            className="bg-card rounded-2xl p-5 border border-border/60">
            <p className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500" /> Your Stats
            </p>
            {statsLoading ? (
              <div className="flex items-center justify-center py-5">
                <span className="w-5 h-5 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
              </div>
            ) : (
              <div>
                {([
                  { label: "Total XP", value: stats ? stats.total_xp.toLocaleString() : "0", icon: Zap, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20" },
                  { label: "Quizzes", value: String(stats?.total_quizzes ?? 0), icon: Brain, color: "text-primary", bg: "bg-primary/10" },
                  { label: "Avg Score", value: stats?.average_score != null ? `${stats.average_score}%` : "—", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
                  { label: "Subjects", value: String(stats?.subject_stats?.length ?? 0), icon: Star, color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-900/20" },
                ] as const).map((s) => (
                  <div key={s.label} className="flex items-center justify-between py-2.5 border-b border-border/40 last:border-0">
                    <div className="flex items-center gap-2.5">
                      <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center", s.bg)}>
                        <s.icon className={cn("w-3.5 h-3.5", s.color)} />
                      </div>
                      <span className="text-sm text-muted-foreground">{s.label}</span>
                    </div>
                    <span className={cn("text-sm font-semibold", s.color)}>{s.value}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Subject progress */}
          {!statsLoading && stats && stats.subject_stats.length > 0 && (
            <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.18 }}
              className="bg-card rounded-2xl p-5 border border-border/60">
              <p className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" /> Per Subject
              </p>
              <div className="space-y-3">
                {stats.subject_stats.map((s) => (
                  <div key={s.subject_id}>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-medium text-foreground truncate">{s.subject_name}</span>
                      <span className="text-muted-foreground ml-2 flex-shrink-0">{Math.round(s.average_score)}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
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

          {/* Tips */}
          <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.22 }}
            className="bg-card rounded-2xl p-5 border border-border/60">
            <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" /> Earn More XP
            </p>
            <ul className="space-y-2">
              {["Complete quizzes to earn XP", "Higher scores = more XP", "Try different subjects"].map((tip) => (
                <li key={tip} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <span className="w-4 h-4 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5 text-primary font-bold text-[8px]">✓</span>
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
