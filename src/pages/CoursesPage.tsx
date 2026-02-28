import { motion } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import CourseCard from "@/components/CourseCard";

const courses = [
  { name: "Science", description: "Physics, Chemistry, and Biology fundamentals for curious minds.", progress: 72, completed: 17, total: 24, xp: 340, colorClass: "bg-course-science" },
  { name: "English", description: "Classic and modern literature analysis, critical thinking, and essay writing.", progress: 90, completed: 18, total: 20, xp: 520, colorClass: "bg-course-english" },
  { name: "Maths", description: "Algebra, Calculus, and Geometry fundamentals for building strong math skills.", progress: 45, completed: 8, total: 18, xp: 210, colorClass: "bg-course-maths" },
  { name: "Civics", description: "Understanding government, rights, duties, and the democratic process.", progress: 30, completed: 9, total: 30, xp: 150, colorClass: "bg-course-civics" },
  { name: "History", description: "Exploring ancient civilizations, world wars, and cultural evolution.", progress: 55, completed: 11, total: 20, xp: 280, colorClass: "bg-course-history" },
  { name: "Health Science", description: "Nutrition, anatomy, wellness, and preventive healthcare knowledge.", progress: 65, completed: 13, total: 20, xp: 310, colorClass: "bg-course-health" },
];

const CoursesPage = () => {
  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground">My Courses</h1>
          <span className="text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary">
            {courses.length} subjects
          </span>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-6">
        {courses.map((course, i) => (
          <CourseCard key={course.name} {...course} variant="full" delay={i * 0.08} />
        ))}
      </div>
    </AppLayout>
  );
};

export default CoursesPage;
