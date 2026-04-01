/**
 * Centralised API client for MindUp Backend.
 * All requests carry the Clerk JWT in Authorization: Bearer <token>.
 *
 * Usage:
 *   import { api } from "@/lib/api";
 *   const token = await window.Clerk?.session?.getToken();
 *   const profile = await api.getProfile(token!);
 */

const BASE = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

async function request<T>(
    path: string,
    token: string | null,
    options: RequestInit & { xClerkUserId?: string; xEmail?: string } = {}
): Promise<T> {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string>),
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    if (options.xClerkUserId) headers["X-Clerk-User-Id"] = options.xClerkUserId;
    if (options.xEmail) headers["X-Email"] = options.xEmail;

    const res = await fetch(`${BASE}${path}`, { ...options, headers });

    if (!res.ok) {
        let detail = `${res.status} ${res.statusText}`;
        try {
            const body = await res.json();
            detail = body.detail ?? detail;
        } catch {
            /* ignore */
        }
        throw new Error(detail);
    }

    // 204 No Content
    if (res.status === 204) return undefined as T;
    return res.json() as Promise<T>;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Province {
    id: number;
    name: string;
}

export interface District {
    id: number;
    name: string;
    province: Province;
}

export interface Grade {
    id: number;
    name: string;
}

export interface AvatarCatalog {
    avatar_key: string;
    label: string;
}

export interface Subject {
    id: number;
    name: string;
    grade_id: number;
}

export interface StudentProfile {
    id: number;
    email: string | null;
    full_name: string | null;
    username: string | null;
    grade: Grade | null;
    district: District | null;
    province: Province | null;
    avatar_key: string | null;
    profile_completed: boolean;
}

export interface OnboardingPayload {
    full_name: string;
    username: string;
    grade_id: number;
    province_id: number;
    district_id: number;
    avatar_key: string;
    subject_ids: number[];
}

export interface ProfileUpdatePayload {
    full_name?: string;
    username?: string;
    grade_id?: number;
    province_id?: number;
    district_id?: number;
    avatar_key?: string;
}

export interface Resource {
    id: number;
    subject_id: number;
    type: string;
    title: string;
    description: string | null;
    view_url: string | null;
    file_url: string | null;
    storage_path: string | null;
}

export interface StudentCountOut {
    count: number;
}

export interface SubjectStat {
    subject_id: number;
    subject_name: string;
    total_quizzes: number;
    average_score: number;
    total_xp: number;
}

export interface RecentQuiz {
    attempt_id: number;
    session_id: number;
    subject_name: string;
    subject_id: number;
    score_percentage: number;
    xp_earned: number;
    total_correct: number;
    total_questions: number;
    completed_at: string;
}

export interface DashboardStats {
    total_xp: number;
    total_quizzes: number;
    average_score: number | null;
    subject_stats: SubjectStat[];
    recent_quizzes: RecentQuiz[];
}

export interface ReviewOption {
    id: number;
    option_text: string;
    is_correct: boolean;
}

export interface ReviewQuestion {
    id: number;
    question_text: string;
    difficulty: string;
    xp_value: number;
    topic_id: number;
    topic_name: string;
    options: ReviewOption[];
}

export interface ReviewAnswer {
    question_id: number;
    selected_option_id: number | null;
    is_correct: boolean;
    correct_option_id: number;
}

export interface QuizSessionReview {
    session_id: number;
    score_percentage: number;
    total_correct: number;
    total_questions: number;
    xp_earned: number;
    questions: ReviewQuestion[];
    results: ReviewAnswer[];
}

export interface DistrictLeaderboardEntry {
    rank: number;
    username: string | null;
    total_xp: number;
    is_current_user: boolean;
}

export interface DistrictLeaderboard {
    district_id: number;
    district_name: string;
    entries: DistrictLeaderboardEntry[];
}
// ─── Student Stats Types ─────────────────────────────────────────────────────

export interface SubjectXp {
    subject_id: number;
    subject_name: string;
    total_xp: number;
}

export interface RecentXpGain {
    question_id: number;
    question_text: string;
    difficulty: string;
    is_correct: boolean;
    xp_earned: number;
    bonus_xp: number;
    subject_name: string;
    completed_at: string;
}

