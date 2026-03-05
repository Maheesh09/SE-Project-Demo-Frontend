/**
 * useProfile  — fetches and caches the student profile from the backend.
 *
 * Returns:
 *   profile          – StudentProfile | null
 *   isLoading        – boolean
 *   error            – string | null
 *   refetch()        – manually re-fetch
 */
import { useState, useEffect, useCallback } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { api, type StudentProfile } from "@/lib/api";

export interface UseProfileResult {
    profile: StudentProfile | null;
    isLoading: boolean;
    error: string | null;
    refetch: () => void;
}

export function useProfile(): UseProfileResult {
    const { getToken, isLoaded, isSignedIn } = useAuth();
    const { user } = useUser();
    const [profile, setProfile] = useState<StudentProfile | null>(null);
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
                const data = await api.getProfile(token, user?.id, email);

                if (!cancelled) setProfile(data);
            } catch (e: any) {
                if (!cancelled) setError(e.message ?? "Failed to load profile.");
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        })();

        return () => { cancelled = true; };
    }, [isLoaded, isSignedIn, getToken, tick, user]);

    return { profile, isLoading, error, refetch };
}
