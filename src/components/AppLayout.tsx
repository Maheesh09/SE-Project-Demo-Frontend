import { useState } from "react";
import AppSidebar from "./AppSidebar";
import { Menu } from "lucide-react";
import mindupLogo from "@/assets/mindup-logo.png";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen relative bg-background">
      <AppSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Mobile Top Navigation */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border/60 bg-background/95 backdrop-blur-md sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-2">
          <img src={mindupLogo} alt="" className="w-6 h-6 object-contain rounded-lg" />
          <span className="font-bold text-base tracking-tight text-foreground">MindUp</span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content Area */}
      <main className="md:ml-72 min-h-screen">
        <div className="p-4 sm:p-6 md:p-8 max-w-[1400px]">
          {children}
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AppLayout;
