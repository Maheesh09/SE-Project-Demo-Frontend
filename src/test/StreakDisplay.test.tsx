import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import StreakDisplay from "@/components/StreakDisplay";

// ── Mock Framer Motion (avoids animation complexity in tests) ──────────────────
vi.mock("framer-motion", () => ({
    motion: {
        div: ({ children, className, ...rest }: React.HTMLAttributes<HTMLDivElement>) => (
            <div className={className} {...rest}>{children}</div>
        ),
        button: ({ children, className, onClick, disabled, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
            <button className={className} onClick={onClick} disabled={disabled} {...rest}>{children}</button>
        ),
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// ── Mock useToast ─────────────────────────────────────────────────────────────
const mockToast = vi.fn();
vi.mock("@/hooks/use-toast", () => ({
    useToast: () => ({ toast: mockToast }),
}));

// ── useStreak mock factory ─────────────────────────────────────────────────────
const mockCompleteStreak = vi.fn();
let mockUseStreakReturn: ReturnType<typeof import("@/hooks/useStreak").useStreak>;

vi.mock("@/hooks/useStreak", () => ({
    useStreak: () => mockUseStreakReturn,
}));

const baseStreak = {
    isLoading: false,
    error: null,
    isCompleting: false,
    refetch: vi.fn(),
    completeStreak: mockCompleteStreak,
};

beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
});

// ─────────────────────────────────────────────────────────────────────────────
describe("StreakDisplay", () => {

    it("shows loading skeleton when isLoading is true", () => {
        mockUseStreakReturn = { ...baseStreak, streak: null, isLoading: true };
        render(<StreakDisplay />);
        // Loading state renders a skeleton with specific ID
        expect(document.getElementById("streak-display-loading")).toBeTruthy();
        // Main streak card should NOT be present
        expect(document.getElementById("streak-display")).toBeFalsy();
    });

    it("shows error state with retry button when error occurs", () => {
        mockUseStreakReturn = { ...baseStreak, streak: null, error: "Network error" };
        render(<StreakDisplay />);
        expect(document.getElementById("streak-display-error")).toBeTruthy();
        expect(screen.getByText(/Couldn't load your streak/i)).toBeTruthy();
        expect(document.getElementById("streak-retry-btn")).toBeTruthy();
    });

    it("retry button calls refetch", () => {
        const refetch = vi.fn();
        mockUseStreakReturn = { ...baseStreak, streak: null, error: "err", refetch };
        render(<StreakDisplay />);
        fireEvent.click(document.getElementById("streak-retry-btn")!);
        expect(refetch).toHaveBeenCalledOnce();
    });

    it("shows empty state when streak is 0 and no history", () => {
        mockUseStreakReturn = {
            ...baseStreak,
            streak: { current_streak: 0, longest_streak: 0, last_completed_date: null },
        };
        render(<StreakDisplay />);
        expect(screen.getByText(/Complete your first task/i)).toBeTruthy();
    });

    it("shows active streak count", () => {
        mockUseStreakReturn = {
            ...baseStreak,
            streak: { current_streak: 5, longest_streak: 7, last_completed_date: null },
        };
        render(<StreakDisplay />);
        expect(screen.getByText("5")).toBeTruthy();
        expect(screen.getByText(/Best: 7d/i)).toBeTruthy();
    });

    it("shows broken state when current_streak is 0 but longest > 0", () => {
        mockUseStreakReturn = {
            ...baseStreak,
            streak: { current_streak: 0, longest_streak: 3, last_completed_date: "2024-01-01" },
        };
        render(<StreakDisplay />);
        expect(screen.getByText("Broken")).toBeTruthy();
    });

    it("fires broken streak toast once", async () => {
        mockUseStreakReturn = {
            ...baseStreak,
            streak: { current_streak: 0, longest_streak: 3, last_completed_date: "2024-01-01" },
        };
        render(<StreakDisplay />);
        await waitFor(() => {
            expect(mockToast).toHaveBeenCalledWith(
                expect.objectContaining({ title: "Streak Broken 💔" })
            );
        });
    });

    it("shows 'Completed Today' when last_completed_date is today", () => {
        const today = new Date().toISOString().split("T")[0];
        mockUseStreakReturn = {
            ...baseStreak,
            streak: { current_streak: 4, longest_streak: 7, last_completed_date: today },
        };
        render(<StreakDisplay />);
        expect(screen.getByText(/Completed Today/i)).toBeTruthy();
        expect(document.getElementById("streak-complete-btn")).toBeDisabled();
    });

    it("calls completeStreak and shows success toast on click", async () => {
        mockCompleteStreak.mockResolvedValue({
            status: "streak_updated",
            message: "Streak incremented.",
            current_streak: 3,
            longest_streak: 7,
        });
        mockUseStreakReturn = {
            ...baseStreak,
            streak: { current_streak: 2, longest_streak: 7, last_completed_date: "2024-01-01" },
            completeStreak: mockCompleteStreak,
        };
        render(<StreakDisplay />);
        const btn = document.getElementById("streak-complete-btn")!;
        expect(btn).not.toBeDisabled();
        fireEvent.click(btn);
        await waitFor(() => expect(mockCompleteStreak).toHaveBeenCalledOnce());
        await waitFor(() =>
            expect(mockToast).toHaveBeenCalledWith(
                expect.objectContaining({ title: "3 Day streak! 🔥" })
            )
        );
    });

    it("shows spinner when isCompleting is true", () => {
        mockUseStreakReturn = {
            ...baseStreak,
            streak: { current_streak: 2, longest_streak: 5, last_completed_date: null },
            isCompleting: true,
        };
        render(<StreakDisplay />);
        expect(screen.getByText(/Saving/i)).toBeTruthy();
    });
});
