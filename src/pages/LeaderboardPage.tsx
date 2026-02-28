import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import AnimatedList from "@/components/AnimatedList";

const leaderboard = [
  { rank: 1, name: "Sarah K.", xp: 3200, level: 15 },
  { rank: 2, name: "You", xp: 2450, level: 12, isYou: true },
  { rank: 3, name: "Mike R.", xp: 2100, level: 11 },
  { rank: 4, name: "Emma L.", xp: 1950, level: 10 },
  { rank: 5, name: "James P.", xp: 1800, level: 9 },
  { rank: 6, name: "Olivia S.", xp: 1650, level: 9 },
  { rank: 7, name: "Liam D.", xp: 1500, level: 8 },
  { rank: 8, name: "Sophia W.", xp: 1350, level: 7 },
  { rank: 9, name: "Noah T.", xp: 1200, level: 7 },
  { rank: 10, name: "Ava M.", xp: 1100, level: 6 },
];

const LeaderboardPage = () => {
  const items = leaderboard.map((entry) => (
    <div className="flex items-center gap-4" key={entry.rank}>
      <div className="w-9 flex justify-center">
        {entry.rank <= 3 ? (
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            entry.rank === 1 ? 'gradient-accent' : entry.rank === 2 ? 'bg-muted' : 'gradient-primary'
          }`}>
            <Trophy className="w-4 h-4 text-primary-foreground" />
          </div>
        ) : (
          <span className="text-sm font-bold text-muted-foreground">#{entry.rank}</span>
        )}
      </div>
      <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold bg-muted text-muted-foreground">
        {entry.name[0]}
      </div>
      <div className="flex-1">
        <p className={`text-sm font-semibold ${entry.isYou ? 'text-primary' : 'text-foreground'}`}>
          {entry.name}
        </p>
        <p className="text-xs text-muted-foreground">Level {entry.level}</p>
      </div>
      <span className="text-sm font-bold text-foreground">{entry.xp.toLocaleString()} XP</span>
    </div>
  ));

  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-display font-bold text-foreground mb-8">Leaderboard</h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-4 max-w-2xl mx-auto"
      >
        <AnimatedList
          items={items}
          showGradients={true}
          enableArrowNavigation={true}
          displayScrollbar={true}
        />
      </motion.div>
    </AppLayout>
  );
};

export default LeaderboardPage;
