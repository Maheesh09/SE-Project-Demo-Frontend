import DashboardLayout from "@/components/layout/DashboardLayout";
import { BarChart3 } from "lucide-react";

const weakAreas = ["Trigonometry", "Organic Chemistry", "Essay Writing", "Binary Systems"];

const ExamReadiness = () => {
  const readiness = 68;

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 space-y-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <BarChart3 className="w-7 h-7 text-primary" /> Exam Readiness
          </h1>
          <p className="text-brown-light">See how prepared you are for upcoming exams</p>
        </div>

        {/* Circular progress */}
        <div className="bg-card rounded-xl shadow-soft p-10 flex flex-col items-center">
          <div className="relative w-48 h-48 mb-6">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--sand-dark))" strokeWidth="8" />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="hsl(var(--sage))"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${readiness * 2.64} 264`}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl font-bold text-brown">{readiness}%</span>
            </div>
          </div>
          <p className="text-brown-light text-lg">
            {readiness >= 80 ? "You're well prepared!" : readiness >= 50 ? "Good progress — keep going!" : "Focus on weak areas below"}
          </p>
        </div>

        {/* Weak areas */}
        <div className="bg-card rounded-xl shadow-soft p-6">
          <h2 className="text-lg font-bold mb-4">Areas to Improve</h2>
          <div className="flex flex-wrap gap-3">
            {weakAreas.map((area) => (
              <span key={area} className="bg-accent/10 text-accent text-sm font-semibold px-4 py-2 rounded-full">
                {area}
              </span>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ExamReadiness;
