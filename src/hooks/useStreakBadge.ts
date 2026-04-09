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
import { api, type UserBadge } from "@/lib/api";

/** badge_key used by the backend for the 7-day streak badge */
export const SEVEN_DAY_STREAK_KEY = "seven_day_streak";

const SEEN_STORAGE_KEY = "mindup_streak_badge_seen";

function wasEarnedWithinLastDay(earnedAt: string): boolean {
  const earned = new Date(earnedAt).getTime();
  const oneDayMs = 24 * 60 * 60 * 1000;
  return Date.now() - earned < oneDayMs;
}

export interface UseStreakBadgeResult {
  badges: UserBadge[];
  streakBadge: UserBadge | null;
  newlyEarned: boolean;
  isLoading: boolean;
  dismissToast: () => void;
  refetch: () => void;
}

export function useStreakBadge(): UseStreakBadgeResult {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  const [badges, setBadges] = useState<UserBadge[]>([]);
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
        const data = await api.getBadges(token, user?.id, email);

        if (cancelled) return;

        setBadges(data);

        // Determine whether to show the celebration toast
        const streak = data.find(
          (ub) => ub.badge.badge_key === SEVEN_DAY_STREAK_KEY
        );

        if (streak) {
          const alreadySeen = localStorage.getItem(SEEN_STORAGE_KEY) === "true";
          const isNew = wasEarnedWithinLastDay(streak.earned_at);
          setNewlyEarned(isNew && !alreadySeen);
        } else {
          setNewlyEarned(false);
        }
      } catch {
        // Badge endpoint may not exist yet in staging; fail silently
        if (!cancelled) setBadges([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn, getToken, tick, user]);

  const streakBadge =
    badges.find((ub) => ub.badge.badge_key === SEVEN_DAY_STREAK_KEY) ?? null;

  return { badges, streakBadge, newlyEarned, isLoading, dismissToast, refetch };
}
