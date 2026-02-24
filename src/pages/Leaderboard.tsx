import DashboardLayout from "@/components/layout/DashboardLayout";
import { Trophy, Medal } from "lucide-react";

const leaderboardData = [
  { rank: 1, name: "Kavinda Perera", xp: 12450, level: 24, school: "Royal College" },
  { rank: 2, name: "Nethmi Fernando", xp: 11200, level: 22, school: "Visakha Vidyalaya" },
  { rank: 3, name: "Ashan Silva", xp: 10800, level: 21, school: "Ananda College" },
  { rank: 4, name: "Dinushi Jayawardena", xp: 9500, level: 19, school: "Ladies' College" },
  { rank: 5, name: "Tharindu Bandara", xp: 8900, level: 18, school: "Dharmaraja College" },
  { rank: 6, name: "Sachini Rathnayake", xp: 8400, level: 17, school: "Musaeus College" },
  { rank: 7, name: "Nisal Wickramasinghe", xp: 7800, level: 16, school: "St. Peter's College" },
  { rank: 8, name: "Hasini De Silva", xp: 7200, level: 15, school: "Holy Family Convent" },
];

const topCardStyles = [
  "ring-2 ring-primary shadow-[0_0_20px_hsl(var(--sage)/0.3)]",
  "ring-2 ring-accent shadow-[0_0_20px_hsl(var(--clay)/0.3)]",
  "ring-2 ring-secondary",
];

const Leaderboard = () => {
  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 space-y-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <Trophy className="w-7 h-7 text-accent" /> Leaderboard
          </h1>
          <p className="text-brown-light">See how you stack up against other students</p>
        </div>

        {/* Top 3 */}
        <div className="grid sm:grid-cols-3 gap-4">
          {leaderboardData.slice(0, 3).map((student, i) => (
            <div
              key={student.rank}
              className={`bg-card rounded-xl p-6 text-center ${topCardStyles[i]}`}
            >
              <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3">
                <Medal className={`w-7 h-7 ${i === 0 ? "text-primary" : i === 1 ? "text-accent" : "text-secondary"}`} />
              </div>
              <div className="text-sm font-bold text-accent mb-1">#{student.rank}</div>
              <h3 className="font-bold text-brown text-lg">{student.name}</h3>
              <p className="text-brown-light text-sm">{student.school}</p>
              <div className="mt-3 text-xl font-bold text-primary">{student.xp.toLocaleString()} XP</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl shadow-soft overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-6 py-3 text-sm font-semibold text-brown-light">Rank</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-brown-light">Student</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-brown-light hidden sm:table-cell">School</th>
                <th className="text-right px-6 py-3 text-sm font-semibold text-brown-light">XP</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((student, i) => (
                <tr key={student.rank} className={`${i % 2 === 1 ? "bg-sand/50" : ""} hover:bg-muted/50 transition-colors`}>
                  <td className="px-6 py-4">
                    <span className="bg-accent/10 text-accent text-xs font-bold px-2.5 py-1 rounded-full">
                      #{student.rank}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-brown text-sm">{student.name}</div>
                    <div className="text-xs text-brown-light">Level {student.level}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-brown-light hidden sm:table-cell">{student.school}</td>
                  <td className="px-6 py-4 text-right font-bold text-brown text-sm">{student.xp.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Leaderboard;
