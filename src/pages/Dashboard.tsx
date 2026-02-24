import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Flame, Star, BookCheck, Clock, ArrowRight } from "lucide-react";

const subjects = [
  { name: "Mathematics", progress: 72, icon: "📐" },
  { name: "Science", progress: 58, icon: "🔬" },
  { name: "English", progress: 85, icon: "📖" },
  { name: "History", progress: 40, icon: "🏛️" },
  { name: "ICT", progress: 63, icon: "💻" },
  { name: "Sinhala", progress: 50, icon: "📝" },
];

const stats = [
  { label: "XP Earned", value: "2,450", icon: Star, color: "text-accent" },
  { label: "Streak", value: "7 days", icon: Flame, color: "text-accent" },
  { label: "Quizzes Done", value: "34", icon: BookCheck, color: "text-primary" },
  { label: "Study Hours", value: "48h", icon: Clock, color: "text-primary" },
];

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 space-y-8">
        {/* Welcome Banner */}
        <div className="gradient-sage rounded-2xl p-8 text-primary-foreground">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary-foreground mb-2">Welcome back! 👋</h1>
          <p className="text-primary-foreground/80 text-lg">Ready to level up today?</p>
          
          {/* XP Progress */}
          <div className="mt-6 max-w-md">
            <div className="flex justify-between text-sm mb-2 text-primary-foreground/90">
              <span>Level 12</span>
              <span>2,450 / 3,000 XP</span>
            </div>
            <div className="h-3 bg-primary-foreground/20 rounded-full overflow-hidden">
              <div className="h-full bg-primary-foreground rounded-full transition-all duration-500" style={{ width: "82%" }} />
            </div>
          </div>

          {/* Level badge */}
          <div className="mt-4 inline-flex items-center gap-2 bg-accent rounded-full px-4 py-1.5">
            <Star className="w-4 h-4 text-accent-foreground" />
            <span className="text-sm font-semibold text-accent-foreground">Level 12 Scholar</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-card rounded-xl p-5 shadow-soft">
              <div className="flex items-center gap-3 mb-2">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                <span className="text-sm text-brown-light font-medium">{stat.label}</span>
              </div>
              <p className="text-2xl font-bold text-brown">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Subject Cards */}
        <div>
          <h2 className="text-xl font-bold mb-4">Your Subjects</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((subject) => (
              <div
                key={subject.name}
                className="bg-card rounded-xl p-5 shadow-soft hover:shadow-card transition-all duration-200 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{subject.icon}</span>
                    <h3 className="font-bold text-brown">{subject.name}</h3>
                  </div>
                  <span className="text-sm font-semibold text-accent">{subject.progress}%</span>
                </div>

                <div className="h-2 bg-sand-dark rounded-full overflow-hidden mb-4">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${subject.progress}%` }}
                  />
                </div>

                <Button variant="default" size="sm" className="w-full" asChild>
                  <Link to={`/subject/${subject.name.toLowerCase()}`}>
                    Enter
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
