import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, BookOpen, Brain, Trophy,
  BarChart3, MessageCircle, Settings, Zap, LogOut, ChevronRight, X
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
  <div className="mb-4">
    <p className="px-4 mb-2 text-[10px] font-bold uppercase tracking-widest text-white/40 select-none">
      {label}
    </p>
    <div className="space-y-1 px-2">
      {items.map((item) => {
        const isActive = pathname === item.to;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className="group relative block rounded-xl overflow-hidden"
          >
            {/* Animated active pill */}
            <AnimatePresence>
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-xl bg-white shadow-lg shadow-black/10"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 28 }}
                />
              )}
            </AnimatePresence>

            <div
              className={cn(
                "relative z-10 flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200",
                isActive
                  ? ""
                  : "hover:bg-white/15"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200",
                  isActive
                    ? "bg-[#acd663]/15"
                    : "bg-white/10 group-hover:bg-white/20"
                )}>
                  <item.icon className={cn(
                    "w-[18px] h-[18px] flex-shrink-0 transition-colors duration-200",
                    isActive ? "text-[#7a9e2e]" : "text-white/70 group-hover:text-white"
                  )} />
                </div>
                <span className={cn(
                  "text-sm font-semibold transition-colors duration-200",
                  isActive ? "text-gray-800" : "text-white/80 group-hover:text-white"
                )}>
                  {item.label}
                </span>
              </div>

              {isActive && (
                <motion.div
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05, duration: 0.2 }}
                >
                  <div className="w-1.5 h-5 rounded-full bg-[#acd663]" />
                </motion.div>
              )}
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

  // Close sidebar on route change for mobile
  useEffect(() => {
    if (onClose) onClose();
  }, [location.pathname]);

  const displayName = user?.firstName || user?.username || "User";
  const initial = displayName[0]?.toUpperCase() || "U";

  return (
    <>
      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />

      <aside className={cn(
        "fixed left-0 top-0 bottom-0 w-64 gradient-sidebar flex flex-col z-50 border-r border-sidebar-border/30 transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>

        {/* Mobile close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden absolute top-5 right-4 p-1.5 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors z-50"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Logo / Brand */}
        <NavLink to="/" className="px-5 pt-6 pb-4 flex items-center gap-3 border-b border-sidebar-border/20 hover:opacity-80 transition-opacity">
          <img src={mindupLogo} alt="MindUp" className="w-9 h-9 rounded-xl shadow-sm flex-shrink-0" />
          <div>
            <span className="text-lg font-display font-bold text-sidebar-accent-foreground tracking-tight block leading-none">MindUp</span>
            <span className="text-[10px] text-sidebar-foreground/60 font-medium">Learning Platform</span>
          </div>
        </NavLink>

        {/* User profile */}
        <div
          onClick={() => setIsProfileOpen(true)}
          className="mx-3 my-4 p-3.5 rounded-xl bg-sidebar-accent/70 border border-sidebar-border/20 cursor-pointer hover:bg-sidebar-accent transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground flex-shrink-0 shadow-sm">
              {initial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-sidebar-accent-foreground truncate">{displayName}</p>
              <p className="text-[11px] text-sidebar-foreground/70">{profile?.grade?.name ?? "—"}{profile?.district ? ` · ${profile.district.name}` : ""}</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-success animate-pulse flex-shrink-0" title="Online" />
          </div>

        </div>

        {/* Navigation */}
        <nav className="flex-1 px-1 overflow-y-auto">
          <NavSection label="Learn" items={mainNav} pathname={location.pathname} />
          <NavSection label="Progress" items={progressNav} pathname={location.pathname} />
          <NavSection label="Tools" items={toolsNav} pathname={location.pathname} />
        </nav>

        {/* Upgrade banner */}
        <div className="mx-3 mb-3 p-4 rounded-xl bg-gradient-to-br from-sidebar-accent to-sidebar-background border border-sidebar-border/20 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-primary/20 blur-2xl rounded-full pointer-events-none" />
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-primary flex-shrink-0" />
            <p className="text-sm font-bold text-sidebar-accent-foreground">MindUp Pro</p>
          </div>
          <p className="text-[11px] text-sidebar-foreground/80 mb-3 leading-relaxed">
            Unlock all courses, AI tutors &amp; custom study plans.
          </p>
          <button className="w-full py-2 gradient-primary text-primary-foreground font-bold text-xs rounded-lg hover:opacity-90 transition-opacity shadow-sm">
            Upgrade Now
          </button>
        </div>

        {/* Log out */}
        <div className="px-3 pb-4 border-t border-sidebar-border/20 pt-2">
          <button
            onClick={() => navigate("/logout")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-sidebar-foreground/70 hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="w-4 h-4 flex-shrink-0 opacity-80" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default AppSidebar;
