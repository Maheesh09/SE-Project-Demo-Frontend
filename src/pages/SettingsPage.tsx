import { motion } from "framer-motion";
import AppLayout from "@/components/AppLayout";

const SettingsPage = () => {
  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-display font-bold text-foreground mb-8">Settings</h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-8 max-w-2xl"
      >
        <p className="text-muted-foreground">
          Settings page coming soon. Manage your profile, notifications, and preferences here.
        </p>
      </motion.div>
    </AppLayout>
  );
};

export default SettingsPage;
