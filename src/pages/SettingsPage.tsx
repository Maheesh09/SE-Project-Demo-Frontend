import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Bell, Shield, Palette, Layout, Book, Image as ImageIcon, Flame, CheckCircle2, Monitor, Moon, Sun, MonitorSmartphone, KeySquare, ToggleRight, Sparkles, LogOut } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import BlurText from "@/components/BlurText";
import { cn } from "@/lib/utils";

type Tab = "profile" | "preferences" | "security" | "subscription";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const [notifs, setNotifs] = useState({ daily: true, streaks: true, marketing: false });

  // ─── Sidebar Nav ───
  const tabs = [
    { id: "profile" as const, label: "Profile", icon: User },
    { id: "preferences" as const, label: "Preferences", icon: Layout },
    { id: "security" as const, label: "Security", icon: Shield },
    { id: "subscription" as const, label: "Subscription", icon: Sparkles },
  ];

  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <BlurText text="Settings" delay={50} animateBy="words" direction="top" className="text-3xl font-display font-bold text-foreground" />
        <p className="text-sm text-muted-foreground mt-1">Manage your account, preferences, and subscription.</p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-8 min-h-[60vh]">

        {/* ── Sidebar ── */}
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} className="w-full lg:w-64 flex-shrink-0">
          <div className="flex flex-col gap-1.5 p-2 bg-card border border-border/50 rounded-2xl shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 text-left",
                  activeTab === tab.id
                    ? "bg-primary/10 text-primary shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <tab.icon className={cn("w-4.5 h-4.5", activeTab === tab.id ? "text-primary" : "text-muted-foreground opacity-80")} />
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── Content Area ── */}
        <div className="flex-1">
          <AnimatePresence mode="wait">

            {/* ── PROFILE TAB ── */}
            {activeTab === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
                className="bg-card border border-border/50 rounded-3xl p-6 lg:p-8 shadow-sm flex flex-col gap-8"
              >
                {/* Header & Avatar */}
                <div className="flex flex-col md:flex-row gap-6 md:items-center">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center text-3xl font-bold text-primary-foreground shadow-glow">
                      U
                    </div>
                    <button className="absolute bottom-0 right-0 w-7 h-7 bg-background border border-border hover:bg-muted rounded-full flex items-center justify-center text-foreground transition-colors shadow-sm">
                      <ImageIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div>
                    <h2 className="text-xl font-display font-bold text-foreground">Profile Picture</h2>
                    <p className="text-sm text-muted-foreground">PNG, JPG or GIF up to 5MB. Recommended 256x256.</p>
                  </div>
                  <div className="md:ml-auto flex gap-3">
                    <button className="px-4 py-2 text-sm font-semibold text-destructive bg-destructive/10 hover:bg-destructive/15 rounded-xl transition-colors">Remove</button>
                  </div>
                </div>

                <hr className="border-border/40" />

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">First Name</label>
                    <input type="text" defaultValue="Demo" className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Last Name</label>
                    <input type="text" defaultValue="User" className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Email Address</label>
                    <input type="email" defaultValue="user@mindup.lk" className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Bio (Optional)</label>
                    <textarea rows={3} placeholder="I'm a grade 10 student studying for O/Ls..." className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none" />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button className="px-6 py-2.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Discard</button>
                  <button className="px-6 py-2.5 text-sm font-bold text-primary-foreground gradient-primary rounded-xl shadow-sm hover:opacity-90 transition-opacity">Save Changes</button>
                </div>
              </motion.div>
            )}

            {/* ── PREFERENCES TAB ── */}
            {activeTab === "preferences" && (
              <motion.div
                key="preferences"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
                className="flex flex-col gap-6"
              >
                {/* Theme logic */}
                <div className="bg-card border border-border/50 rounded-3xl p-6 lg:p-8 shadow-sm">
                  <h2 className="text-lg font-display font-bold text-foreground mb-4">Appearance</h2>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { id: "light", icon: Sun },
                      { id: "dark", icon: Moon },
                      { id: "system", icon: MonitorSmartphone },
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setTheme(t.id as any)}
                        className={cn(
                          "flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all",
                          theme === t.id ? "bg-primary/5 border-primary shadow-sm" : "bg-muted/30 border-border/50 hover:border-primary/50 text-muted-foreground"
                        )}
                      >
                        <t.icon className={cn("w-6 h-6", theme === t.id ? "text-primary" : "opacity-80")} />
                        <span className={cn("text-xs font-semibold capitalize", theme === t.id && "text-primary")}>{t.id} Mode</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notifications */}
                <div className="bg-card border border-border/50 rounded-3xl p-6 lg:p-8 shadow-sm">
                  <h2 className="text-lg font-display font-bold text-foreground mb-6">Email Notifications</h2>
                  <div className="flex flex-col gap-5">

                    <div className="flex items-center justify-between group cursor-pointer" onClick={() => setNotifs(n => ({ ...n, daily: !n.daily }))}>
                      <div>
                        <p className="text-sm font-semibold text-foreground flex items-center gap-2"><BookOpen className="w-4 h-4 text-primary" /> Daily Learning Reminders</p>
                        <p className="text-xs text-muted-foreground mt-1">Get an email if you haven't studied by 6 PM.</p>
                      </div>
                      <button className={cn("w-12 h-6 rounded-full relative transition-colors shadow-inner", notifs.daily ? "bg-primary" : "bg-muted")}>
                        <motion.div layout className={cn("w-4 h-4 bg-white rounded-full absolute top-1", notifs.daily ? "right-1" : "left-1")} />
                      </button>
                    </div>
                    <hr className="border-border/40" />

                    <div className="flex items-center justify-between group cursor-pointer" onClick={() => setNotifs(n => ({ ...n, streaks: !n.streaks }))}>
                      <div>
                        <p className="text-sm font-semibold text-foreground flex items-center gap-2"><Flame className="w-4 h-4 text-streak" /> Streak Protection Warnings</p>
                        <p className="text-xs text-muted-foreground mt-1">Alert me when I'm about to lose a learning streak.</p>
                      </div>
                      <button className={cn("w-12 h-6 rounded-full relative transition-colors shadow-inner", notifs.streaks ? "bg-primary" : "bg-muted")}>
                        <motion.div layout className={cn("w-4 h-4 bg-white rounded-full absolute top-1", notifs.streaks ? "right-1" : "left-1")} />
                      </button>
                    </div>

                  </div>
                </div>
              </motion.div>
            )}

            {/* ── SECURITY TAB ── */}
            {activeTab === "security" && (
              <motion.div
                key="security"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
                className="bg-card border border-border/50 rounded-3xl p-6 lg:p-8 shadow-sm flex flex-col gap-8"
              >
                <div>
                  <h2 className="text-lg font-display font-bold text-foreground mb-1">Change Password</h2>
                  <p className="text-sm text-muted-foreground mb-6">Ensure your account is using a long, random password to stay secure.</p>

                  <div className="flex flex-col gap-4 max-w-md">
                    <div>
                      <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Current Password</label>
                      <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">New Password</label>
                      <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 rounded-xl bg-muted/30 border border-border/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" />
                    </div>
                    <button className="w-fit mt-2 px-6 py-2.5 text-sm font-bold text-primary-foreground gradient-primary rounded-xl shadow-sm hover:opacity-90 transition-opacity">Update Password</button>
                  </div>
                </div>

                <hr className="border-border/40" />

                <div>
                  <h2 className="text-lg font-display font-bold text-foreground mb-1">Active Sessions</h2>
                  <p className="text-sm text-muted-foreground mb-5">These are the devices that have logged into your account.</p>

                  <div className="flex items-center justify-between p-4 border border-primary/30 bg-primary/5 rounded-2xl">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center flex-shrink-0">
                        <Monitor className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">Windows PC · Chrome</p>
                        <p className="text-xs text-muted-foreground">Colombo, Sri Lanka · Active now</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-success bg-success/10 px-2.5 py-1 rounded-full border border-success/20">This device</span>
                  </div>
                </div>

              </motion.div>
            )}

            {/* ── SUBSCRIPTION TAB ── */}
            {activeTab === "subscription" && (
              <motion.div
                key="subscription"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
                className="flex flex-col gap-6"
              >
                {/* Current Plan */}
                <div className="bg-card border border-border/50 rounded-3xl p-6 lg:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="text-2xl font-display font-bold text-foreground">MindUp Basic</h2>
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border">Free</span>
                    </div>
                    <p className="text-sm text-muted-foreground max-w-sm">You have access to 5 standard subjects, district leaderboards, and basic tracking.</p>
                  </div>
                  {/* Progress to next level / arbitrary stat */}
                  <div className="bg-muted/30 border border-border/50 rounded-2xl p-4 min-w-[200px]">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 text-center">AI Tutor Usage</p>
                    <div className="flex justify-between text-xs font-bold text-foreground mb-1">
                      <span>14 msgs</span><span>30 limit</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-border overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all w-[46%]" />
                    </div>
                  </div>
                </div>

                {/* Upgrade Banner */}
                <div className="bg-gradient-to-br from-accent to-background border border-accent/40 rounded-3xl p-8 relative overflow-hidden shadow-lg">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 blur-[80px] rounded-full pointer-events-none" />
                  <div className="relative z-10 flex flex-col gap-6 max-w-lg">
                    <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center shadow-md">
                      <Sparkles className="w-6 h-6 text-accent-foreground" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-display font-black text-foreground mb-2">Upgrade to Pro</h2>
                      <p className="text-foreground/80 leading-relaxed mb-6">
                        Unlock your full academic potential with MindUp Pro. Get unlimited AI tutoring, health science & extra subjects, national leaderboard tracking, and customized study plans.
                      </p>

                      <ul className="space-y-3 mb-8">
                        {[
                          "Unlimited AI Tutor messages (GPT-4 powered)",
                          "Access to 10+ premium subjects",
                          "Detailed strength/weakness analytics radar",
                          "Customized weekly exam schedules"
                        ].map(f => (
                          <li key={f} className="flex items-center gap-2.5 text-sm font-medium text-foreground">
                            <CheckCircle2 className="w-4.5 h-4.5 text-primary flex-shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>

                      <div className="flex items-center gap-4">
                        <button className="px-8 py-3.5 gradient-accent text-accent-foreground text-sm font-bold rounded-xl shadow-md hover:scale-105 transition-transform">
                          Upgrade for LKR 990 / mo
                        </button>
                        <p className="text-xs font-medium text-muted-foreground">Cancel anytime.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </AppLayout>
  );
}
