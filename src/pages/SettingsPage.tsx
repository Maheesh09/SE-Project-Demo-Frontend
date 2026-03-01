import { motion } from "framer-motion";
import { User, Bell, Shield, Moon, Monitor, Sun } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import BlurText from "@/components/BlurText";
import { BentoCardGrid, MagicCard } from "@/components/MagicCard";

const SettingsPage = () => {
  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <BlurText
          text="Settings"
          delay={50}
          animateBy="words"
          direction="top"
          className="text-3xl font-display font-bold text-foreground mb-8"
        />
      </motion.div>

      <BentoCardGrid className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Settings Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="col-span-1 space-y-1"
        >
          {['Profile', 'Notifications', 'Security', 'Appearance'].map((tab, idx) => (
            <button
              key={tab}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${idx === 0
                ? "bg-primary/10 text-primary font-bold shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
            >
              {tab}
            </button>
          ))}
        </motion.div>

        {/* Settings Content */}
        <MagicCard glowColor="178,197,157" className="col-span-3 rounded-2xl glass" enableTilt={false}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-8 h-full"
          >
            <div className="mb-6 flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-xl font-bold text-primary-foreground shadow-glow">
                U
              </div>
              <div>
                <h2 className="text-xl font-display font-bold text-foreground">User Profile</h2>
                <p className="text-sm text-muted-foreground">Manage your public information</p>
              </div>
              <button className="ml-auto px-4 py-2 bg-muted hover:bg-muted/80 text-foreground text-sm font-medium rounded-xl transition-colors">
                Change Avatar
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">First Name</label>
                  <input type="text" defaultValue="Guest" className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">Last Name</label>
                  <input type="text" defaultValue="User" className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">Email Address</label>
                <input type="email" defaultValue="student@mindup.learning" className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
              </div>

              <div className="pt-4 border-t border-border/50">
                <h3 className="text-base font-bold text-foreground mb-4">Study Preferences</h3>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <h4 className="text-sm font-medium text-foreground">Daily Reminders</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">Receive an email to keep your learning streak.</p>
                  </div>
                  <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer shadow-sm">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-background rounded-full"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <h4 className="text-sm font-medium text-foreground">Public Leaderboard</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">Allow other students to see your XP and level.</p>
                  </div>
                  <div className="w-12 h-6 bg-muted rounded-full relative cursor-pointer border border-border">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-foreground/30 rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 mt-4">
                <button className="px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
                <button className="px-5 py-2.5 bg-primary text-primary-foreground text-sm font-bold rounded-xl shadow-sm hover:opacity-90 transition-opacity">Save Changes</button>
              </div>
            </div>
          </motion.div>
        </MagicCard>
      </BentoCardGrid >
    </AppLayout >
  );
};

export default SettingsPage;
