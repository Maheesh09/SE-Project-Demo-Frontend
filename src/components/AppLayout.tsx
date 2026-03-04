import { useState } from "react";
import AppSidebar from "./AppSidebar";
import { Menu } from "lucide-react";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen relative overflow-hidden bg-background flex flex-col md:block">
      {/* Subtle static background pattern instead of the glowing animation */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />

      {/* Mobile Top Navigation */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-border/10 bg-background/80 backdrop-blur-md relative z-30">
        <div className="flex items-center gap-2">
          <span className="font-display font-bold text-xl tracking-tight text-foreground">MindUp</span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 -mr-2 text-foreground hover:bg-muted/50 rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <AppSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area */}
      <main className="md:ml-64 p-4 sm:p-6 md:p-8 relative z-10 pointer-events-auto overflow-x-hidden md:overflow-visible min-h-screen">
        {children}
      </main>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AppLayout;
