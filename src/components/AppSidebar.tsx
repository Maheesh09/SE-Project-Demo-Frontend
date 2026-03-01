import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, BookOpen, Brain, Trophy, BarChart3, MessageCircle, Settings, Zap, LogOut } from "lucide-react";
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
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
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
            <div className="h-full rounded-full bg-primary" style={{ width: "82%" }} />
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
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm font-semibold"
                  : "text-sidebar-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="mx-4 mt-auto mb-4 p-4 rounded-xl bg-gradient-to-br from-sidebar-accent to-sidebar-background border border-sidebar-border shadow-sm flex flex-col items-start gap-2 relative overflow-hidden">
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/20 blur-2xl rounded-full pointer-events-none"></div>
        <div className="flex items-center gap-2 text-primary">
          <Zap className="w-5 h-5" />
          <h4 className="font-display font-bold text-sm text-sidebar-accent-foreground">MindUp Pro</h4>
        </div>
        <p className="text-xs text-sidebar-foreground">Unlock all courses, AI tutors, and custom study plans.</p>
        <button className="mt-2 w-full py-2 bg-primary text-primary-foreground font-bold text-xs rounded-lg hover:opacity-90 transition-opacity">
          Upgrade Now
        </button>
      </div>

      <div className="px-4 py-3 mt-auto mb-2">
        <NavLink
          to="/logout"
          className={cn(
            "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
            location.pathname === "/logout"
              ? "bg-destructive/10 text-destructive font-semibold shadow-sm"
              : "text-sidebar-foreground hover:bg-destructive/5 hover:text-destructive"
          )}
        >
          <LogOut className="w-5 h-5" />
          Log Out
        </NavLink>
      </div>
    </aside>
  );
};

export default AppSidebar;
