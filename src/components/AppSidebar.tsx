import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, BookOpen, Brain, Trophy,
  BarChart3, MessageCircle, Settings, LogOut, X, Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import mindupLogo from "@/assets/mindup-logo.png";
import { useState, useEffect } from "react";
import ProfileModal from "./ProfileModal";
import { useUser, useAuth } from "@clerk/clerk-react";
import { useProfile } from "@/hooks/useProfile";
import { useStreakBadge } from "@/hooks/useStreakBadge";
import { api } from "@/lib/api";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/courses", icon: BookOpen, label: "My Courses" },
  { to: "/quizzes", icon: Brain, label: "Quizzes" },
  { to: "/leaderboard", icon: Trophy, label: "Leaderboard" },
  { to: "/analytics", icon: BarChart3, label: "Analytics" },
  { to: "/chatbot", icon: MessageCircle, label: "AI Tutor" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

// Divider after index 2 (after Quizzes) and after index 4 (after Analytics)
const DIVIDER_AFTER = [2, 4];

const AppSidebar = ({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user } = useUser();
  const { profile } = useProfile();
  const { badges, newlyEarned, streakBadge, streak } = useStreakBadge();
  const [stats, setStats] = useState<any>(null);
  const { getToken } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        if (!token) return;
        const s = await api.getDashboardStats(token, user?.id, user?.primaryEmailAddress?.emailAddress);
        setStats(s);
      } catch { /* ignore */ }
    })();
  }, [getToken, user]);

  useEffect(() => {
    if (onClose) onClose();
  }, [location.pathname]);

  const displayName = user?.firstName || user?.username || "User";
  const fullName = profile?.full_name || displayName;
  const initial = (fullName && typeof fullName === "string" && fullName.length > 0) ? fullName[0].toUpperCase() : "U";

  const currentXP = stats?.total_xp ?? 0;
  const levelXP = 5000; // Placeholder for level logic
  const xpProgress = Math.min(Math.round((currentXP / levelXP) * 100), 100);
  const currentStreak = streak?.current_streak ?? 0;

  return (
    <>
      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />

      <aside className={cn(
        "fixed left-0 top-0 bottom-0 w-64 bg-background border-r border-border/60 flex flex-col z-50 transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full md:translate-x-0"
      )}>

        {/* Mobile close */}
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden absolute top-4 right-3 p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors z-50"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* ── Brand ── */}
        <NavLink to="/" className="px-5 pt-6 pb-5 flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
            <img src={mindupLogo} alt="MindUp" className="w-5 h-5 rounded-lg object-contain" />
          </div>
          <span className="text-[15px] font-bold text-foreground tracking-tight">MindUp</span>
        </NavLink>

        {/* ── User profile card ── */}
        <div
          onClick={() => setIsProfileOpen(true)}
          className="mx-3 mb-5 p-3 rounded-xl bg-muted/40 border border-border/50 cursor-pointer hover:bg-muted/60 hover:border-border transition-all duration-200 group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground flex-shrink-0">
              {initial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate leading-tight">{fullName}</p>
              <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                {profile?.grade?.name ?? "Student"}
                {profile?.district ? ` · ${profile.district.name}` : ""}
              </p>
            </div>
            <div className="w-2 h-2 rounded-full bg-success flex-shrink-0" title="Online" />
          </div>

          {/* XP progress */}
          <div className="mt-2.5 pt-2.5 border-t border-border/40">
            <div className="flex justify-between text-[10px] text-muted-foreground mb-1.5 font-medium">
              <span>{currentXP.toLocaleString()} XP earned</span>
              <span className="text-foreground font-bold">{xpProgress}% to next goal</span>
            </div>
            <div className="h-1.5 rounded-full bg-border/60 overflow-hidden">
              <div className="h-full rounded-full gradient-primary transition-all duration-700" style={{ width: `${xpProgress}%` }} />
            </div>
            <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-streak font-semibold">
              <Zap className={cn("w-3 h-3", currentStreak > 0 ? "animate-pulse" : "opacity-30")} />
              <span>{currentStreak}-day streak</span>
            </div>
          </div>
        </div>

        {/* ── Navigation ── */}
        <nav className="flex-1 px-3 overflow-y-auto space-y-0.5">
          {navItems.map((item, idx) => {
            const isActive = location.pathname === item.to;
            return (
              <div key={item.to}>
                {DIVIDER_AFTER.includes(idx - 1) && (
                  <div className="my-2 border-t border-border/50" />
                )}
                <NavLink
                  to={item.to}
                  className="group relative block"
                >
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-active-bg"
                        className="absolute inset-0 rounded-xl bg-primary/10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </AnimatePresence>

                  <div className={cn(
                    "relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150",
                    isActive ? "" : "hover:bg-muted/50"
                  )}>
                    {/* Left accent bar */}
                    {isActive && (
                      <motion.div
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        className="absolute left-0 top-2.5 bottom-2.5 w-[3px] rounded-r-full bg-primary"
                      />
                    )}

                    <div className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-150",
                      isActive
                        ? "bg-primary/20"
                        : "bg-transparent group-hover:bg-muted"
                    )}>
                      <item.icon className={cn(
                        "w-4 h-4 transition-colors duration-150",
                        isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                      )} />
                    </div>

                    <span className={cn(
                      "text-sm transition-colors duration-150",
                      isActive ? "text-foreground font-semibold" : "text-muted-foreground font-medium group-hover:text-foreground"
                    )}>
                      {item.label}
                    </span>
                  </div>
                </NavLink>
              </div>
            );
          })}
        </nav>

        {/* ── Upgrade nudge ── */}
        <div className="mx-3 mb-3 mt-2 p-3.5 rounded-xl border border-border/60 bg-card group hover:border-primary/30 hover:bg-primary/5 transition-all duration-200 cursor-pointer">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-primary flex-shrink-0" />
            <p className="text-xs font-semibold text-foreground">MindUp Pro</p>
          </div>
          <p className="text-[10px] text-muted-foreground leading-relaxed mb-2.5">
            Unlock all courses, AI tutors & study plans.
          </p>
          <button className="w-full py-1.5 text-[11px] font-bold rounded-lg border border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200">
            Upgrade Now
          </button>
        </div>

        {/* ── Sign out ── */}
        <div className="px-3 pb-5 border-t border-border/40 pt-3">
          <button
            onClick={() => navigate("/logout")}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:bg-destructive/8 hover:text-destructive transition-all duration-150"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default AppSidebar;
