import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  BookOpen, LayoutDashboard, Trophy, StickyNote, Calendar, BarChart3,
  Settings, LogOut, ChevronLeft, ChevronRight
} from "lucide-react";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Leaderboard", url: "/leaderboard", icon: Trophy },
  { title: "Sticky Notes", url: "/notes", icon: StickyNote },
  { title: "Study Planner", url: "/planner", icon: Calendar },
  { title: "Exam Readiness", url: "/exam-readiness", icon: BarChart3 },
  { title: "Settings", url: "/settings", icon: Settings },
];

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Sidebar */}
      <aside
        className={`${
          collapsed ? "w-16" : "w-64"
        } bg-primary flex flex-col transition-all duration-300 sticky top-0 h-screen`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-4 gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary-foreground/20 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-4 h-4 text-primary-foreground" />
          </div>
          {!collapsed && <span className="text-lg font-bold text-primary-foreground">MindUp</span>}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 space-y-1 px-2">
          {navItems.map((item) => {
            const active = location.pathname === item.url;
            return (
              <Link
                key={item.url}
                to={item.url}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${
                  active
                    ? "bg-accent text-accent-foreground"
                    : "text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground"
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span>{item.title}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Collapse toggle */}
        <div className="p-2">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center py-2 rounded-lg text-primary-foreground/60 hover:text-primary-foreground hover:bg-primary-foreground/10 transition-colors"
          >
            {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        {/* Logout */}
        <div className="p-2 border-t border-primary-foreground/10">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-primary-foreground/60 hover:text-primary-foreground hover:bg-primary-foreground/10 transition-colors text-sm w-full"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>Log Out</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
