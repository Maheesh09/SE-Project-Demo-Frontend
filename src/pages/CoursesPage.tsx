import { motion } from "framer-motion";
import { Star } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import BlurText from "@/components/BlurText";
import ScrollStack, { ScrollStackItem } from "@/components/ScrollStack";

const courses = [
  { name: "Science", description: "Physics, Chemistry, and Biology fundamentals for curious minds.", progress: 72, completed: 17, total: 24, xp: 340 },
  { name: "English", description: "Classic and modern literature analysis, critical thinking, and essay writing.", progress: 90, completed: 18, total: 20, xp: 520 },
  { name: "Maths", description: "Algebra, Calculus, and Geometry fundamentals for building strong math skills.", progress: 45, completed: 8, total: 18, xp: 210 },
  { name: "Civics", description: "Understanding government, rights, duties, and the democratic process.", progress: 30, completed: 9, total: 30, xp: 150 },
  { name: "History", description: "Exploring ancient civilizations, world wars, and cultural evolution.", progress: 55, completed: 11, total: 20, xp: 280 },
  { name: "Health Science", description: "Nutrition, anatomy, wellness, and preventive healthcare knowledge.", progress: 65, completed: 13, total: 20, xp: 310 },
];

const courseColors = [
  "from-primary to-success",
  "from-accent to-warning",
  "from-warning to-accent",
  "from-success to-primary",
  "from-accent to-destructive",
  "from-success to-warning",
];

const CoursesPage = () => {
  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-4">
          <BlurText
            text="My Courses"
            delay={50}
            animateBy="words"
            direction="top"
            className="text-3xl font-display font-bold text-foreground"
          />
          <span className="text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary">
            {courses.length} subjects
          </span>
        </div>
        <p className="text-muted-foreground mb-2">Scroll down to explore your courses</p>
      </motion.div>

      <div className="max-w-2xl mx-auto" style={{ height: "calc(100vh - 160px)" }}>
        <ScrollStack itemDistance={80} baseScale={0.88} itemStackDistance={25}>
          {courses.map((course, i) => (
            <ScrollStackItem key={course.name}>
              <div className={`h-full bg-gradient-to-br ${courseColors[i]} rounded-3xl p-8 text-primary-foreground`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-display font-bold">{course.name}</h2>
                    <p className="text-sm opacity-90 mt-1 max-w-md">{course.description}</p>
                  </div>
                  <span className="text-sm font-bold bg-primary-foreground/20 backdrop-blur-sm px-3 py-1 rounded-full">
                    {course.completed}/{course.total}
                  </span>
                </div>

                <div className="mt-6">
                  <div className="flex justify-between text-sm mb-2 opacity-90">
                    <span>{course.progress}% complete</span>
                    <span className="flex items-center gap-1"><Star className="w-4 h-4" /> {course.xp} XP</span>
                  </div>
                  <div className="h-3 rounded-full bg-primary-foreground/20 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary-foreground/80 transition-all duration-1000"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>

                <button className="mt-6 px-6 py-2.5 bg-primary-foreground/20 backdrop-blur-sm rounded-xl text-sm font-semibold hover:bg-primary-foreground/30 transition-colors">
                  Continue Learning
                </button>
              </div>
            </ScrollStackItem>
          ))}
        </ScrollStack>
      </div>
    </AppLayout>
  );
};

export default CoursesPage;
