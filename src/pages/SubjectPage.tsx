import { useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { BookOpen, Brain, FileQuestion, BarChart3, FileText, StickyNote } from "lucide-react";

const tabs = [
  { id: "textbook", label: "Textbook", icon: BookOpen },
  { id: "ask-ai", label: "Ask AI", icon: Brain },
  { id: "quiz", label: "Quiz", icon: FileQuestion },
  { id: "performance", label: "Performance", icon: BarChart3 },
  { id: "past-papers", label: "Past Papers", icon: FileText },
  { id: "notes", label: "Sticky Notes", icon: StickyNote },
];

const SubjectPage = () => {
  const { subjectId } = useParams();
  const [activeTab, setActiveTab] = useState("textbook");
  const subjectName = subjectId ? subjectId.charAt(0).toUpperCase() + subjectId.slice(1) : "Subject";

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{subjectName}</h1>
          <p className="text-brown-light">Explore lessons, quizzes, and track your progress</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-border overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all duration-200 ${
                  activeTab === tab.id
                    ? "border-accent text-brown"
                    : "border-transparent text-brown-light/60 hover:text-brown-light"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="animate-fade-in-up">
          {activeTab === "textbook" && (
            <div className="space-y-4">
              {["Chapter 1: Introduction", "Chapter 2: Core Concepts", "Chapter 3: Advanced Topics", "Chapter 4: Practice"].map((ch, i) => (
                <div key={ch} className="bg-card rounded-xl p-5 shadow-soft border-l-4 border-primary">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-brown">{ch}</h3>
                      <p className="text-sm text-brown-light mt-1">{4 + i * 2} lessons · {20 + i * 10} min</p>
                    </div>
                    <Button variant="default" size="sm">Start</Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "quiz" && <QuizTab />}

          {activeTab !== "textbook" && activeTab !== "quiz" && (
            <div className="bg-card rounded-xl p-12 shadow-soft text-center">
              <p className="text-brown-light text-lg">
                {activeTab === "ask-ai" && "AI tutor coming soon — get instant help with any question."}
                {activeTab === "performance" && "Your performance analytics will appear here."}
                {activeTab === "past-papers" && "Past paper collections will be available here."}
                {activeTab === "notes" && "Your sticky notes for this subject will appear here."}
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

const QuizTab = () => {
  const [difficulty, setDifficulty] = useState<string | null>(null);
  const [started, setStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);

  const questions = [
    { q: "What is the derivative of x²?", options: ["x", "2x", "x²", "2"], answer: 1 },
    { q: "What is the integral of 2x?", options: ["x²", "x² + C", "2x²", "x"], answer: 1 },
    { q: "What is sin(90°)?", options: ["0", "0.5", "1", "-1"], answer: 2 },
  ];

  if (!difficulty) {
    return (
      <div className="bg-card rounded-xl p-8 shadow-soft text-center max-w-md mx-auto">
        <h3 className="text-xl font-bold mb-2">Choose Difficulty</h3>
        <p className="text-brown-light text-sm mb-6">Select a difficulty level to start your quiz</p>
        <div className="space-y-3">
          {[
            { level: "Easy", style: "bg-primary text-primary-foreground hover:bg-primary/90" },
            { level: "Medium", style: "bg-accent text-accent-foreground hover:bg-clay-dark" },
            { level: "Hard", style: "bg-secondary text-secondary-foreground hover:bg-secondary/90" },
          ].map(({ level, style }) => (
            <button
              key={level}
              onClick={() => setDifficulty(level)}
              className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${style}`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="bg-card rounded-xl p-8 shadow-soft text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
          <FileQuestion className="w-8 h-8 text-accent" />
        </div>
        <h3 className="text-xl font-bold mb-2">{difficulty} Quiz</h3>
        <p className="text-brown-light text-sm mb-6">{questions.length} questions · 10 min</p>
        <Button variant="default" size="lg" onClick={() => setStarted(true)} className="w-full">
          Start Quiz
        </Button>
      </div>
    );
  }

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="bg-card rounded-xl p-8 shadow-soft text-center max-w-md mx-auto animate-scale-in">
        <div className="text-5xl font-bold text-brown mb-2">{pct}%</div>
        <p className="text-accent font-semibold text-lg mb-2">
          {pct >= 80 ? "Outstanding! 🎉" : pct >= 50 ? "Good effort! 💪" : "Keep practicing! 📚"}
        </p>
        <p className="text-brown-light text-sm mb-6">You scored {score} out of {questions.length}</p>
        <div className="h-3 bg-sand-dark rounded-full overflow-hidden mb-6">
          <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
        </div>
        <Button variant="default" onClick={() => { setDifficulty(null); setStarted(false); setCurrentQ(0); setScore(0); setFinished(false); setSelected(null); }}>
          Try Again
        </Button>
      </div>
    );
  }

  const q = questions[currentQ];

  return (
    <div className="bg-card rounded-xl p-8 shadow-soft max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <span className="bg-accent/10 text-accent text-xs font-bold px-3 py-1 rounded-full">
          Q{currentQ + 1}/{questions.length}
        </span>
        <span className="text-sm text-brown-light">{difficulty}</span>
      </div>
      <h3 className="text-lg font-bold mb-6">{q.q}</h3>
      <div className="space-y-3 mb-6">
        {q.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all duration-200 text-sm font-medium ${
              selected === i
                ? "border-primary bg-sage-light text-brown"
                : "border-border hover:border-primary/40 text-brown-body"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
      <Button
        variant="default"
        className="w-full"
        disabled={selected === null}
        onClick={() => {
          if (selected === q.answer) setScore(s => s + 1);
          if (currentQ < questions.length - 1) {
            setCurrentQ(c => c + 1);
            setSelected(null);
          } else {
            setFinished(true);
          }
        }}
      >
        {currentQ < questions.length - 1 ? "Next Question" : "Submit Quiz"}
      </Button>
    </div>
  );
};

export default SubjectPage;
