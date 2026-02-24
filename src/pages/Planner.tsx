import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Calendar, Sparkles } from "lucide-react";

const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const schedule = [
  { day: "Monday", subjects: ["Mathematics (2h)", "Science (1h)"] },
  { day: "Tuesday", subjects: ["English (1.5h)", "ICT (1h)"] },
  { day: "Wednesday", subjects: ["Mathematics (1.5h)", "History (1h)"] },
  { day: "Thursday", subjects: ["Science (2h)", "Sinhala (1h)"] },
  { day: "Friday", subjects: ["English (1h)", "ICT (1.5h)"] },
  { day: "Saturday", subjects: ["Mathematics (2h)", "Revision (2h)"] },
  { day: "Sunday", subjects: ["Rest / Light Review (1h)"] },
];

const Planner = () => {
  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <Calendar className="w-7 h-7 text-primary" /> Study Planner
            </h1>
            <p className="text-brown-light">Your personalized weekly study schedule</p>
          </div>
          <Button variant="default">
            <Sparkles className="w-4 h-4" /> Generate Plan
          </Button>
        </div>

        <div className="bg-card rounded-xl shadow-soft overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7">
            {schedule.map((day) => (
              <div key={day.day} className="border-b lg:border-b-0 lg:border-r border-border last:border-r-0 last:border-b-0 p-4">
                <h3 className="font-bold text-sm text-brown mb-3">{day.day}</h3>
                <div className="space-y-2">
                  {day.subjects.map((s) => (
                    <div key={s} className="bg-sage-light text-brown text-xs rounded-lg px-3 py-2 font-medium">
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Planner;
