import { useState, useEffect, useCallback } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { api, type StudyStreak } from "@/lib/api";

export interface UseStreakResult {
    streak: StudyStreak | null;
    isLoading: boolean;
    error: string | null;
    refetch: () => void;
}

export function useStreak(): UseStreakResult {
    const { getToken, isLoaded, isSignedIn } = useAuth();
    const { user } = useUser();
    const [streak, setStreak] = useState<StudyStreak | null>(null);
    const [isLoading, setIsLoading] = useState(true);
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
                const data = await api.getStudyStreak(token, user?.id, email);

                if (!cancelled) setStreak(data);
            } catch (e: any) {
                if (!cancelled) setError(e.message ?? "Failed to load streak data.");
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [isLoaded, isSignedIn, getToken, tick, user]);

    return { streak, isLoading, error, refetch };
}
