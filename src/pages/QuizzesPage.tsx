import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, Target, Play, BookOpen } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import BlurText from "@/components/BlurText";
import { toast } from "sonner";

interface Topic {
  id: number;
  name: string;
}

const QuizzesPage = () => {
  const navigate = useNavigate();
  const [loadingMode, setLoadingMode] = useState<"term" | "topic" | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [chosenTopic, setChosenTopic] = useState<number | "">("");

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/v1/quiz/topics?subject_id=1");
        if (res.ok) {
          const data = await res.json();
          setTopics(data);
          if (data.length > 0) {
            setChosenTopic(data[0].id);
          }
        }
      } catch (err) {
        console.error("Failed to fetch topics:", err);
      }
    };
    fetchTopics();
  }, []);

  const startQuiz = async (mode: "term" | "topic") => {
    if (mode === "topic" && !chosenTopic) {
      toast.error("Please select a topic first.");
      return;
    }

    setLoadingMode(mode);
    try {
      // For Demo: Use mock Subject 1, Student 1.
      const payload = {
        student_id: 1,
        subject_id: 1,
        mode,
        ...(mode === "topic" && { topic_id: chosenTopic })
      };

      const res = await fetch("http://127.0.0.1:8000/api/v1/quiz/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Failed to start quiz.");
      }

      const quizData = await res.json();
      navigate("/quiz/play", { state: { quizData } });

    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to generate quiz. Is the backend running?");
    } finally {
      setLoadingMode(null);
    }
  };

  return (
    <AppLayout>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-3">
            <BlurText
              text="Adaptive Quizzes"
              delay={50}
              animateBy="words"
              direction="top"
              className="text-3xl font-display font-bold text-foreground"
            />
          </div>
        </div>
        <p className="text-muted-foreground text-sm max-w-2xl mt-2 leading-relaxed">
          Test your knowledge and track your growth with our adaptive learning engine. Questions are dynamically selected based on your historical performance, ensuring a balanced and personalized challenge every time.
        </p>
      </motion.div>

      {/* Mode Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Term Mode */}
        <div className="bg-card border border-border/50 rounded-3xl overflow-hidden hover:shadow-md transition-all duration-300">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="p-8 h-full flex flex-col"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
              <Zap className="w-7 h-7 text-primary" />
            </div>

            <h2 className="font-display font-bold text-2xl text-foreground mb-4">Term Mode</h2>

            <p className="text-sm text-muted-foreground mb-8 leading-relaxed flex-grow">
              Focuses on overall term material. The system consults your historical statistics to identify weak topics based on lower accuracy percentages, and prioritizes those areas when selecting questions. This personalizes your quiz toward areas needing the most improvement.
            </p>

            <button
              disabled={loadingMode !== null}
              onClick={() => startQuiz("term")}
              className={`w-full text-center bg-primary text-primary-foreground hover:bg-primary/90 py-3.5 rounded-xl text-sm font-bold uppercase tracking-wide transition-all duration-300 shadow-sm flex items-center justify-center gap-2 mt-auto cursor-pointer ${loadingMode === "term" ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              <Play className="w-4 h-4" /> {loadingMode === "term" ? "Generating..." : "Start Term Quiz"}
            </button>
          </motion.div>
        </div>

        {/* Topic Mode */}
        <div className="bg-card border border-border/50 rounded-3xl overflow-hidden hover:shadow-md transition-all duration-300">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="p-8 h-full flex flex-col"
          >
            <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-6">
              <Target className="w-7 h-7 text-accent" />
            </div>

            <h2 className="font-display font-bold text-2xl text-foreground mb-4">Topic Mode</h2>

            <p className="text-sm text-muted-foreground mb-4 leading-relaxed flex-grow">
              Perfect for targeted revision. All questions are strictly restricted to your selected topic to ensure focused practice. The difficulty scales automatically within this topic, ensuring exposure to new content without sudden difficulty spikes.
            </p>

            <select
              title="topic-selection"
              value={chosenTopic}
              onChange={(e) => setChosenTopic(Number(e.target.value))}
              disabled={loadingMode !== null || topics.length === 0}
              className="w-full bg-background border border-border/50 text-foreground text-sm rounded-xl px-4 py-3 mb-4 focus:ring-2 focus:ring-accent/50 outline-none transition-all"
            >
              {topics.length === 0 ? (
                <option value="">No topics available</option>
              ) : (
                topics.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))
              )}
            </select>

            <button
              disabled={loadingMode !== null}
              onClick={() => startQuiz("topic")}
              className={`w-full text-center bg-accent text-accent-foreground hover:bg-accent/90 py-3.5 rounded-xl text-sm font-bold uppercase tracking-wide transition-all duration-300 shadow-sm flex items-center justify-center gap-2 mt-auto cursor-pointer ${loadingMode === "topic" ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              <Play className="w-4 h-4" /> {loadingMode === "topic" ? "Generating..." : "Start Topic Quiz"}
            </button>
          </motion.div>
        </div>
      </div>

      {/* Info Section about Adaptive Learning */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card border border-border/50 rounded-3xl p-6 md:p-8"
      >
        <div className="flex flex-col md:flex-row gap-6 md:items-center">
          <div className="w-12 h-12 rounded-2xl bg-muted border border-border/50 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-6 h-6 text-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground mb-2">How it works</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Our intelligent engine adjusts to you. If you're a beginner (fewer than five quizzes in a subject),
              you'll receive a balanced and protective mix of questions (e.g., 8 easy, 4 medium, 3 hard) to avoid
              sudden difficulty spikes. Experienced learners receive a stabilized difficulty mix based on their
              subject average and total XP. Recently attempted questions are actively excluded to keep practice fresh!
            </p>
          </div>
        </div>
      </motion.div>
    </AppLayout>
  );
};

export default QuizzesPage;
