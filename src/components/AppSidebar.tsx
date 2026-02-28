import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, BookOpen, Brain, Trophy, BarChart3, MessageCircle, Settings, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import mindupLogo from "@/assets/mindup-logo.png";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/courses", icon: BookOpen, label: "My Courses" },
  { to: "/quizzes", icon: Brain, label: "Quizzes" },
  { to: "/leaderboard", icon: Trophy, label: "Leaderboard" },
  { to: "/analytics", icon: BarChart3, label: "Analytics" },
  { to: "/chatbot", icon: MessageCircle, label: "AI Chatbot" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

const AppSidebar = () => {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 gradient-sidebar flex flex-col z-50">
      {/* Logo */}
      <div className="px-6 py-5 flex items-center gap-3">
        <img src={mindupLogo} alt="MindUp" className="w-10 h-10 rounded-xl" />
        <span className="text-xl font-display font-bold text-sidebar-accent-foreground">MindUp</span>
      </div>

      {/* User Profile */}
      <div className="mx-4 mb-6 p-4 rounded-xl bg-sidebar-accent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
            U
          </div>
          <div>
            <p className="text-sm font-semibold text-sidebar-accent-foreground">User</p>
            <p className="text-xs text-sidebar-foreground">Level 12</p>
          </div>
        </div>
        <div className="mt-3">
          <div className="flex justify-between text-xs text-sidebar-foreground mb-1">
            <span>2,450 XP</span>
            <span>3,000 XP</span>
          </div>
          <div className="h-1.5 rounded-full bg-sidebar-border overflow-hidden">
            <div className="h-full rounded-full gradient-primary" style={{ width: "82%" }} />
          </div>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-xs text-streak">
          <Zap className="w-3.5 h-3.5" />
          <span>7 day streak!</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "gradient-primary text-primary-foreground shadow-glow"
                  : "text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="px-6 py-4 text-xs text-sidebar-foreground/50">
        2026 MindUp Learning
      </div>
    </aside>
  );
};

export default AppSidebar;
