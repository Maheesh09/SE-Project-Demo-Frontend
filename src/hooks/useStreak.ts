import { useState, useEffect, useCallback } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { api, type StudyStreak, type StreakCompleteResponse } from "@/lib/api";

export interface UseStreakResult {
    streak: StudyStreak | null;
    isLoading: boolean;
    error: string | null;
    isCompleting: boolean;
    refetch: () => void;
    completeStreak: () => Promise<StreakCompleteResponse | null>;
}

export function useStreak(): UseStreakResult {
    const { getToken, isLoaded, isSignedIn } = useAuth();
    const { user } = useUser();
    const [streak, setStreak] = useState<StudyStreak | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isCompleting, setIsCompleting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [tick, setTick] = useState(0);

    const refetch = useCallback(() => setTick((t) => t + 1), []);

    useEffect(() => {
        if (!isLoaded || !isSignedIn) {
            setIsLoading(false);
            return;
        }

        let cancelled = false;
        setIsLoading(true);
        setError(null);

        (async () => {
            try {
                const token = await getToken();
                if (!token) throw new Error("No auth token available.");

                const email = user?.primaryEmailAddress?.emailAddress || "";

                // Try new endpoint first, fall back to legacy
                let data: StudyStreak;
                try {
                    data = await api.getDailyStreak(token, user?.id, email);
                    // Normalise: ensure legacy field is also populated for backward compatibility
                    data.last_activity_date = data.last_completed_date;
                } catch {
                    data = await api.getStudyStreak(token, user?.id, email);
                    // Normalise legacy response to use new field name
                    data.last_completed_date = data.last_activity_date ?? null;
                }

                if (!cancelled) setStreak(data);
            } catch (e: unknown) {
                const msg = e instanceof Error ? e.message : "Failed to load streak data.";
                if (!cancelled) setError(msg);
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [isLoaded, isSignedIn, getToken, tick, user]);

    const completeStreak = useCallback(async (): Promise<StreakCompleteResponse | null> => {
        if (!isSignedIn) return null;
        setIsCompleting(true);
        try {
            const token = await getToken();
            if (!token) throw new Error("No auth token.");
            const email = user?.primaryEmailAddress?.emailAddress || "";
            const result = await api.completeDailyStreak(token, user?.id, email);
            // Refresh streak display after completion
            setStreak((prev) =>
                prev
                    ? {
                          ...prev,
                          current_streak: result.current_streak,
                          longest_streak: result.longest_streak,
                          last_completed_date: new Date().toISOString().split("T")[0],
                          last_activity_date: new Date().toISOString().split("T")[0],
                      }
                    : prev
            );
            return result;
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : "Failed to complete streak.";
            setError(msg);
            return null;
        } finally {
            setIsCompleting(false);
        }
    }, [isSignedIn, getToken, user]);

    return { streak, isLoading, error, isCompleting, refetch, completeStreak };
}
