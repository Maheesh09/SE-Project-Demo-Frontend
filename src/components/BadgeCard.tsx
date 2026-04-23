import { motion } from "framer-motion";
import { Zap, CalendarHeart, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Badge } from "@/lib/api";

interface BadgeCardProps {
  badge: Badge;
  earnedAt?: string;
  isNew?: boolean;
  className?: string;
}

export function BadgeCard({ badge, earnedAt, isNew, className }: BadgeCardProps) {
  const isEarned = !!earnedAt;

  // Format the date to something like "Apr 8, 2026"
  const formattedDate = earnedAt
    ? new Date(earnedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : null;

  return (
    <motion.div
      whileHover={{ x: 4 }}
      className={cn(
        "relative rounded-xl flex items-center gap-4 px-5 py-4 transition-all bg-[#f8f9fa] border border-border/40 shadow-sm",
        !isEarned && "opacity-60 grayscale",
        isNew && "bg-primary/5 border-primary/20",
        className
      )}
    >
      {/* Hexagon/Badge icon container */}
      <div className={cn(
        "relative w-14 h-14 flex items-center justify-center flex-shrink-0 rounded-lg overflow-hidden shrink-0",
        isEarned ? "bg-[#121212]" : "bg-muted"
      )}>
        {badge.image_url ? (
          <img
            src={badge.image_url}
            alt={badge.name}
            className="w-10 h-10 object-contain relative z-10"
            loading="lazy"
          />
        ) : (
          <Zap className={cn("w-6 h-6 relative z-10", isEarned ? "text-primary" : "text-muted-foreground")} />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-display font-bold text-[15px] text-foreground leading-tight">
          {badge.name}
        </h3>

        {isEarned ? (
          <p className="text-[11px] font-medium text-muted-foreground/80 mt-1">
            {formattedDate}
          </p>
        ) : (
          <p className="text-[11px] text-muted-foreground leading-tight mt-1 line-clamp-1">
            {badge.description}
          </p>
        )}
      </div>

      {isNew && (
        <span className="flex items-center gap-1 text-[9px] font-black uppercase text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
          <Sparkles className="w-2.5 h-2.5" /> New
        </span>
      )}
    </motion.div>
  );
}
