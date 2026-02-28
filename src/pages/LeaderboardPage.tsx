import { motion } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import LeaderboardRow from "@/components/LeaderboardRow";

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
  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-display font-bold text-foreground mb-8">Leaderboard</h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-4 max-w-2xl mx-auto space-y-1"
      >
        {leaderboard.map((entry, i) => (
          <motion.div
            key={entry.rank}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.04 }}
          >
            <LeaderboardRow {...entry} />
          </motion.div>
        ))}
      </motion.div>
    </AppLayout>
  );
};

export default LeaderboardPage;
