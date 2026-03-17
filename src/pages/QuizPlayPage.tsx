import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, ChevronLeft, ChevronRight, Timer, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useAuth, useUser } from "@clerk/clerk-react";

export default function QuizPlayPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { getToken } = useAuth();
    const { user } = useUser();

    const quizData = location.state?.quizData;
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Result object from backend after submission
    const [result, setResult] = useState<any>(null);
    const [timeLeft, setTimeLeft] = useState((quizData?.total_questions || 10) * 60);

    // Ref to scroll to top smoothly when entering review mode
    const containerRef = useRef<HTMLDivElement>(null);

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

    const handleSubmit = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            const token = await getToken();
            if (!token) throw new Error("Not authenticated");

            // Build answers payload – only for questions that received a selection
            const payloadAnswers = Object.entries(answers).map(([qId, oId]) => ({
                question_id: parseInt(qId),
                selected_option_id: oId
            }));

            const email = user?.primaryEmailAddress?.emailAddress || "";
            const data = await api.submitQuiz(
                token,
                { session_id, answers: payloadAnswers },
                user?.id,
                email
            ) as any;

            // Navigate to the dedicated review page, carrying all data as router state
            navigate("/quiz/review", {
                state: {
                    result: data,
                    questions,
                    answers,
                },
                replace: true,   // so Back button goes to /quizzes, not back here
            });
        } catch (err: any) {
            console.error(err);
            alert("Submission failed: " + (err.message || "Network error."));
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
        if (result || isSubmitting) return; // Prevent changing answers after submit
        setAnswers(prev => ({ ...prev, [questions[currentQuestionIdx].id]: optId }));
    };

    // ── Review Mode UI ──
    if (result) {
        // Map detailed results for easier lookup: { question_id: result_obj }
        const resultsMap = result.results?.reduce((acc: any, r: any) => {
            acc[r.question_id] = r;
            return acc;
        }, {}) || {};

        return (
            <div className="min-h-screen bg-background flex flex-col font-sans" ref={containerRef}>
                {/* Fixed Top Header for Review */}
                <header className="h-16 border-b border-border/40 flex items-center justify-between px-6 bg-card/50 backdrop-blur-md sticky top-0 z-20">
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-foreground uppercase tracking-widest">
                            Quiz Review
                        </span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-background border border-border/50 rounded-lg shadow-sm">
                        <Trophy className="w-4 h-4 text-warning" />
                        <span className="text-sm font-mono font-bold text-foreground">
                            Score: {result.score_percentage}%
                        </span>
                    </div>
                </header>

                <main className="flex-1 w-full max-w-3xl mx-auto p-4 sm:p-8 flex flex-col gap-8">
                    {/* Render all questions sequentially */}
                    {questions.map((q: any, index: number) => {
                        const questionResult = resultsMap[q.id] || {};
                        const selectedOption = answers[q.id];
                        const isQuestionCorrect = questionResult.is_correct;

                        return (
                            <div key={q.id} className="bg-card glass rounded-3xl p-6 sm:p-10 border border-border/40 shadow-xl relative overflow-hidden">
                                {/* Top colored indicator bar for each question */}
                                <div className={`absolute top-0 left-0 right-0 h-1.5 ${isQuestionCorrect ? 'bg-success' : 'bg-destructive'}`} />

                                <div className="flex items-center gap-2 mb-6 justify-between">
                                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-muted text-muted-foreground">
                                        Question {index + 1}
                                    </span>
                                    {isQuestionCorrect ? (
                                        <div className="flex items-center gap-1.5 text-success">
                                            <CheckCircle2 className="w-4 h-4" />
                                            <span className="text-xs font-bold uppercase tracking-widest">Correct</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1.5 text-destructive">
                                            <XCircle className="w-4 h-4" />
                                            <span className="text-xs font-bold uppercase tracking-widest">Incorrect</span>
                                        </div>
                                    )}
                                </div>

                                <h2 className="text-xl sm:text-2xl font-display font-medium text-foreground leading-snug mb-8">
                                    {q.question_text}
                                </h2>

                                <div className="flex flex-col gap-3">
                                    {q.options.map((opt: any) => {
                                        const isSelected = selectedOption === opt.id;
                                        const isActualCorrect = questionResult.correct_option_id === opt.id;

                                        // Determine option styling globally based on state
                                        let optionClasses = "border-border/60 bg-background/50";
                                        let textClasses = "text-foreground/80";
                                        let indicatorClasses = "border-muted-foreground/30";

                                        if (isSelected && isActualCorrect) {
                                            optionClasses = "border-success bg-success/10 shadow-sm";
                                            textClasses = "text-success font-semibold";
                                            indicatorClasses = "border-success bg-success";
                                        } else if (isSelected && !isActualCorrect) {
                                            optionClasses = "border-destructive bg-destructive/10 shadow-sm";
                                            textClasses = "text-destructive font-semibold";
                                            indicatorClasses = "border-destructive bg-destructive";
                                        } else if (!isSelected && isActualCorrect) {
                                            optionClasses = "border-success/50 bg-success/5 shadow-sm";
                                            textClasses = "text-success font-semibold";
                                            indicatorClasses = "border-success bg-success";
                                        }

                                        return (
                                            <div
                                                key={opt.id}
                                                className={`relative w-full flex items-center p-4 rounded-2xl border-2 transition-all duration-200 text-left ${optionClasses}`}
                                            >
                                                <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center mr-4 flex-shrink-0 transition-colors ${indicatorClasses}`}>
                                                    {(isSelected || isActualCorrect) && <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-white" />}
                                                </div>
                                                <span className={`text-sm sm:text-base transition-colors ${textClasses}`}>
                                                    {opt.option_text}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}

                    {/* Final Score Footer Section */}
                    <div className="mt-4 mb-12 bg-card/60 backdrop-blur-xl border border-border/50 rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-success/10 via-transparent to-transparent pointer-events-none" />

                        <div className="w-16 h-16 rounded-full bg-success/20 mx-auto flex items-center justify-center mb-4 relative z-10">
                            <Trophy className="w-8 h-8 text-success" />
                        </div>
                        <h2 className="text-2xl font-display font-bold text-foreground mb-6 relative z-10">Quiz Summary</h2>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 relative z-10">
                            <div className="bg-background/50 rounded-2xl p-4 border border-border/50">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Score</span>
                                <p className="text-xl font-black text-foreground mt-1">{result.score_percentage}%</p>
                            </div>
                            <div className="bg-background/50 rounded-2xl p-4 border border-border/50">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Correct</span>
                                <p className="text-xl font-black text-success mt-1">{result.total_correct}</p>
                            </div>
                            <div className="bg-background/50 rounded-2xl p-4 border border-border/50">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Incorrect</span>
                                <p className="text-xl font-black text-destructive mt-1">{result.total_questions - result.total_correct}</p>
                            </div>
                            <div className="bg-background/50 rounded-2xl p-4 border border-border/50">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">XP Earned</span>
                                <p className="text-xl font-black text-xp mt-1">+{result.xp_earned}</p>
                            </div>
                        </div>

                        <Button onClick={() => navigate("/dashboard")} className="w-full sm:w-auto sm:min-w-[200px] bg-primary hover:bg-primary/90 text-white rounded-xl py-6 font-bold text-base shadow-lg relative z-10">
                            Return to Dashboard
                        </Button>
                    </div>
                </main>
            </div>
        );
    }

    // ── Playing Mode UI ──
    const currentQuestion = questions[currentQuestionIdx];
    const selectedOption = answers[currentQuestion.id];

    return (
        <div className="min-h-screen bg-background flex flex-col font-sans">
            <header className="h-16 border-b border-border/40 flex items-center justify-between px-6 bg-card/50 backdrop-blur-md sticky top-0 z-20">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate("/quizzes")} className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
                        Quit
                    </button>
                    <div className="w-px h-4 bg-border/50" />
                    <span className="text-xs font-bold uppercase tracking-widest text-primary/80">Question {currentQuestionIdx + 1} of {total_questions}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-background border border-border/50 rounded-lg shadow-sm">
                    <Timer className={`w-4 h-4 ${timeLeft < 60 ? 'text-destructive animate-pulse' : 'text-muted-foreground'}`} />
                    <span className={`text-sm font-mono font-bold ${timeLeft < 60 ? 'text-destructive' : 'text-foreground'}`}>
                        {formatTime(timeLeft)}
                    </span>
                </div>
            </header>

            <div className="w-full h-1 bg-muted overflow-hidden">
                <div className="h-full bg-primary transition-all duration-300 ease-out" style={{ width: `${((currentQuestionIdx) / total_questions) * 100}%` }} />
            </div>

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
