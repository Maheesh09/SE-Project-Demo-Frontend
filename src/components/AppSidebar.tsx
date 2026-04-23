import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, BookOpen, Brain, Trophy,
  BarChart3, MessageCircle, Settings, LogOut, X, Sparkles, Zap,
  ChevronLeft, ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import mindupLogo from "@/assets/mindup-logo.png";
import { useState, useEffect } from "react";
import ProfileModal from "./ProfileModal";
import ThemeToggle from "./ThemeToggle";
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

interface AppSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  /** Desktop only — collapses sidebar to a 64px icon-only rail */
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const AppSidebar = ({ isOpen, onClose, isCollapsed = false, onToggleCollapse }: AppSidebarProps) => {
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
        "fixed left-0 top-0 bottom-0 bg-background border-r border-border/60 flex flex-col z-50",
        "transition-[width,transform] duration-300 ease-quint",
        // Mobile: full width drawer that slides in/out
        // Desktop: width animates between 64px (collapsed rail) and 256px (full)
        isCollapsed ? "md:w-20 w-64" : "w-64",
        isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full md:translate-x-0"
      )}>

        {/* Desktop collapse toggle — sits on the right edge */}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className={cn(
              "hidden md:flex absolute -right-3 top-8 w-6 h-6 rounded-full bg-card border border-border shadow-md",
              "items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted",
              "transition-all duration-200 ease-quint hover:scale-110 active:scale-95 z-50"
            )}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        )}

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
        <NavLink
          to="/"
          className={cn(
            "pt-6 pb-5 flex items-center gap-2.5 group transition-all duration-300 ease-quint",
            isCollapsed ? "md:px-0 md:justify-center px-5" : "px-5"
          )}
        >
          <div className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
            <img src={mindupLogo} alt="MindUp" className="w-5 h-5 rounded-lg object-contain" />
          </div>
          <span className={cn(
            "text-[15px] font-bold text-foreground tracking-tight whitespace-nowrap transition-opacity duration-200",
            isCollapsed ? "md:hidden" : "opacity-100"
          )}>
            MindUp
          </span>
        </NavLink>

        {/* ── User profile card ── (full version) */}
        <div
          onClick={() => setIsProfileOpen(true)}
          className={cn(
            "mx-3 mb-5 rounded-xl bg-muted/40 border border-border/50 cursor-pointer hover:bg-muted/60 hover:border-border transition-all duration-200 group",
            // Collapsed on desktop: just the avatar circle
            isCollapsed ? "md:p-2 md:flex md:justify-center p-3" : "p-3"
          )}
        >
          <div className={cn(
            "flex items-center gap-3",
            isCollapsed && "md:gap-0 md:justify-center"
          )}>
            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground flex-shrink-0">
              {initial}
            </div>
            <div className={cn("flex-1 min-w-0", isCollapsed && "md:hidden")}>
              <p className="text-sm font-semibold text-foreground truncate leading-tight">{fullName}</p>
              <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                {profile?.grade?.name ?? "Student"}
                {profile?.district ? ` · ${profile.district.name}` : ""}
              </p>
            </div>
            <div className={cn(
              "w-2 h-2 rounded-full bg-success flex-shrink-0",
              isCollapsed && "md:hidden"
            )} title="Online" />
          </div>

          {/* XP progress — hidden in collapsed mode */}
          <div className={cn(
            "mt-2.5 pt-2.5 border-t border-border/40",
            isCollapsed && "md:hidden"
          )}>
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
        <nav className="flex-1 px-3 overflow-y-auto smooth-scroll space-y-0.5">
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
                  title={isCollapsed ? item.label : undefined}
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
                    isCollapsed && "md:justify-center md:px-0",
                    isActive ? "" : "hover:bg-muted/50"
                  )}>
                    {/* Left accent bar — hidden when collapsed */}
                    {isActive && !isCollapsed && (
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
                      "text-sm transition-colors duration-150 whitespace-nowrap",
                      isCollapsed && "md:hidden",
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

        {/* ── Upgrade nudge — hidden in collapsed mode ── */}
        <div className={cn(
          "mx-3 mb-3 mt-2 p-3.5 rounded-xl border border-border/60 bg-card group hover:border-primary/30 hover:bg-primary/5 transition-all duration-200 cursor-pointer",
          isCollapsed && "md:hidden"
        )}>
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

        {/* ── Footer: theme toggle + sign out ── */}
        <div className={cn(
          "border-t border-border/40 pt-3 pb-5",
          // Expanded: row, both side by side
          // Collapsed: stacked vertically, centered, comfortable spacing
          isCollapsed
            ? "md:px-2 md:flex md:flex-col md:items-center md:gap-3 px-3 flex items-center gap-2"
            : "px-3 flex items-center gap-2"
        )}>
          <div className={cn("flex-shrink-0", isCollapsed && "md:flex md:justify-center md:w-full")}>
            <ThemeToggle />
          </div>
          <button
            onClick={() => navigate("/logout")}
            className={cn(
              "flex items-center rounded-xl text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-150 ease-quint",
              isCollapsed
                ? "md:w-9 md:h-9 md:justify-center md:p-0 flex-1 gap-3 px-3 py-2"
                : "flex-1 gap-3 px-3 py-2"
            )}
            title={isCollapsed ? "Sign Out" : undefined}
            aria-label="Sign Out"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <span className={cn("whitespace-nowrap", isCollapsed && "md:hidden")}>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AppSidebar;