export interface XpSummary {
    total_xp: number;
    total_bonus_xp: number;
    total_correct_answers: number;
    xp_per_subject: SubjectXp[];
    recent_xp_gains: RecentXpGain[];
}

export interface TopicProgress {
    topic_id: number;
    topic_name: string;
    attempted: boolean;
    accuracy_percentage: number;
}

export interface SubjectProgress {
    subject_id: number;
    subject_name: string;
    total_topics: number;
    topics_attempted: number;
    progress_percentage: number;
    average_accuracy: number;
    total_quizzes: number;
    total_xp: number;
    topics: TopicProgress[];
}

export interface QuizAnswerSummary {
    question_id: number;
    question_text: string;
    difficulty: string;
    is_correct: boolean;
    xp_earned: number;
    bonus_xp: number;
}

export interface QuizSummary {
    attempt_id: number;
    session_id: number;
    subject_name: string;
    mode: string;
    difficulty_profile: string;
    score_percentage: number;
    total_correct: number;
    total_questions: number;
    xp_earned: number;
    completed_at: string;
    answers: QuizAnswerSummary[];
}

export interface StudyStreak {
    current_streak: number;
    longest_streak: number;
    last_activity_date: string | null;
}

export interface LeaderboardEntry {
    rank: number;
    student_id: number;
    username: string | null;
    avatar_key: string | null;
    total_xp: number;
    is_current_user: boolean;
}

// ─── Chat / RAG Types ────────────────────────────────────────────────────────

export interface ChatRequest {
    question: string;
    subject?: string;
    topic_id?: number;
    session_id?: string;
}

export interface ChatSource {
    source_file: string;
    subject: string;
    page_start: string;
    page_end: string;
    distance: number;
}

export interface ChatResponse {
    answer: string;
    sources: ChatSource[];
    matched: boolean;
    session_id: string;
}

export interface ChatSubject {
    id: number;
    name: string;
}

export interface ChatTopic {
    id: number;
    name: string;
}

// ─── API Methods ──────────────────────────────────────────────────────────────

