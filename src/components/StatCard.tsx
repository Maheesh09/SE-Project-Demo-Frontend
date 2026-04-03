import { motion } from "framer-motion"; //stat
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  subtitle?: string;
  subtitleTrend?: "up" | "down" | "neutral";
  colorClass?: string;
  delay?: number;
}

const StatCard = ({
  icon: Icon,
  label,
  value,
  colorClass = "text-primary",
  delay = 0,
}: StatCardProps) => {
  // Extract color name for icon bg: text-primary → bg-primary/10
  const iconBg = colorClass.replace("text-", "bg-").replace(/text-\[.+\]/, "bg-primary") + "/10";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      className="bg-card border border-border/60 rounded-xl p-3 flex items-center gap-3 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-300"
    >
      {/* Icon */}
      <div className={cn(
        "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
        colorClass,
        iconBg
      )}>
        <Icon className="w-4 h-4" />
      </div>

      {/* Value + Label */}
      <div className="min-w-0 flex-1">
        <p className="text-lg font-display font-bold text-foreground leading-tight tabular-nums">{value}</p>
        <p className="text-[10px] text-muted-foreground font-medium truncate">{label}</p>
      </div>
    </motion.div>
  );
};

export default StatCard;
