import { motion, AnimatePresence } from "framer-motion";
import { Crown, Flame, MapPin, Star, TrendingUp, Zap, Globe, Clock, ArrowRight, Medal, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import BlurText from "@/components/BlurText";
import AnimatedList from "@/components/AnimatedList";
import { useState } from "react";
import { cn } from "@/lib/utils";

// ─── Data ────────────────────────────────────────────────────────────────────

type RankEntry = {
  rank: number;
  name: string;
  xp: number;
  level: number;
  streak: number;
  isYou?: boolean;
  district?: string;
  province?: string;
};

const sriLankaRank: RankEntry[] = [
  { rank: 1, name: "Amal P.", district: "Colombo", province: "Western", xp: 5800, level: 24, streak: 30 },
  { rank: 2, name: "Nethmi S.", district: "Kandy", province: "Central", xp: 5200, level: 22, streak: 18 },
  { rank: 3, name: "Kasun R.", district: "Galle", province: "Southern", xp: 4900, level: 21, streak: 25 },
  { rank: 4, name: "You", district: "Colombo", province: "Western", xp: 4600, level: 20, streak: 7, isYou: true },
  { rank: 5, name: "Dilini W.", district: "Gampaha", province: "Western", xp: 4300, level: 19, streak: 12 },
  { rank: 6, name: "Ruwan M.", district: "Matara", province: "Southern", xp: 4100, level: 18, streak: 9 },
  { rank: 7, name: "Sachini K.", district: "Kalutara", province: "Western", xp: 3900, level: 17, streak: 14 },
  { rank: 8, name: "Tharaka J.", district: "Hambantota", province: "Southern", xp: 3600, level: 16, streak: 5 },
  { rank: 9, name: "Ishani T.", district: "Colombo", province: "Western", xp: 3400, level: 15, streak: 11 },
  { rank: 10, name: "Gimhan B.", district: "Galle", province: "Southern", xp: 3200, level: 14, streak: 8 },
];

const districtData: Record<string, Record<string, RankEntry[]>> = {
  "Western": {
    "Colombo": [
      { rank: 1, name: "Amal P.", xp: 5800, level: 24, streak: 30 },
      { rank: 2, name: "You", xp: 4600, level: 20, streak: 7, isYou: true },
      { rank: 3, name: "Ishani T.", xp: 3400, level: 15, streak: 11 },
      { rank: 4, name: "Nimal S.", xp: 3100, level: 14, streak: 6 },
      { rank: 5, name: "Kavya R.", xp: 2850, level: 13, streak: 4 },
      { rank: 6, name: "Pasan D.", xp: 2600, level: 12, streak: 9 },
      { rank: 7, name: "Sithum L.", xp: 2300, level: 11, streak: 3 },
    ],
    "Gampaha": [
      { rank: 1, name: "Dilini W.", xp: 4300, level: 19, streak: 12 },
      { rank: 2, name: "Chamath K.", xp: 3800, level: 17, streak: 20 },
      { rank: 3, name: "Rasika M.", xp: 3200, level: 15, streak: 8 },
      { rank: 4, name: "Yasith P.", xp: 2900, level: 13, streak: 5 },
      { rank: 5, name: "Amali S.", xp: 2500, level: 12, streak: 7 },
      { rank: 6, name: "Rushan T.", xp: 2100, level: 10, streak: 2 },
    ],
    "Kalutara": [
      { rank: 1, name: "Sachini K.", xp: 3900, level: 17, streak: 14 },
      { rank: 2, name: "Lahiru B.", xp: 3300, level: 15, streak: 10 },
      { rank: 3, name: "Thilini M.", xp: 2800, level: 13, streak: 6 },
      { rank: 4, name: "Bimal R.", xp: 2400, level: 11, streak: 4 },
      { rank: 5, name: "Nadee S.", xp: 2000, level: 10, streak: 3 },
    ],
  },
  "Southern": {
    "Galle": [
      { rank: 1, name: "Kasun R.", xp: 4900, level: 21, streak: 25 },
      { rank: 2, name: "Gimhan B.", xp: 3200, level: 14, streak: 8 },
      { rank: 3, name: "Manela S.", xp: 2900, level: 13, streak: 15 },
      { rank: 4, name: "Udara P.", xp: 2600, level: 12, streak: 7 },
      { rank: 5, name: "Hiruni W.", xp: 2200, level: 11, streak: 5 },
      { rank: 6, name: "Sampath K.", xp: 1900, level: 9, streak: 3 },
    ],
    "Matara": [
      { rank: 1, name: "Ruwan M.", xp: 4100, level: 18, streak: 9 },
      { rank: 2, name: "Chandani S.", xp: 3500, level: 16, streak: 13 },
      { rank: 3, name: "Asitha K.", xp: 3000, level: 14, streak: 6 },
      { rank: 4, name: "Pasindu R.", xp: 2700, level: 12, streak: 8 },
      { rank: 5, name: "Thisari M.", xp: 2300, level: 11, streak: 4 },
    ],
    "Hambantota": [
      { rank: 1, name: "Tharaka J.", xp: 3600, level: 16, streak: 5 },
      { rank: 2, name: "Shanuka B.", xp: 3100, level: 14, streak: 11 },
      { rank: 3, name: "Dulani R.", xp: 2700, level: 13, streak: 7 },
      { rank: 4, name: "Mahela P.", xp: 2400, level: 11, streak: 4 },
      { rank: 5, name: "Senuri K.", xp: 2000, level: 10, streak: 2 },
    ],
  },
};

const provinces = Object.keys(districtData);
const rankMedal: Record<number, string> = {
  1: "gradient-accent text-accent-foreground",
  2: "bg-muted text-muted-foreground",
  3: "gradient-primary text-primary-foreground",
};

// ─── Build AnimatedList items from rank entries ───────────────────────────────

const buildListItems = (entries: RankEntry[]) =>
  entries.map((entry) => (
    <div
      key={entry.rank}
      className={cn(
        "flex items-center gap-4 px-3 py-2.5 rounded-xl transition-colors",
        entry.isYou && "bg-primary/8 border border-primary/20"
      )}
    >
      {/* Rank badge */}
      <div className="w-8 flex justify-center flex-shrink-0">
        {entry.rank <= 3 ? (
          <div className={cn("w-7 h-7 rounded-full flex items-center justify-center", rankMedal[entry.rank])}>
            {entry.rank === 1
              ? <Crown className="w-3.5 h-3.5" />
              : <Medal className="w-3.5 h-3.5" />}
          </div>
        ) : (
          <span className="text-sm font-bold text-muted-foreground">#{entry.rank}</span>
        )}
      </div>

      {/* Avatar */}
      <div className={cn(
        "w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0",
        entry.isYou ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground"
      )}>
        {entry.name[0]}
      </div>

      {/* Name + meta */}
      <div className="flex-1 min-w-0">
        <p className={cn("text-sm font-semibold truncate", entry.isYou ? "text-primary" : "text-foreground")}>
          {entry.name}
          {entry.isYou && <span className="text-xs font-normal text-primary/70 ml-1">(You)</span>}
        </p>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          Level {entry.level}
          {entry.district && <><MapPin className="w-3 h-3 mx-0.5" />{entry.district}</>}
          <Flame className="w-3 h-3 text-streak mx-0.5" />{entry.streak}d
        </p>
      </div>

      {/* XP + bar */}
      <div className="text-right flex-shrink-0">
        <p className="text-sm font-bold text-foreground">{entry.xp.toLocaleString()} XP</p>
        <div className="h-1.5 w-20 rounded-full bg-border overflow-hidden mt-1">
          <div
            className="h-full rounded-full gradient-primary"
            style={{ width: `${Math.min(100, (entry.xp / entries[0].xp) * 100)}%` }}
          />
        </div>
      </div>
    </div>
  ));

// ─── Podium ───────────────────────────────────────────────────────────────────

const Podium = ({ top3 }: { top3: RankEntry[] }) => (
  <div className="bg-card rounded-2xl p-6 border border-border/50 mb-4">
    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-5">Top Performers</p>
    <div className="flex items-end justify-center gap-4">
      {/* 2nd */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-col items-center gap-2">
        <div className={cn("w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold", top3[1]?.isYou ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
          {top3[1]?.name[0]}
        </div>
        <div className="bg-muted/60 rounded-xl px-3 pt-3 pb-2 text-center w-28 h-20 flex flex-col justify-end">
          <p className="text-xs font-bold text-foreground truncate">{top3[1]?.name}</p>
          <p className="text-xs text-muted-foreground">{top3[1]?.xp.toLocaleString()} XP</p>
          <p className="text-lg font-display font-black text-muted-foreground">2</p>
        </div>
      </motion.div>
      {/* 1st */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="flex flex-col items-center gap-2">
        <Crown className="w-5 h-5 text-accent" />
        <div className="w-14 h-14 rounded-full gradient-accent flex items-center justify-center text-xl font-bold text-accent-foreground">
          {top3[0]?.name[0]}
        </div>
        <div className="gradient-accent rounded-xl px-3 pt-3 pb-2 text-center w-32 h-24 flex flex-col justify-end text-accent-foreground">
          <p className="text-xs font-bold truncate">{top3[0]?.name}</p>
          <p className="text-xs opacity-80">{top3[0]?.xp.toLocaleString()} XP</p>
          <p className="text-2xl font-display font-black">1</p>
        </div>
      </motion.div>
      {/* 3rd */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="flex flex-col items-center gap-2">
        <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-lg font-bold text-primary-foreground">
          {top3[2]?.name[0]}
        </div>
        <div className="bg-primary/15 rounded-xl px-3 pt-3 pb-2 text-center w-28 h-16 flex flex-col justify-end">
          <p className="text-xs font-bold text-foreground truncate">{top3[2]?.name}</p>
          <p className="text-xs text-muted-foreground">{top3[2]?.xp.toLocaleString()} XP</p>
          <p className="text-lg font-display font-black text-primary">3</p>
        </div>
      </motion.div>
    </div>
  </div>
);

// ─── Sidebar ─────────────────────────────────────────────────────────────────

const Sidebar = ({ youEntry }: { youEntry: RankEntry | undefined }) => (
  <div className="flex flex-col gap-4">
    <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }} className="bg-card rounded-2xl p-5 border border-border/50">
      <p className="text-sm font-bold text-foreground mb-4 flex items-center gap-1.5">
        <Star className="w-4 h-4 text-xp" /> Your Stats
      </p>
      {youEntry ? ([
        { label: "Current Rank", value: `#${youEntry.rank}`, icon: Trophy, color: "text-accent" },
        { label: "Total XP", value: youEntry.xp.toLocaleString(), icon: Zap, color: "text-xp" },
        { label: "Level", value: String(youEntry.level), icon: TrendingUp, color: "text-primary" },
        { label: "Streak", value: `${youEntry.streak} days`, icon: Flame, color: "text-streak" },
      ] as const).map((s) => (
        <div key={s.label} className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
          <div className="flex items-center gap-2">
            <s.icon className={`w-3.5 h-3.5 ${s.color}`} />
            <span className="text-xs text-muted-foreground">{s.label}</span>
          </div>
          <span className={`text-sm font-bold ${s.color}`}>{s.value}</span>
        </div>
      )) : <p className="text-xs text-muted-foreground">Not ranked in this view yet.</p>}
    </motion.div>

    <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="bg-card rounded-2xl p-5 border border-border/50">
      <p className="text-sm font-bold text-foreground mb-3 flex items-center gap-1.5">
        <Trophy className="w-4 h-4 text-accent" /> Reach Rank 1
      </p>
      <p className="text-xs text-muted-foreground mb-2">
        You need <span className="text-accent font-bold">750 XP</span> more to claim the top spot.
      </p>
      <div className="h-2 rounded-full bg-border overflow-hidden mb-1">
        <div className="h-full rounded-full gradient-accent" style={{ width: "76%" }} />
      </div>
      <p className="text-xs text-muted-foreground text-right">4,600 / 5,800 XP</p>
    </motion.div>

    <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }} className="bg-card rounded-2xl p-5 border border-border/50">
      <p className="text-sm font-bold text-foreground mb-3 flex items-center gap-1.5">
        <Zap className="w-4 h-4 text-primary" /> How to Climb
      </p>
      <ul className="space-y-2">
        {["Complete daily quizzes for +50 XP", "Maintain streaks for bonus XP", "Finish a course for +200 XP"].map((tip) => (
          <li key={tip} className="flex items-start gap-2 text-xs text-muted-foreground">
            <span className="text-primary mt-0.5">•</span> {tip}
          </li>
        ))}
      </ul>
    </motion.div>

    <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="bg-card rounded-2xl p-5 border border-border/50 text-center">
      <div className="flex items-center justify-center gap-1.5 mb-1">
        <Clock className="w-3.5 h-3.5 text-muted-foreground" />
        <p className="text-xs text-muted-foreground">Resets in</p>
      </div>
      <p className="text-2xl font-display font-bold text-foreground">4d 12h 30m</p>
      <p className="text-xs text-muted-foreground mt-1">Weekly reset — keep climbing!</p>
    </motion.div>
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

const LeaderboardPage = () => {
  const [tab, setTab] = useState<"district" | "srilanka">("district");
  const [selectedProvince, setSelectedProvince] = useState("Western");
  const [selectedDistrict, setSelectedDistrict] = useState("Colombo");

  const districtEntries = districtData[selectedProvince]?.[selectedDistrict] ?? [];
  const activeEntries = tab === "district" ? districtEntries : sriLankaRank;
  const top3 = activeEntries.slice(0, 3);
  const youEntry = activeEntries.find((e) => e.isYou);

  const listItems = buildListItems(activeEntries);

  return (
    <AppLayout>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <BlurText text="Leaderboard" delay={50} animateBy="words" direction="top" className="text-3xl font-display font-bold text-foreground mb-1" />
        <p className="text-muted-foreground text-sm">Compare your ranking at the district and national level</p>
      </motion.div>

      {/* Tab switcher */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="flex gap-2 mb-6">
        {([
          { key: "district" as const, label: "District Rank", icon: MapPin },
          { key: "srilanka" as const, label: "Sri Lanka Rank", icon: Globe },
        ]).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200",
              tab === key
                ? "gradient-primary text-primary-foreground border-transparent shadow-sm"
                : "bg-card text-muted-foreground border-border/50 hover:border-primary/40 hover:text-foreground"
            )}
          >
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </motion.div>

      {/* District selectors */}
      <AnimatePresence>
        {tab === "district" && (
          <motion.div
            key="district-selectors"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <div className="bg-card border border-border/50 rounded-2xl p-4 flex flex-wrap items-center gap-4">
              <div className="flex flex-col gap-1.5">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Province</p>
                <div className="flex gap-2">
                  {provinces.map((p) => (
                    <button
                      key={p}
                      onClick={() => { setSelectedProvince(p); setSelectedDistrict(Object.keys(districtData[p])[0]); }}
                      className={cn(
                        "px-4 py-1.5 rounded-xl text-xs font-semibold border transition-all",
                        selectedProvince === p
                          ? "gradient-accent text-accent-foreground border-transparent"
                          : "bg-muted/40 text-muted-foreground border-border/50 hover:border-accent/50"
                      )}
                    >
                      {p} Province
                    </button>
                  ))}
                </div>
              </div>
              <div className="w-px h-8 bg-border/50" />
              <div className="flex flex-col gap-1.5">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">District</p>
                <div className="flex gap-2">
                  {Object.keys(districtData[selectedProvince] ?? {}).map((d) => (
                    <button
                      key={d}
                      onClick={() => setSelectedDistrict(d)}
                      className={cn(
                        "px-4 py-1.5 rounded-xl text-xs font-semibold border transition-all",
                        selectedDistrict === d
                          ? "gradient-primary text-primary-foreground border-transparent"
                          : "bg-muted/40 text-muted-foreground border-border/50 hover:border-primary/50"
                      )}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <div className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/40 rounded-xl px-3 py-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span className="font-medium">{selectedDistrict}, {selectedProvince} Province</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main layout */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab + selectedDistrict}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-3 gap-6"
        >
          {/* Left: podium + AnimatedList */}
          <div className="col-span-2 flex flex-col gap-4">
            {activeEntries.length > 0 ? (
              <>
                <Podium top3={top3} />

                {/* AnimatedList rankings */}
                <div className="glass rounded-2xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-border/40">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">All Rankings</p>
                  </div>
                  <AnimatedList
                    items={listItems}
                    onItemSelect={(_, index) => console.log("selected rank", index + 1)}
                    showGradients={true}
                    enableArrowNavigation={true}
                    displayScrollbar={true}
                  />
                </div>
              </>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-24 flex flex-col items-center justify-center text-center border-2 border-dashed border-border/50 rounded-3xl bg-muted/5 h-full">
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                  <Globe className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-display font-bold text-foreground mb-1">No leaderboard data</h3>
                <p className="text-sm text-muted-foreground max-w-sm mb-6">There are no students ranked in this district yet. Be the first to start learning and claim the top spot!</p>
                <Link
                  to="/courses"
                  className="px-6 py-2.5 gradient-primary text-primary-foreground rounded-xl text-sm font-bold shadow-sm hover:opacity-90 transition-opacity"
                >
                  Start Earning XP
                </Link>
              </motion.div>
            )}
          </div>

          {/* Right sidebar */}
          <Sidebar youEntry={youEntry} />
        </motion.div>
      </AnimatePresence>
    </AppLayout>
  );
};

export default LeaderboardPage;
