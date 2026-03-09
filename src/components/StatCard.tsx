import { motion } from "framer-motion";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";
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
  subtitle,
  subtitleTrend = "up",
  colorClass = "text-primary",
  delay = 0,
}: StatCardProps) => {
  const TrendIcon =
    subtitleTrend === "up" ? TrendingUp :
      subtitleTrend === "down" ? TrendingDown : Minus;

  const trendColor =
    subtitleTrend === "up" ? "text-success bg-success/10" :
      subtitleTrend === "down" ? "text-destructive bg-destructive/10" :
        "text-muted-foreground bg-muted";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="glass glass-hover rounded-2xl p-4 sm:p-5 flex flex-col gap-4 border border-border/40"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", `bg-current/10`, colorClass)}>
          <Icon className="w-5 h-5" />
        </div>
        {subtitle && (
          <span className={cn("inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold px-2 py-1 rounded-full", trendColor)}>
            <TrendIcon className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{subtitle}</span>
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-display font-bold text-foreground leading-tight">{value}</p>
        <p className="text-xs text-muted-foreground mt-0.5 font-medium">{label}</p>
      </div>
    </motion.div>
  );
};

export default StatCard;
