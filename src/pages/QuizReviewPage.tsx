import { useState, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Trophy, ArrowLeft, RotateCcw, Award } from "lucide-react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { api, type QuizSessionReview, type NewlyEarnedBadge } from "@/lib/api";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useProfile } from "@/hooks/useProfile";

// ─── Types (mirrors backend QuizSubmitResponse) ──────────────────────────────
interface QuestionOption {
    id: number;
    option_text: string;
    is_correct: boolean;
}

interface QuizQuestion {
    id: number;
    question_text: string;
    difficulty: string;
    xp_value: number;
    topic_id: number;
    topic_name: string;
    options: QuestionOption[];
}

interface QuizQuestionResult {
    question_id: number;
    is_correct: boolean;
    correct_option_id: number;
    selected_option_id?: number | null;
}

interface ReviewData {
    result: {
        score_percentage: number;
        total_correct: number;
        total_questions: number;
        xp_earned: number;
        results: QuizQuestionResult[];
        newly_earned_badges?: NewlyEarnedBadge[];
    };
    questions: QuizQuestion[];
    answers: Record<number, number>; // question_id → selected_option_id
    quizMeta?: { subjectId: number; mode: "term" | "topic"; topicId: number | null };
}

// ─── Celebration Component ───────────────────────────────────────────────────

function BadgeCelebration({ badges, onComplete }: { badges: NewlyEarnedBadge[], onComplete: () => void }) {
    useEffect(() => {
        // Fire confetti!
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);

        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
        >
            <div className="max-w-md w-full bg-card border border-border/60 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
                
                <div className="relative z-10 text-center space-y-6">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", damping: 12, stiffness: 200 }}
                        className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto"
                    >
                        <Award className="w-10 h-10 text-primary" />
                    </motion.div>
                    
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-foreground">Achievement Unlocked!</h2>
                        <p className="text-sm text-muted-foreground">You've earned new badges for your hard work.</p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4 py-4">
                        {badges.map((badge, idx) => (
                            <motion.div
                                key={badge.badge_id}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 + idx * 0.1 }}
                                className="flex flex-col items-center gap-2"
                            >
                                <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center border border-border/40 overflow-hidden">
                                    {badge.image_url ? (
                                        <img src={badge.image_url} alt={badge.badge_name} className="w-full h-full object-contain" />
                                    ) : (
                                        <Trophy className="w-8 h-8 text-muted-foreground/40" />
                                    )}
                                </div>
                                <span className="text-xs font-bold text-foreground max-w-[80px] truncate">
                                    {badge.badge_name.replace(/_/g, " ")}
                                </span>
                            </motion.div>
                        ))}
                    </div>

                    <Button 
                        onClick={onComplete}
                        className="w-full py-6 rounded-2xl text-base font-bold shadow-lg"
                    >
                        Awesome!
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}

