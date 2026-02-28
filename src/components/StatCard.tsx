import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  subtitle?: string;
  colorClass?: string;
  delay?: number;
}

const StatCard = ({ icon: Icon, label, value, subtitle, colorClass = "text-primary", delay = 0 }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="glass glass-hover rounded-2xl p-5"
  >
    <div className="flex items-start justify-between">
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center bg-current/10", colorClass)}>
        <Icon className="w-5 h-5" />
      </div>
      {subtitle && (
        <span className="text-xs font-medium px-2 py-1 rounded-full bg-success/10 text-success">
          {subtitle}
        </span>
      )}
    </div>
    <p className="mt-4 text-2xl font-display font-bold text-foreground">{value}</p>
    <p className="text-sm text-muted-foreground">{label}</p>
  </motion.div>
);

export default StatCard;
