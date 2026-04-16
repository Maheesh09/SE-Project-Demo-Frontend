import { motion } from "framer-motion";
import { Flame, Info, AlertCircle, RotateCcw, Trophy, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStreak } from "@/hooks/useStreak";

export default function StreakDisplay({ className }: { className?: string }) {
    const { streak, isLoading, error, refetch } = useStreak();

    if (isLoading) {
        return (
            <div className={cn("bg-card border border-border/60 rounded-xl md:rounded-2xl p-4 md:p-5 flex flex-col justify-center min-h-[140px]", className)}>
                <div className="animate-pulse flex space-x-4 items-center">
                    <div className="rounded-full bg-muted h-12 w-12"></div>
                    <div className="flex-1 space-y-2 py-1">
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                        <div className="h-3 bg-muted rounded w-5/6"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={cn("bg-card border border-red-500/20 rounded-xl md:rounded-2xl p-4 md:p-5 flex flex-col items-center justify-center text-center min-h-[140px]", className)}>
                <AlertCircle className="w-8 h-8 text-red-500/50 mb-2" />
                <p className="text-sm font-medium text-foreground mb-1">Couldn't load your streak.</p>
                <button 
                    onClick={refetch}
                    className="text-xs text-primary hover:underline flex items-center gap-1"
                >
                    <RotateCcw className="w-3 h-3" /> Tap to retry
                </button>
            </div>
        );
    }

    const { current_streak = 0, longest_streak = 0, last_activity_date = null } = streak || {};
    const isEmpty = current_streak === 0 && longest_streak === 0 && !last_activity_date;
    const isBroken = !isEmpty && current_streak === 0 && longest_streak > 0;
    const isActive = current_streak > 0;

    // A simple visual progress representing days to next 7-day milestone
    const milestoneProgress = current_streak % 7;
    const progressPercent = isActive ? ((milestoneProgress || 7) / 7) * 100 : 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn("bg-card border border-border/60 rounded-xl md:rounded-2xl p-4 md:p-5 relative overflow-hidden", className)}
        >
            {/* Background elements */}
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <Flame className="w-24 h-24 text-orange-500" />
            </div>

            <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                    <div className="flex items-center justify-between mb-1">
                        <h3 className="text-sm font-semibold flex items-center gap-1.5 text-foreground">
                            <Flame className={cn("w-4 h-4", isActive ? "text-orange-500" : "text-muted-foreground")} />
                            Study Streak
                        </h3>
                        {longest_streak > 0 && (
                            <span className="text-[10px] font-medium text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Trophy className="w-3 h-3" /> Best: {longest_streak}d
                            </span>
                        )}
                    </div>

                    {isEmpty && (
                        <div className="mt-4 flex flex-col items-start gap-1">
                            <p className="text-2xl font-bold text-muted-foreground mb-1">0 Days</p>
                            <p className="text-xs text-muted-foreground">Complete your first task to start your streak!</p>
                        </div>
                    )}

                    {isBroken && (
                        <div className="mt-4 flex flex-col items-start gap-1">
                            <div className="flex items-center gap-2">
                                <p className="text-2xl font-bold text-muted-foreground">0 Days</p>
                                <span className="bg-red-100 text-red-600 dark:bg-red-900/30 font-semibold text-[10px] px-2 py-0.5 rounded-full">Broken</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Your streak ended. Start fresh today!</p>
                        </div>
                    )}

                    {isActive && (
                        <div className="mt-4 flex flex-col items-start gap-1">
                            <div className="flex items-end gap-1">
                                <span className="text-3xl font-bold text-orange-500 leading-none">{current_streak}</span>
                                <span className="text-sm font-medium text-orange-400/80 mb-0.5">Day{current_streak !== 1 ? 's' : ''}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">You're on fire! Keep it up today.</p>
                        </div>
                    )}
                </div>

                {/* Visual Indicator (Progress to 7-day milestone) */}
                {(isActive || isBroken) && (
                    <div className="mt-5">
                        <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1.5 font-medium px-0.5">
                            <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-primary" /> Goal: Complete Today</span>
                            <span>{isActive ? (milestoneProgress || 7) : 0}/7 days milestone</span>
                        </div>
                        <div className="h-2 w-full bg-accent/50 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercent}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className={cn(
                                    "h-full rounded-full",
                                    isActive ? "bg-gradient-to-r from-orange-400 to-orange-500" : "bg-muted"
                                )}
                            />
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