// ─── Difficulty badge colours ─────────────────────────────────────────────────
const difficultyStyle: Record<string, string> = {
    easy: "bg-emerald-100 text-emerald-700",
    medium: "bg-amber-100 text-amber-700",
    hard: "bg-rose-100 text-rose-700",
};

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Convert a QuizSessionReview (from API) into the unified ReviewData shape */
function reviewFromApi(data: QuizSessionReview): ReviewData {
    // Build answers map: question_id → selected_option_id
    const answers: Record<number, number> = {};
    for (const r of data.results) {
        if (r.selected_option_id != null) {
            answers[r.question_id] = r.selected_option_id;
        }
    }

    return {
        result: {
            score_percentage: data.score_percentage,
            total_correct: data.total_correct,
            total_questions: data.total_questions,
            xp_earned: data.xp_earned,
            results: data.results.map((r) => ({
                question_id: r.question_id,
                is_correct: r.is_correct,
                correct_option_id: r.correct_option_id,
                selected_option_id: r.selected_option_id,
            })),
            newly_earned_badges: data.newly_earned_badges,
        },
        questions: data.questions as QuizQuestion[],
        answers,
    };
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function QuizReviewPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { getToken } = useAuth();
    const { user } = useUser();
    const { profile } = useProfile();
    const [isStartingNext, setIsStartingNext] = useState(false);
    const [showCelebration, setShowCelebration] = useState(false);

    // ── Mode detection ──────────────────────────────────────────────────────
    // Mode A: came straight from finishing a quiz → router state has result+questions+answers
    const routerState = location.state as ReviewData | null;

    // Mode B: came from dashboard → URL has ?session_id=XXX
    const sessionIdParam = searchParams.get("session_id");
    const isFromDashboard = !routerState?.result && !!sessionIdParam;

    // ── Fetch state (Mode B) ─────────────────────────────────────────────────
    const [fetchedData, setFetchedData] = useState<ReviewData | null>(null);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
        if (!isFromDashboard || !sessionIdParam) return;

        let cancelled = false;
        setIsFetching(true);
        setFetchError(null);

        (async () => {
            try {
                const token = await getToken();
                if (!token) throw new Error("Not authenticated");
                const email = user?.primaryEmailAddress?.emailAddress || "";
                const data = await api.getQuizSessionReview(token, parseInt(sessionIdParam), user?.id, email);
                if (!cancelled) {
                    setFetchedData(reviewFromApi(data));
                }
            } catch (err: unknown) {
                if (!cancelled) setFetchError(err instanceof Error ? err.message : "Failed to load quiz review.");
            } finally {
                if (!cancelled) setIsFetching(false);
            }
        })();

        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFromDashboard, sessionIdParam]);

    // ── Resolve the data to render ───────────────────────────────────────────
    const reviewData: ReviewData | null = routerState?.result ? routerState : fetchedData;

    // ─── Loading state (dashboard mode) ─────────────────────────────────────
    if (isFetching) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f5f0e8]">
                <div className="flex flex-col items-center gap-4">
                    <span className="w-10 h-10 rounded-full border-4 border-[#5a7a47]/30 border-t-[#5a7a47] animate-spin" />
                    <p className="text-[#6b5744] text-sm font-medium">Loading quiz review…</p>
                </div>
            </div>
        );
    }

    // ─── Error state ─────────────────────────────────────────────────────────
    if (fetchError) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#f5f0e8] text-[#3d2c1e]">
                <XCircle className="w-10 h-10 text-rose-500" />
                <p className="text-lg font-medium">{fetchError}</p>
                <Button onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
            </div>
        );
    }

    // ─── Guard — no data ─────────────────────────────────────────────────────
    if (!reviewData?.result || !reviewData?.questions) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#f5f0e8] text-[#3d2c1e]">
                <p className="text-lg font-medium">No review data found.</p>
                <Button onClick={() => navigate("/quizzes")}>Go to Quizzes</Button>
            </div>
        );
    }

    const { result, questions, answers, quizMeta } = reviewData;
    const { score_percentage, total_correct, total_questions, xp_earned, results } = result;

    // Map result array by question_id for quick lookup
    const resultMap = new Map<number, QuizQuestionResult>(
        results.map((r) => [r.question_id, r])
    );

    const totalIncorrect = total_questions - total_correct;
    const scorePercent = Math.round(score_percentage);

    // Determine score colour arc
    const arcColour =
        scorePercent >= 75 ? "#22c55e" : scorePercent >= 50 ? "#f59e0b" : "#ef4444";

    const startNextQuiz = async () => {
        if (!quizMeta?.subjectId) { navigate("/quizzes"); return; }
        if (!profile?.id) { navigate("/quizzes"); return; }
        setIsStartingNext(true);
        try {
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
            ) as unknown;
            navigate("/quiz/play", { state: { quizData: nextQuizData, quizMeta } });
        } catch (err: unknown) {
            console.error(err);
            alert("Failed to start next quiz: " + (err instanceof Error ? err.message : "Network error."));
        } finally {
            setIsStartingNext(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f5f0e8]">
            <AnimatePresence>
                {showCelebration && result.newly_earned_badges && (
                    <BadgeCelebration 
                        badges={result.newly_earned_badges} 
                        onComplete={() => setShowCelebration(false)} 
                    />
                )}
            </AnimatePresence>

            {/* ── Page header ─────────────────────────────────────────────── */}
            <div className="sticky top-0 z-20 bg-[#f5f0e8]/95 backdrop-blur border-b border-[#d4c5b0] px-4 py-3 flex items-center gap-3">
                <button
                    onClick={() => navigate(isFromDashboard ? "/dashboard" : "/quizzes")}
                    className="flex items-center gap-1 text-sm text-[#6b5744] hover:text-[#3d2c1e] transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    {isFromDashboard ? "Back to Dashboard" : "Back to Quizzes"}
                </button>
                <span className="text-[#c4a882] select-none">|</span>
                <span className="text-sm font-semibold text-[#3d2c1e]">Quiz Review</span>
                {isFromDashboard && (
                    <span className="ml-auto text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-semibold">
                        Past Quiz
                    </span>
                )}
            </div>

            <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

                {/* ── Score card ────────────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white rounded-2xl shadow-md p-6 flex flex-col sm:flex-row items-center gap-6"
                >
                    {/* Circular score gauge */}
                    <div className="relative flex-shrink-0 w-28 h-28">
                        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                            <circle cx="50" cy="50" r="42" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                            <circle
                                cx="50" cy="50" r="42"
                                fill="none"
                                stroke={arcColour}
                                strokeWidth="10"
                                strokeDasharray={`${2 * Math.PI * 42}`}
                                strokeDashoffset={`${2 * Math.PI * 42 * (1 - scorePercent / 100)}`}
                                strokeLinecap="round"
                                className="transition-all duration-700"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                            <span className="text-2xl font-bold text-[#3d2c1e]">{scorePercent}%</span>
                        </div>
                    </div>

                    <div className="flex-1 text-center sm:text-left space-y-1">
                        <h1 className="text-2xl font-bold text-[#3d2c1e] flex items-center gap-2 justify-center sm:justify-start">
                            <Trophy className="w-5 h-5 text-amber-500" />
                            {isFromDashboard ? "Quiz Results" : "Quiz Complete!"}
                        </h1>
                        <p className="text-[#6b5744]">
                            {isFromDashboard
                                ? "Here's how you performed on this past quiz."
                                : "Here's how you performed on this quiz."}
                        </p>
                        <div className="flex flex-wrap gap-3 mt-3 justify-center sm:justify-start">
                            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold">
                                <CheckCircle2 className="w-4 h-4" /> {total_correct} Correct
                            </span>
                            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-100 text-rose-700 text-sm font-semibold">
                                <XCircle className="w-4 h-4" /> {totalIncorrect} Incorrect
                            </span>
                            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 text-sm font-semibold">
                                <Trophy className="w-4 h-4" /> +{xp_earned} XP
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* ── Per-question review cards ──────────────────────────── */}
                <div className="space-y-4">
                    {questions.map((q, idx) => {
                        const qResult = resultMap.get(q.id);
                        const isCorrect = qResult?.is_correct ?? false;
                        const correctOptionId = qResult?.correct_option_id;
                        // Support both router state answers map AND API result's selected_option_id
                        const selectedOptionId = answers[q.id] ?? qResult?.selected_option_id ?? null;

                        return (
                            <motion.div
                                key={q.id}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: idx * 0.04 }}
                                className={`rounded-2xl border-2 overflow-hidden shadow-sm ${
                                    isCorrect
                                        ? "border-emerald-300 bg-emerald-50/60"
                                        : "border-rose-300 bg-rose-50/60"
                                }`}
                            >
                                {/* Question header */}
                                <div className={`flex items-start gap-3 px-5 pt-4 pb-3 ${
                                    isCorrect ? "bg-emerald-100/70" : "bg-rose-100/70"
                                }`}>
                                    <div className="mt-0.5 flex-shrink-0">
                                        {isCorrect
                                            ? <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                            : <XCircle className="w-5 h-5 text-rose-600" />
                                        }
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap gap-2 mb-1">
                                            <span className="text-xs font-semibold text-[#6b5744]">Q{idx + 1}</span>
                                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${difficultyStyle[q.difficulty] ?? "bg-gray-100 text-gray-600"}`}>
                                                {q.difficulty}
                                            </span>
                                            {/* Topic Badge - Highlighted if correct answer was missed */}
                                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${!isCorrect ? "bg-rose-200 text-rose-800 border-rose-300 border shadow-sm" : "bg-[#ede8e1] text-[#6b5744]"}`}>
                                                {q.topic_name}
                                            </span>
                                            <span className="text-xs text-amber-600 font-semibold">{q.xp_value} XP</span>
                                        </div>
                                        <p className="text-[#3d2c1e] font-medium text-sm sm:text-base">{q.question_text}</p>
                                    </div>
                                </div>

                                {/* Options */}
                                <div className="px-5 py-3 space-y-2">
                                    {q.options.map((opt) => {
                                        const isSelected = opt.id === selectedOptionId;
                                        const isCorrectOpt = opt.id === correctOptionId;

                                        let optClassName =
                                            "flex items-center gap-3 px-4 py-2.5 rounded-xl border text-sm transition-all ";

                                        if (isCorrectOpt) {
                                            // Always highlight the correct answer in green
                                            optClassName += "border-emerald-400 bg-emerald-100 text-emerald-800 font-semibold";
                                        } else if (isSelected && !isCorrectOpt) {
                                            // Wrong selection — red
                                            optClassName += "border-rose-400 bg-rose-100 text-rose-800 font-semibold";
                                        } else {
                                            // Neutral un-selected options
                                            optClassName += "border-gray-200 bg-white text-[#6b5744]";
                                        }

                                        return (
                                            <div key={opt.id} className={optClassName}>
                                                {isCorrectOpt ? (
                                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                                ) : isSelected && !isCorrectOpt ? (
                                                    <XCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                                                ) : (
                                                    <span className="w-4 h-4 flex-shrink-0" />
                                                )}
                                                <span>{opt.option_text}</span>
                                                {isCorrectOpt && (
                                                    <span className="ml-auto text-xs text-emerald-600 font-bold">✓ Correct Answer</span>
                                                )}
                                                {isSelected && !isCorrectOpt && (
                                                    <span className="ml-auto text-xs text-rose-500 font-bold">✗ Your Answer</span>
                                                )}
                                                {!isSelected && !isCorrectOpt && selectedOptionId == null && (
                                                    /* Question was skipped — no selected option */
                                                    null
                                                )}
                                            </div>
                                        );
                                    })}
                                    {/* If no answer was selected (skipped) */}
                                    {selectedOptionId == null && (
                                        <p className="text-xs text-[#6b5744] italic px-1">No answer selected (skipped)</p>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* ── Bottom summary + actions ────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="bg-white rounded-2xl shadow-md p-6 mt-4"
                >
                    <h2 className="text-lg font-bold text-[#3d2c1e] mb-4 border-b border-[#e5ddd0] pb-2">
                        Quiz Summary
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                        {[
                            { label: "Score", value: `${scorePercent}%`, color: "text-[#3d2c1e]" },
                            { label: "Correct", value: total_correct, color: "text-emerald-600" },
                            { label: "Incorrect", value: totalIncorrect, color: "text-rose-600" },
                            { label: "XP Earned", value: `+${xp_earned}`, color: "text-amber-600" },
                        ].map(({ label, value, color }) => (
                            <div key={label} className="flex flex-col items-center bg-[#f9f4ed] rounded-xl p-3">
                                <span className={`text-2xl font-bold ${color}`}>{value}</span>
                                <span className="text-xs text-[#6b5744] mt-1">{label}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                            onClick={() => navigate("/dashboard")}
                            className="flex-1 bg-[#5a7a47] hover:bg-[#4a6a37] text-white rounded-xl py-2.5"
                        >
                            {isFromDashboard ? "Back to Dashboard" : "Return to Dashboard"}
                        </Button>
                        {/* Only show "Next Quiz" when we have quizMeta (just-finished flow) */}
                        {!isFromDashboard && quizMeta && (
                            <Button
                                onClick={startNextQuiz}
                                disabled={isStartingNext}
                                className="flex-1 bg-primary hover:bg-primary/90 text-white rounded-xl py-2.5"
                            >
                                {isStartingNext ? "Starting…" : "Next Quiz"}
                            </Button>
                        )}
                        <Button
                            onClick={() => navigate("/quizzes")}
                            variant="outline"
                            className="flex-1 border-[#c4a882] text-[#6b5744] hover:bg-[#f0e8db] rounded-xl py-2.5"
                        >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Take Another Quiz
                        </Button>
                    </div>
                </motion.div>

            </div>
        </div>
    );
}
