import { motion } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, AreaChart, Area } from "recharts";

const subjectScores = [
  { subject: "Science", score: 72 },
  { subject: "English", score: 90 },
  { subject: "Maths", score: 45 },
  { subject: "Civics", score: 30 },
  { subject: "History", score: 55 },
  { subject: "Health Sci", score: 65 },
];

const radarData = [
  { subject: "Science", value: 72 },
  { subject: "English", value: 90 },
  { subject: "Maths", value: 45 },
  { subject: "History", value: 55 },
  { subject: "Civics", value: 30 },
  { subject: "Health Sci", value: 65 },
];

const weeklyXP = [
  { week: "W1", xp: 150 },
  { week: "W2", xp: 230 },
  { week: "W3", xp: 280 },
  { week: "W4", xp: 310 },
  { week: "W5", xp: 380 },
  { week: "W6", xp: 420 },
  { week: "W7", xp: 520 },
];

const AnalyticsPage = () => {
  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-display font-bold text-foreground mb-8">Analytics</h1>
      </motion.div>

      <div className="grid grid-cols-5 gap-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="col-span-3 glass rounded-2xl p-6"
        >
          <h3 className="font-display font-bold text-foreground mb-4">Subject Scores</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={subjectScores}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 90%)" />
              <XAxis dataKey="subject" tick={{ fontSize: 12, fill: "hsl(220 10% 50%)" }} />
              <YAxis tick={{ fontSize: 12, fill: "hsl(220 10% 50%)" }} />
              <Tooltip
                contentStyle={{
                  background: "hsl(0 0% 100%)",
                  border: "1px solid hsl(220 15% 90%)",
                  borderRadius: "12px",
                  fontSize: "13px",
                }}
              />
              <Bar dataKey="score" fill="hsl(172 66% 40%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="col-span-2 glass rounded-2xl p-6"
        >
          <h3 className="font-display font-bold text-foreground mb-4">Skill Radar</h3>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(220 15% 90%)" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "hsl(220 10% 50%)" }} />
              <PolarRadiusAxis tick={{ fontSize: 10, fill: "hsl(220 10% 50%)" }} />
              <Radar dataKey="value" stroke="hsl(172 66% 40%)" fill="hsl(172 66% 40%)" fillOpacity={0.2} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-2xl p-6"
      >
        <h3 className="font-display font-bold text-foreground mb-4">Weekly XP Progress</h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={weeklyXP}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 90%)" />
            <XAxis dataKey="week" tick={{ fontSize: 12, fill: "hsl(220 10% 50%)" }} />
            <YAxis tick={{ fontSize: 12, fill: "hsl(220 10% 50%)" }} />
            <Tooltip
              contentStyle={{
                background: "hsl(0 0% 100%)",
                border: "1px solid hsl(220 15% 90%)",
                borderRadius: "12px",
                fontSize: "13px",
              }}
            />
            <Area type="monotone" dataKey="xp" stroke="hsl(15 85% 58%)" fill="hsl(15 85% 58%)" fillOpacity={0.1} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>
    </AppLayout>
  );
};

export default AnalyticsPage;
