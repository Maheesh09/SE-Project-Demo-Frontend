import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Bell, Shield, Palette, Book, Image as ImageIcon,
  Flame, CheckCircle2, Monitor, Moon, Sun, MonitorSmartphone, Sparkles
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { cn } from "@/lib/utils";

type Tab = "profile" | "preferences" | "security" | "subscription";

const inputClass = "w-full px-4 py-2.5 rounded-xl bg-background border border-border/60 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all";
const labelClass = "block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const [notifs, setNotifs] = useState({ daily: true, streaks: true });

  const tabs = [
    { id: "profile" as const, label: "Profile", icon: User },
    { id: "preferences" as const, label: "Preferences", icon: Palette },
    { id: "security" as const, label: "Security", icon: Shield },
    { id: "subscription" as const, label: "Subscription", icon: Sparkles },
  ];

  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account, preferences, and subscription.</p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-5 min-h-[60vh]">

        {/* ── Sidebar Nav ── */}
        <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} className="w-full lg:w-52 flex-shrink-0">
          <div className="flex flex-row lg:flex-col gap-1 p-1 bg-card border border-border/60 rounded-2xl shadow-sm overflow-x-auto lg:overflow-x-visible">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2.5 w-full px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-left whitespace-nowrap flex-shrink-0 lg:flex-shrink",
                  activeTab === tab.id
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                <tab.icon className={cn("w-4 h-4 flex-shrink-0", activeTab === tab.id ? "text-primary" : "text-muted-foreground")} />
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── Content Area ── */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">

            {/* ── PROFILE ── */}
            {activeTab === "profile" && (
              <motion.div key="profile"
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}
                className="bg-card border border-border/60 rounded-2xl p-5 lg:p-7 shadow-sm flex flex-col gap-6"
              >
                {/* Avatar */}
                <div className="flex flex-col sm:flex-row gap-5 sm:items-center">
                  <div className="relative flex-shrink-0">
                    <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center text-2xl font-bold text-primary-foreground shadow-sm">
                      U
                    </div>
                    <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-card border border-border hover:bg-muted rounded-lg flex items-center justify-center transition-colors shadow-sm">
                      <ImageIcon className="w-3 h-3 text-foreground" />
                    </button>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-sm font-semibold text-foreground">Profile Picture</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">PNG, JPG or GIF up to 5MB.</p>
                  </div>
                  <button className="w-fit px-3.5 py-1.5 text-xs font-medium text-destructive bg-destructive/8 hover:bg-destructive/15 rounded-xl transition-colors border border-destructive/20">
                    Remove
                  </button>
                </div>

                <hr className="border-border/40" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div><label className={labelClass}>First Name</label><input type="text" defaultValue="Demo" className={inputClass} /></div>
                  <div><label className={labelClass}>Last Name</label><input type="text" defaultValue="User" className={inputClass} /></div>
                  <div className="md:col-span-2"><label className={labelClass}>Email Address</label><input type="email" defaultValue="user@mindup.lk" className={inputClass} /></div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>Bio (Optional)</label>
                    <textarea rows={3} placeholder="I'm a grade 10 student studying for O/Ls..." className={cn(inputClass, "resize-none")} />
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all">Discard</button>
                  <button className="px-5 py-2 text-sm font-semibold text-primary-foreground gradient-primary rounded-xl shadow-sm hover:opacity-90 transition-opacity">Save Changes</button>
                </div>
              </motion.div>
            )}

            {/* ── PREFERENCES ── */}
            {activeTab === "preferences" && (
              <motion.div key="preferences"
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}
                className="flex flex-col gap-4"
              >
                {/* Appearance */}
                <div className="bg-card border border-border/60 rounded-2xl p-5 lg:p-7 shadow-sm">
                  <h2 className="text-sm font-semibold text-foreground mb-4">Appearance</h2>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: "light", icon: Sun, label: "Light" },
                      { id: "dark", icon: Moon, label: "Dark" },
                      { id: "system", icon: MonitorSmartphone, label: "System" },
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setTheme(t.id as any)}
                        className={cn(
                          "flex flex-col items-center gap-2.5 p-4 rounded-xl border-2 transition-all",
                          theme === t.id ? "bg-primary/8 border-primary" : "bg-muted/30 border-border/60 hover:border-primary/40 text-muted-foreground"
                        )}
                      >
                        <t.icon className={cn("w-5 h-5", theme === t.id ? "text-primary" : "")} />
                        <span className={cn("text-xs font-medium", theme === t.id && "text-primary")}>{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notifications */}
                <div className="bg-card border border-border/60 rounded-2xl p-5 lg:p-7 shadow-sm">
                  <h2 className="text-sm font-semibold text-foreground mb-5">Email Notifications</h2>
                  <div className="flex flex-col gap-5">
                    {[
                      { key: "daily" as const, icon: Book, iconColor: "text-primary", label: "Daily Learning Reminders", sub: "Get an email if you haven't studied by 6 PM." },
                      { key: "streaks" as const, icon: Flame, iconColor: "text-orange-500", label: "Streak Protection Warnings", sub: "Alert me when I'm about to lose a learning streak." },
                    ].map((item, idx) => (
                      <div key={item.key}>
                        {idx > 0 && <hr className="border-border/40 mb-5" />}
                        <div className="flex items-center justify-between cursor-pointer" onClick={() => setNotifs(n => ({ ...n, [item.key]: !n[item.key] }))}>
                          <div>
                            <p className="text-sm font-medium text-foreground flex items-center gap-2">
                              <item.icon className={cn("w-4 h-4", item.iconColor)} /> {item.label}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">{item.sub}</p>
                          </div>
                          <button className={cn("w-11 h-6 rounded-full relative transition-colors shadow-inner flex-shrink-0 ml-4", notifs[item.key] ? "bg-primary" : "bg-muted border border-border/60")}>
                            <motion.div layout className={cn("w-4 h-4 bg-white rounded-full absolute top-1 shadow-sm transition-all", notifs[item.key] ? "right-1" : "left-1")} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── SECURITY ── */}
            {activeTab === "security" && (
              <motion.div key="security"
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}
                className="bg-card border border-border/60 rounded-2xl p-5 lg:p-7 shadow-sm flex flex-col gap-6"
              >
                <div>
                  <h2 className="text-sm font-semibold text-foreground mb-0.5">Change Password</h2>
                  <p className="text-xs text-muted-foreground mb-5">Ensure your account uses a long, random password to stay secure.</p>
                  <div className="flex flex-col gap-4 max-w-md">
                    <div><label className={labelClass}>Current Password</label><input type="password" placeholder="••••••••" className={inputClass} /></div>
                    <div><label className={labelClass}>New Password</label><input type="password" placeholder="••••••••" className={inputClass} /></div>
                    <button className="w-fit px-5 py-2 text-sm font-semibold text-primary-foreground gradient-primary rounded-xl shadow-sm hover:opacity-90 transition-opacity">Update Password</button>
                  </div>
                </div>
                <hr className="border-border/40" />
                <div>
                  <h2 className="text-sm font-semibold text-foreground mb-0.5">Active Sessions</h2>
                  <p className="text-xs text-muted-foreground mb-4">These are the devices logged into your account.</p>
                  <div className="flex items-center justify-between p-4 border border-primary/20 bg-primary/5 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-background border border-border/60 flex items-center justify-center flex-shrink-0">
                        <Monitor className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Windows PC · Chrome</p>
                        <p className="text-xs text-muted-foreground">Colombo, Sri Lanka · Active now</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                      This device
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── SUBSCRIPTION ── */}
            {activeTab === "subscription" && (
              <motion.div key="subscription"
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}
                className="flex flex-col gap-4"
              >
                {/* Current plan */}
                <div className="bg-card border border-border/60 rounded-2xl p-5 lg:p-7 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
                  <div>
                    <div className="flex items-center gap-2.5 mb-1">
                      <h2 className="text-lg font-semibold text-foreground">MindUp Basic</h2>
                      <span className="text-xs font-medium px-2 py-0.5 rounded-lg bg-muted text-muted-foreground border border-border/60">Free</span>
                    </div>
                    <p className="text-sm text-muted-foreground max-w-sm">5 standard subjects, district leaderboards, and basic tracking.</p>
                  </div>
                  <div className="bg-muted/30 border border-border/60 rounded-xl p-4 min-w-[190px]">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 text-center">AI Tutor Usage</p>
                    <div className="flex justify-between text-xs font-semibold text-foreground mb-1.5">
                      <span>14 msgs</span><span>30 limit</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-border/60 overflow-hidden">
                      <div className="h-full gradient-primary rounded-full w-[46%]" />
                    </div>
                  </div>
                </div>

                {/* Upgrade card */}
                <div className="gradient-primary rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-sm">
                  <div className="absolute top-0 right-0 w-56 h-56 bg-white/15 blur-[70px] rounded-full pointer-events-none" />
                  <div className="relative z-10 flex flex-col gap-5 max-w-lg">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center border border-white/25">
                      <Sparkles className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-primary-foreground mb-2">Upgrade to Pro</h2>
                      <p className="text-primary-foreground/80 leading-relaxed mb-5 text-sm">
                        Unlock unlimited AI tutoring, premium subjects, national leaderboard tracking, and customized study plans.
                      </p>
                      <ul className="space-y-2 mb-6">
                        {[
                          "Unlimited AI Tutor messages (GPT-4 powered)",
                          "Access to 10+ premium subjects",
                          "Detailed strength/weakness analytics",
                          "Customized weekly exam schedules",
                        ].map((f) => (
                          <li key={f} className="flex items-center gap-2.5 text-sm text-primary-foreground">
                            <CheckCircle2 className="w-4 h-4 text-primary-foreground/80 flex-shrink-0" /> {f}
                          </li>
                        ))}
                      </ul>
                      <div className="flex items-center gap-4">
                        <button className="px-6 py-2.5 bg-white text-foreground text-sm font-semibold rounded-xl shadow-sm hover:bg-white/90 transition-colors">
                          Upgrade — LKR 990/mo
                        </button>
                        <p className="text-xs text-primary-foreground/70">Cancel anytime.</p>
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
