import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, BookOpen, Brain, Trophy,
  BarChart3, MessageCircle, Settings, Zap, LogOut, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import mindupLogo from "@/assets/mindup-logo.png";
import { useState, useEffect } from "react";
import ProfileModal from "./ProfileModal";
import { useUser } from "@clerk/clerk-react";
import { useProfile } from "@/hooks/useProfile";

const mainNav = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/courses", icon: BookOpen, label: "My Courses" },
  { to: "/quizzes", icon: Brain, label: "Quizzes" },
];

const progressNav = [
  { to: "/leaderboard", icon: Trophy, label: "Leaderboard" },
  { to: "/analytics", icon: BarChart3, label: "Analytics" },
];

const toolsNav = [
  { to: "/chatbot", icon: MessageCircle, label: "AI Chatbot" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

const NavSection = ({
  label,
  items,
  pathname,
}: {
  label: string;
  items: { to: string; icon: React.ElementType; label: string }[];
  pathname: string;
}) => (
  <div className="mb-5">
    <p className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 select-none">
      {label}
    </p>
    <div className="space-y-0.5">
      {items.map((item) => {
        const isActive = pathname === item.to;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className="group relative block rounded-xl overflow-hidden"
          >
            <AnimatePresence>
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-xl bg-primary/12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </AnimatePresence>

            <div
              className={cn(
                "relative z-10 flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                isActive
                  ? ""
                  : "hover:bg-muted/50"
              )}
            >
              {/* Left accent bar for active */}
              {isActive && (
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-primary"
                />
              )}

              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 flex-shrink-0",
                isActive
                  ? "bg-primary/15"
                  : "bg-muted/60 group-hover:bg-muted"
              )}>
                <item.icon className={cn(
                  "w-[17px] h-[17px] transition-colors duration-200",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )} />
              </div>
              <span className={cn(
                "text-sm font-semibold transition-colors duration-200",
                isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
              )}>
                {item.label}
              </span>
            </div>
          </NavLink>
        );
      })}
    </div>
  </div>
);

const AppSidebar = ({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user } = useUser();
  const { profile } = useProfile();

  useEffect(() => {
    if (onClose) onClose();
  }, [location.pathname]);

  const displayName = user?.firstName || user?.username || "User";
  const initial = displayName[0]?.toUpperCase() || "U";

  return (
    <>
      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />

      <aside className={cn(
        "fixed left-0 top-0 bottom-0 w-64 bg-background border-r border-border/60 flex flex-col z-50 transition-transform duration-300 ease-in-out shadow-lg md:shadow-none",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>

        {/* Mobile close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden absolute top-5 right-4 p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors z-50"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Logo / Brand */}
        <NavLink to="/" className="px-4 pt-5 pb-4 flex items-center gap-3 border-b border-border/50 hover:opacity-80 transition-opacity">
          <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
            <img src={mindupLogo} alt="MindUp" className="w-6 h-6 rounded-lg object-contain" />
          </div>
          <div>
            <span className="text-[15px] font-display font-bold text-foreground tracking-tight block leading-none">MindUp</span>
            <span className="text-[10px] text-muted-foreground font-medium">Learning Platform</span>
          </div>
        </NavLink>

        {/* User profile card */}
        <div
          onClick={() => setIsProfileOpen(true)}
          className="mx-3 my-3 p-3 rounded-xl bg-muted/40 border border-border/50 cursor-pointer hover:bg-muted/70 hover:border-border transition-all duration-200"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground flex-shrink-0 shadow-sm">
              {initial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-foreground truncate">{displayName}</p>
              <p className="text-[11px] text-muted-foreground">
                {profile?.grade?.name ?? "—"}{profile?.district ? ` · ${profile.district.name}` : ""}
              </p>
            </div>
            <div className="w-2 h-2 rounded-full bg-success flex-shrink-0" title="Online" />
          </div>

          {/* XP progress */}
          <div className="mt-2.5 pt-2.5 border-t border-border/40">
            <div className="flex justify-between text-[10px] text-muted-foreground mb-1.5 font-medium">
              <span>2,450 / 3,000 XP</span>
              <span className="text-foreground font-bold">82%</span>
            </div>
            <div className="h-1.5 rounded-full bg-border/60 overflow-hidden">
              <div className="h-full rounded-full gradient-primary transition-all duration-700" style={{ width: "82%" }} />
            </div>
            <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-streak font-semibold">
              <Zap className="w-3 h-3" />
              <span>7-day streak</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-2 overflow-y-auto">
          <NavSection label="Learn" items={mainNav} pathname={location.pathname} />
          <NavSection label="Progress" items={progressNav} pathname={location.pathname} />
          <NavSection label="Tools" items={toolsNav} pathname={location.pathname} />
        </nav>

        {/* Upgrade banner */}
        <div className="mx-3 mb-3 p-4 rounded-xl gradient-primary relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/20 blur-2xl rounded-full pointer-events-none" />
          <div className="flex items-center gap-2 mb-1 relative z-10">
            <Zap className="w-4 h-4 text-primary-foreground/90 flex-shrink-0" />
            <p className="text-sm font-bold text-primary-foreground">MindUp Pro</p>
          </div>
          <p className="text-[11px] text-primary-foreground/80 mb-3 leading-relaxed relative z-10">
            Unlock all courses, AI tutors &amp; custom study plans.
          </p>
          <button className="w-full py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-primary-foreground font-bold text-xs rounded-lg transition-colors border border-white/30 relative z-10">
            Upgrade Now
          </button>
        </div>

        {/* Log out */}
        <div className="px-3 pb-4 border-t border-border/40 pt-2">
          <button
            onClick={() => navigate("/logout")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-muted-foreground hover:bg-destructive/8 hover:text-destructive"
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
