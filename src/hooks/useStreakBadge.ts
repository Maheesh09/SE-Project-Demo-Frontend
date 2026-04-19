/**
 * useStreakBadge
 * ──────────────────────────────────────────────────────────────────────────
 * Fetches the current student's earned badges from the backend and:
 *   1. Exposes the full badge list for the "Earned Badges" section on the dashboard.
 *   2. Detects whether the 7-day streak badge was *just* earned (within the
 *      last 24 h) so the dashboard can show a one-time celebration toast.
 *
 * The "seen" state is persisted in localStorage so the toast is not repeated
 * on every page visit after the badge has been acknowledged.
 *
 * Returns:
 *   badges          – UserBadge[]          all earned badges
 *   streakBadge     – UserBadge | null     the 7-day streak badge, if earned
 *   newlyEarned     – boolean              true → show the celebration toast
 *   isLoading       – boolean
 *   dismissToast()  – marks the badge as "seen" so the toast disappears
 *   refetch()       – manually re-fetch
 */

import { useState, useEffect, useCallback } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { api, type UserBadge, type StudyStreak } from "@/lib/api";

/** badge_key used by the backend for the 7-day streak badge */
export const SEVEN_DAY_STREAK_KEY = "seven_day_streak";
export const SEVEN_DAY_STREAK_KEY_ALT = "7_day_streak";

const SEEN_STORAGE_KEY = "mindup_streak_badge_seen";

function wasEarnedRecently(earnedAt: string): boolean {
  try {
    const earned = new Date(earnedAt).getTime();
    if (isNaN(earned)) return false;
    // Allow up to 48 hours to be considered "new" for celebration purposes
    const twoDaysMs = 48 * 60 * 60 * 1000;
    return Date.now() - earned < twoDaysMs;
  } catch {
    return false;
  }
}

export interface UseStreakBadgeResult {
  badges: UserBadge[];
  streakBadge: UserBadge | null;
  newlyEarned: boolean;
  isLoading: boolean;
  streak: StudyStreak | null;
  dismissToast: () => void;
  refetch: () => void;
}

export function useStreakBadge(): UseStreakBadgeResult {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [streak, setStreak] = useState<StudyStreak | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tick, setTick] = useState(0);
  const [newlyEarned, setNewlyEarned] = useState(false);

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  const dismissToast = useCallback(() => {
    setNewlyEarned(false);
    try {
      localStorage.setItem(SEEN_STORAGE_KEY, "true");
    } catch {
      /* ignore – private-browsing mode */
    }
  }, []);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    (async () => {
      try {
        const token = await getToken();
        if (!token) return;

        const email = user?.primaryEmailAddress?.emailAddress ?? "";
        
        // Fetch badges and streak data in parallel
        const [badgeData, streakData] = await Promise.all([
          api.getBadges(token, user?.id, email),
          api.getStudyStreak(token, user?.id, email).catch(() => null)
        ]);

        if (cancelled) return;

        setBadges(badgeData);
        setStreak(streakData);

        // Determine whether to show the celebration toast
        // Find by key (multiple variants) OR by name if key fails
        const matchingStreakBadge = badgeData.find(
          (ub) => {
            const key = ub.badge.badge_key?.toLowerCase() || "";
            const name = ub.badge.name?.toLowerCase() || "";
            return (
              key === SEVEN_DAY_STREAK_KEY || 
              key === SEVEN_DAY_STREAK_KEY_ALT ||
              key === "streak_7_day" ||
              key === "7-day-streak" ||
              (name.includes("7") && name.includes("day") && name.includes("streak"))
            );
          }
        );

        if (matchingStreakBadge) {
          const alreadySeen = localStorage.getItem(SEEN_STORAGE_KEY) === "true";
          const isNew = wasEarnedRecently(matchingStreakBadge.earned_at);
          setNewlyEarned(isNew && !alreadySeen);
        } else {
          setNewlyEarned(false);
        }
      } catch (err) {
        console.error("Failed to fetch streak/badges:", err);
        if (!cancelled) {
          setBadges([]);
          setStreak(null);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn, getToken, tick, user]);

  const streakBadge =
    badges.find(
      (ub) => {
        const key = ub.badge.badge_key?.toLowerCase() || "";
        const name = ub.badge.name?.toLowerCase() || "";
        return (
          key === SEVEN_DAY_STREAK_KEY || 
          key === SEVEN_DAY_STREAK_KEY_ALT ||
          key === "streak_7_day" ||
          key === "7-day-streak" ||
          (name.includes("7") && name.includes("day") && name.includes("streak"))
        );
      }
    ) ?? null;

  return { badges, streakBadge, newlyEarned, isLoading, streak, dismissToast, refetch };
}
