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

  // Extract color name for icon bg: text-primary → bg-primary/10
  const iconBg = colorClass.replace("text-", "bg-").replace(/text-\[.+\]/, "bg-primary") + "/10";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="bg-card border border-border/60 rounded-2xl p-4 sm:p-5 flex flex-col gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
    >
      <div className="flex items-start justify-between gap-2">
        <div className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
          colorClass,
          iconBg
        )}>
          <Icon className="w-5 h-5" />
        </div>
        {subtitle && (
          <span className={cn("inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full max-w-[52%] text-right", trendColor)}>
            <TrendIcon className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{subtitle}</span>
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl sm:text-3xl font-display font-bold text-foreground leading-tight">{value}</p>
        <p className="text-xs text-muted-foreground mt-0.5 font-medium">{label}</p>
      </div>
    </motion.div>
  );
};

export default StatCard;
