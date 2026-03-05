import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, ChevronLeft, ChevronRight, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function QuizPlayPage() {
    const location = useLocation();
    const navigate = useNavigate();

    const quizData = location.state?.quizData;
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [timeLeft, setTimeLeft] = useState((quizData?.total_questions || 10) * 60);

    // Countdown Timer
    useEffect(() => {
        if (!quizData || result || isSubmitting) return;
        const timerId = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerId);
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timerId);
    }, [quizData, result, isSubmitting]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, "0");
        const s = (seconds % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };

    if (!quizData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background text-foreground flex-col gap-4">
                <p>No active quiz session found.</p>
                <Button onClick={() => navigate("/quizzes")}>Return to Quizzes</Button>
            </div>
        );
    }

    const { session_id, questions, total_questions } = quizData;

    if (result) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-success/20 via-background to-background pointer-events-none" />
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md w-full bg-card/60 backdrop-blur-xl border border-border/50 rounded-3xl p-8 text-center relative z-10 shadow-2xl">
                    <div className="w-20 h-20 rounded-full bg-success/20 mx-auto flex items-center justify-center mb-6">
                        <Trophy className="w-10 h-10 text-success" />
                    </div>
                    <h1 className="text-3xl font-display font-bold text-foreground mb-2">Quiz Complete!</h1>
                    <p className="text-muted-foreground mb-8">You successfully finished the assessment.</p>
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-background/50 rounded-2xl p-4 border border-border/50">
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Score</span>
                            <p className="text-2xl font-black text-foreground mt-1">{result.score_percentage}%</p>
                        </div>
                        <div className="bg-background/50 rounded-2xl p-4 border border-border/50">
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">XP Earned</span>
                            <p className="text-2xl font-black text-xp mt-1">+{result.xp_earned}</p>
                        </div>
                    </div>
                    <Button onClick={() => navigate("/dashboard")} className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl py-6 font-bold text-base shadow-lg cursor-pointer">
                        Return to Dashboard
                    </Button>
                </motion.div>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIdx];
    const selectedOption = answers[currentQuestion.id];

    const handleSubmit = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            // Build answers payload for questions that have selections
            const payloadAnswers = Object.entries(answers).map(([qId, oId]) => ({
                question_id: parseInt(qId),
                selected_option_id: oId
            }));

            const res = await fetch("http://127.0.0.1:8000/api/v1/quiz/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ session_id, answers: payloadAnswers })
            });
            const data = await res.json();
            if (res.ok) {
                setResult(data);
            } else {
                alert("Submission failed!");
                setIsSubmitting(false);
            }
        } catch (err) {
            console.error(err);
            alert("Network error.");
            setIsSubmitting(false);
        }
    };

    const handleNext = () => {
        if (currentQuestionIdx < total_questions - 1) {
            setCurrentQuestionIdx(prev => prev + 1);
        } else {
            handleSubmit();
        }
    };

    const handleBack = () => {
        if (currentQuestionIdx > 0) {
            setCurrentQuestionIdx(prev => prev - 1);
        }
    };

    const handleSelect = (optId: number) => {
        setAnswers(prev => ({ ...prev, [currentQuestion.id]: optId }));
    };

    return (
        <div className="min-h-screen bg-background flex flex-col font-sans">
            {/* Top Bar */}
            <header className="h-16 border-b border-border/40 flex items-center justify-between px-6 bg-card/50 backdrop-blur-md sticky top-0 z-20">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate("/quizzes")} className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
                        Quit
                    </button>
                    <div className="w-px h-4 bg-border/50" />
                    <span className="text-xs font-bold uppercase tracking-widest text-primary/80">Question {currentQuestionIdx + 1} of {total_questions}</span>
                </div>
                {/* Timer */}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-background border border-border/50 rounded-lg shadow-sm">
                    <Timer className={`w-4 h-4 ${timeLeft < 60 ? 'text-destructive animate-pulse' : 'text-muted-foreground'}`} />
                    <span className={`text-sm font-mono font-bold ${timeLeft < 60 ? 'text-destructive' : 'text-foreground'}`}>
                        {formatTime(timeLeft)}
                    </span>
                </div>
                {/* Progress bar overlaid on top edge optionally, or kept as separate container */}
            </header>

            <div className="w-full h-1 bg-muted overflow-hidden">
                <div className="h-full bg-primary transition-all duration-300 ease-out" style={{ width: `${((currentQuestionIdx) / total_questions) * 100}%` }} />
            </div>

            {/* Question Container */}
            <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8">
                <div className="w-full max-w-3xl">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentQuestion.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-card glass rounded-3xl p-6 sm:p-10 border border-border/40 shadow-xl"
                        >
                            <div className="flex items-center gap-2 mb-6">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${currentQuestion.difficulty === 'hard' ? 'bg-destructive/10 text-destructive' :
                                    currentQuestion.difficulty === 'medium' ? 'bg-warning/10 text-warning' :
                                        'bg-success/10 text-success'
                                    }`}>
                                    {currentQuestion.difficulty}
                                </span>
                            </div>

                            <h2 className="text-2xl sm:text-3xl font-display font-medium text-foreground leading-snug mb-10">
                                {currentQuestion.question_text}
                            </h2>

                            <div className="flex flex-col gap-3 sm:gap-4">
                                {currentQuestion.options.map((opt: any) => {
                                    const isSelected = selectedOption === opt.id;
                                    return (
                                        <button
                                            key={opt.id}
                                            onClick={() => handleSelect(opt.id)}
                                            className={`group relative w-full flex items-center p-4 sm:p-5 rounded-2xl border-2 transition-all duration-200 text-left ${isSelected
                                                ? "border-primary bg-primary/5 shadow-sm scale-[1.01]"
                                                : "border-border/60 bg-background/50 hover:bg-muted/40 hover:border-border/80"
                                                }`}
                                        >
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 flex-shrink-0 transition-colors ${isSelected ? "border-primary bg-primary" : "border-muted-foreground/30 group-hover:border-primary/50"
                                                }`}>
                                                {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                                            </div>
                                            <span className={`text-base sm:text-lg font-medium transition-colors ${isSelected ? "text-foreground" : "text-foreground/80"}`}>
                                                {opt.option_text}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="mt-10 pt-6 border-t border-border/40 flex justify-between items-center">
                                <Button
                                    onClick={handleBack}
                                    variant="outline"
                                    disabled={currentQuestionIdx === 0 || isSubmitting}
                                    className={`px-5 py-6 rounded-xl text-base font-bold shadow-sm transition-all ${currentQuestionIdx === 0 ? "opacity-0 pointer-events-none" : ""
                                        }`}
                                >
                                    <ChevronLeft className="w-5 h-5 mr-1" /> Back
                                </Button>

                                <Button
                                    onClick={handleNext}
                                    disabled={isSubmitting}
                                    className={`px-8 py-6 rounded-xl text-base font-bold shadow-md transition-all ${selectedOption || currentQuestionIdx < total_questions - 1 ? "bg-primary hover:bg-primary/90 text-white translate-y-0" : "bg-muted text-muted-foreground translate-y-1 opacity-60"
                                        }`}
                                >
                                    {isSubmitting ? "Submitting..." : (currentQuestionIdx === total_questions - 1 ? "Finish Quiz" : "Next")} {currentQuestionIdx !== total_questions - 1 && <ChevronRight className="w-5 h-5 ml-1" />}
                                </Button>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}