export const api = {
    // ── Meta (public — no auth needed) ──
    getProvinces: () =>
        request<Province[]>("/api/v1/meta/provinces", null),

    getDistricts: (provinceId?: number) =>
        request<District[]>(
            `/api/v1/meta/districts${provinceId ? `?province_id=${provinceId}` : ""}`,
            null
        ),

    getGrades: () =>
        request<Grade[]>("/api/v1/meta/grades", null),

    getAvatars: () =>
        request<AvatarCatalog[]>("/api/v1/meta/avatars", null),

    // ── Profile ──
    getProfile: (token: string, xClerkUserId?: string, xEmail?: string) =>
        request<StudentProfile>("/api/v1/me/profile", token, { xClerkUserId, xEmail }),

    completOnboarding: (token: string, payload: OnboardingPayload, xClerkUserId?: string, xEmail?: string) =>
        request<StudentProfile>("/api/v1/me/onboarding", token, {
            method: "POST",
            body: JSON.stringify(payload),
            xClerkUserId,
            xEmail,
        }),

    updateProfile: (token: string, payload: ProfileUpdatePayload, xClerkUserId?: string, xEmail?: string) =>
        request<StudentProfile>("/api/v1/me/profile", token, {
            method: "PUT",
            body: JSON.stringify(payload),
            xClerkUserId,
            xEmail,
        }),

    // ── Subjects ──
    getAvailableSubjects: (gradeId?: number) =>
        request<Subject[]>(
            `/api/v1/subjects/available${gradeId ? `?grade_id=${gradeId}` : ""}`,
            null
        ),


    getMySubjects: (token: string, xClerkUserId?: string, xEmail?: string) =>
        request<Subject[]>("/api/v1/me/subjects", token, { xClerkUserId, xEmail }),

    updateMySubjects: (token: string, subjectIds: number[], xClerkUserId?: string, xEmail?: string) =>
        request<{ subject_ids: number[] }>("/api/v1/me/subjects", token, {
            method: "PUT",
            body: JSON.stringify({ subject_ids: subjectIds }),
            xClerkUserId,
            xEmail,
        }),

    // ── Resources ──
    getResources: (token: string, subjectId: number, type?: string, xClerkUserId?: string, xEmail?: string) =>
        request<Resource[]>(
            `/api/v1/resources?subject_id=${subjectId}${type ? `&type=${type}` : ""}`,
            token,
            { xClerkUserId, xEmail }
        ),

    // ── Quiz ──
    getTopics: (subjectId: number) =>
        request<{ id: number; name: string }[]>(
            `/api/v1/quiz/topics?subject_id=${subjectId}`,
            null
        ),

    startQuiz: (token: string, payload: {
        student_id?: number;
        subject_id: number;
        mode: "term" | "topic";
        topic_id?: number;
    }, xClerkUserId?: string, xEmail?: string) =>
        request<unknown>("/api/v1/quiz/start", token, {
            method: "POST",
            body: JSON.stringify(payload),
            xClerkUserId,
            xEmail,
        }),

    submitQuiz: (token: string, payload: unknown, xClerkUserId?: string, xEmail?: string) =>
        request<unknown>("/api/v1/quiz/submit", token, {
            method: "POST",
            body: JSON.stringify(payload),
            xClerkUserId,
            xEmail,
        }),

    // ── Dashboard Stats ──
    getDashboardStats: (token: string, xClerkUserId?: string, xEmail?: string) =>
        request<DashboardStats>("/api/v1/me/dashboard-stats", token, { xClerkUserId, xEmail }),

    // ── Quiz Session Review (for past quiz lookup from dashboard) ──
    getQuizSessionReview: (token: string, sessionId: number, xClerkUserId?: string, xEmail?: string) =>
        request<QuizSessionReview>(`/api/v1/quiz/session/${sessionId}/review`, token, { xClerkUserId, xEmail }),

    // ── District Leaderboard ──
    getDistrictLeaderboard: (token: string, districtId?: number, xClerkUserId?: string, xEmail?: string) =>
        request<DistrictLeaderboard>(
            `/api/v1/me/district-leaderboard${districtId ? `?district_id=${districtId}` : ""}`,
            token,
            { xClerkUserId, xEmail }
        ),

    // ── Chat / RAG ──
    getChatSubjects: () =>
        request<ChatSubject[]>("/api/v1/chat/subjects", null),

    getChatTopics: (subjectId: number) =>
        request<ChatTopic[]>(`/api/v1/chat/subjects/${subjectId}/topics`, null),

    askChat: (token: string, payload: ChatRequest, xClerkUserId?: string, xEmail?: string) =>
        request<ChatResponse>("/api/v1/chat/ask", token, {
            method: "POST",
            body: JSON.stringify(payload),
            xClerkUserId,
            xEmail,
        }),

    // ── Student Stats ──
    getXpSummary: (token: string, xClerkUserId?: string, xEmail?: string) =>
        request<XpSummary>("/api/v1/me/xp-summary", token, { xClerkUserId, xEmail }),

    getSubjectProgress: (token: string, xClerkUserId?: string, xEmail?: string) =>
        request<SubjectProgress[]>("/api/v1/me/subject-progress", token, { xClerkUserId, xEmail }),

    getRecentQuizzes: (token: string, xClerkUserId?: string, xEmail?: string) =>
        request<QuizSummary[]>("/api/v1/me/recent-quizzes", token, { xClerkUserId, xEmail }),

    getStudyStreak: (token: string, xClerkUserId?: string, xEmail?: string) =>
        request<StudyStreak>("/api/v1/me/study-streak", token, { xClerkUserId, xEmail }),

    getLeaderboard: (token: string, xClerkUserId?: string, xEmail?: string) =>
        request<LeaderboardEntry[]>("/api/v1/me/leaderboard", token, { xClerkUserId, xEmail }),

    // ── Admin ──
    getStudentCount: (adminApiKey: string) =>
        request<StudentCountOut>("/api/v1/admin/stats/student-count", null, {
            headers: { "X-Admin-Api-Key": adminApiKey },
        }),
};
