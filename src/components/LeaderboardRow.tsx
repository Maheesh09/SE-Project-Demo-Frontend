import { cn } from "@/lib/utils";
import { Trophy } from "lucide-react";

interface LeaderboardRowProps {
  rank: number;
  name: string;
  xp: number;
  isYou?: boolean;
  level?: number;
}

const rankColors: Record<number, string> = {
  1: "text-warning",
  2: "text-muted-foreground",
  3: "text-accent",
};

const LeaderboardRow = ({ rank, name, xp, isYou, level }: LeaderboardRowProps) => (
  <div
    className={cn(
      "flex items-center gap-4 px-4 py-3 rounded-xl transition-colors",
      isYou ? "bg-primary/5 border border-primary/20" : "hover:bg-muted/50"
    )}
  >
    <div className="w-8 flex justify-center">
      {rank <= 3 ? (
        <Trophy className={cn("w-5 h-5", rankColors[rank])} />
      ) : (
        <span className="text-sm font-bold text-muted-foreground">#{rank}</span>
      )}
    </div>
    <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold bg-muted text-muted-foreground">
      {name[0]}
    </div>
    <div className="flex-1">
      <p className={cn("text-sm font-semibold", isYou ? "text-primary" : "text-foreground")}>{name}</p>
      {level && <p className="text-xs text-muted-foreground">Level {level}</p>}
    </div>
    <span className="text-sm font-bold text-foreground">{xp.toLocaleString()} XP</span>
  </div>
);

export default LeaderboardRow;
