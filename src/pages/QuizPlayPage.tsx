import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useProfile } from "@/hooks/useProfile";

export default function QuizPlayPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { getToken } = useAuth();
    const { user } = useUser();
    const { profile } = useProfile();

    const quizData = location.state?.quizData;
    const quizMeta = location.state?.quizMeta as
        | { subjectId: number; mode: "term" | "topic"; topicId: number | null }
        | undefined;
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isStartingNext, setIsStartingNext] = useState(false);

    const [timeLeft, setTimeLeft] = useState((quizData?.total_questions || 10) * 60);

    // Reset state when starting a new quiz
    useEffect(() => {
        if (quizData?.session_id) {
            setCurrentQuestionIdx(0);
            setAnswers({});
            setIsSubmitting(false);
            setIsStartingNext(false);
            setTimeLeft((quizData.total_questions || 10) * 60);
        }
    }, [quizData?.session_id]);


    // Countdown Timer
    useEffect(() => {
        if (!quizData || isSubmitting) return;
        const timerId = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerId);
                    handleFinishQuiz();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timerId);
    }, [quizData, isSubmitting]);

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

    const submitCurrentQuiz = async () => {
        const token = await getToken();
        if (!token) throw new Error("Not authenticated");

        // Build answers payload – only for questions that received a selection
        const payloadAnswers = Object.entries(answers).map(([qId, oId]) => ({
            question_id: parseInt(qId),
            selected_option_id: oId
        }));

        const email = user?.primaryEmailAddress?.emailAddress || "";
        return await api.submitQuiz(
            token,
            { session_id, answers: payloadAnswers },
            user?.id,
            email
        ) as any;
    };

    const handleFinishQuiz = async () => {
        if (isSubmitting || isStartingNext) return;
        setIsSubmitting(true);
        try {
            const data = await submitCurrentQuiz();

            // Transform answer_results from backend into the "results" shape
            // that QuizReviewPage expects.
            const transformedResults = (data.answer_results || []).map((ar: any) => ({
                question_id: ar.question_id,
                is_correct: ar.is_correct,
                correct_option_id: ar.correct_option_id,
                selected_option_id: ar.selected_option_id ?? answers[ar.question_id] ?? null,
            }));

            const reviewResult = {
                score_percentage: data.score_percentage,
                total_correct: data.total_correct,
                total_questions: data.total_questions,
                xp_earned: data.xp_earned,
                results: transformedResults,
            };

            // Navigate to the dedicated review page, carrying all data as router state
            navigate("/quiz/review", {
                state: {
                    result: reviewResult,
                    questions,
                    answers,
                    quizMeta,
                },
                replace: true,   // so Back button goes to /quizzes, not back here
            });
        } catch (err: any) {
            console.error(err);
            alert("Submission failed: " + (err.message || "Network error."));
            setIsSubmitting(false);
        }
    };

    const handleNextQuiz = async () => {
        if (isSubmitting || isStartingNext) return;
        if (!quizMeta?.subjectId) {
            navigate("/quizzes");
            return;
        }
        if (!profile?.id) {
            navigate("/quizzes");
            return;
        }
        setIsStartingNext(true);
        try {
            // First submit this quiz so the attempt is saved
            await submitCurrentQuiz();

            const token = await getToken();
            if (!token) throw new Error("Not authenticated");
            const email = user?.primaryEmailAddress?.emailAddress || "";

            const nextQuizData = await api.startQuiz(
                token,
                {
                    student_id: profile.id,
                    subject_id: quizMeta.subjectId,
                    mode: quizMeta.mode,
                    ...(quizMeta.mode === "topic" && quizMeta.topicId ? { topic_id: quizMeta.topicId } : {}),
                },
                user?.id,
                email
            ) as any;

            navigate("/quiz/play", {
                state: { quizData: nextQuizData, quizMeta },
                replace: true,
            });
        } catch (err: any) {
            console.error(err);
            alert("Failed to start next quiz: " + (err.message || "Network error."));
        } finally {
            setIsStartingNext(false);
        }
    };

    const handleNext = () => {
        if (currentQuestionIdx < total_questions - 1) {
            setCurrentQuestionIdx(prev => prev + 1);
        } else {
            handleFinishQuiz();
        }
    };

    const handleBack = () => {
        if (currentQuestionIdx > 0) {
            setCurrentQuestionIdx(prev => prev - 1);
        }
    };

    const handleSelect = (optId: number) => {
        if (isSubmitting) return; // Prevent changing answers after submit
        setAnswers(prev => ({ ...prev, [questions[currentQuestionIdx].id]: optId }));
    };

    // ── Playing Mode UI ──
    const currentQuestion = questions[currentQuestionIdx];
    const selectedOption = answers[currentQuestion.id];

    return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
            <header className="h-14 border-b border-border/40 flex items-center justify-between px-5 bg-background/95 backdrop-blur-md sticky top-0 z-20">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate("/quizzes")} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                        Quit
                    </button>
                    <div className="w-px h-4 bg-border/50" />
                    <span className="text-xs font-semibold uppercase tracking-widest text-primary/70">Question {currentQuestionIdx + 1} of {total_questions}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-card border border-border/60 rounded-xl shadow-sm">
                    <Timer className={`w-3.5 h-3.5 ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-muted-foreground'}`} />
                    <span className={`text-sm font-mono font-semibold ${timeLeft < 60 ? 'text-red-500' : 'text-foreground'}`}>
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

                                <div className="flex items-center gap-3">
                                    {currentQuestionIdx === total_questions - 1 && (
                                        <Button
                                            onClick={handleNextQuiz}
                                            variant="outline"
                                            disabled={isSubmitting || isStartingNext}
                                            className="px-6 py-6 rounded-xl text-base font-bold shadow-sm"
                                        >
                                            {isStartingNext ? "Starting..." : "Next quiz"}
                                        </Button>
                                    )}

                                    <Button
                                        onClick={handleNext}
                                        disabled={isSubmitting || isStartingNext || (!selectedOption && currentQuestionIdx === total_questions - 1)}
                                        className={`px-8 py-6 rounded-xl text-base font-bold shadow-md transition-all ${selectedOption || currentQuestionIdx < total_questions - 1 ? "bg-primary hover:bg-primary/90 text-white translate-y-0" : "bg-muted text-muted-foreground translate-y-1 opacity-60"
                                            }`}
                                    >
                                        {isSubmitting ? "Submitting..." : (currentQuestionIdx === total_questions - 1 ? "Finish Quiz" : "Next")} {currentQuestionIdx !== total_questions - 1 && <ChevronRight className="w-5 h-5 ml-1" />}
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
