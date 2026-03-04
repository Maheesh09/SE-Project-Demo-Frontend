import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface CourseCardProps {
  name: string;
  progress: number;
  completed: number;
  total: number;
  xp: number;
  colorClass: string;
  description?: string;
  delay?: number;
  variant?: "compact" | "full";
}

const CourseCard = ({ name, progress, completed, total, xp, colorClass, description, delay = 0, variant = "compact" }: CourseCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className={cn(
      "glass glass-hover rounded-2xl overflow-hidden cursor-pointer group",
      variant === "full" ? "p-6" : "p-4"
    )}
  >
    {/* Top color accent bar */}
    <div className={cn("h-1 -mx-6 -mt-6 mb-4", variant === "compact" && "-mx-4 -mt-4 mb-3", colorClass)} />

    <div className="flex items-start justify-between">
      <div>
        <h3 className={cn("font-display font-bold text-foreground", variant === "full" ? "text-lg" : "text-sm")}>
          {name}
        </h3>
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      </div>
      <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
        {completed}/{total}
      </span>
    </div>

    {/* Progress bar */}
    <div className="mt-4">
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ delay: delay + 0.2, duration: 0.8, ease: "easeOut" }}
          className={cn("h-full rounded-full", colorClass)}
        />
      </div>
    </div>

    <div className="mt-3 flex items-center justify-between">
      <span className="text-xs text-muted-foreground">{progress}% complete</span>
      <span className="flex items-center gap-1 text-xs font-medium text-xp">
        <Star className="w-3.5 h-3.5" />
        {xp} XP
      </span>
    </div>
  </motion.div>
);

export default CourseCard;
