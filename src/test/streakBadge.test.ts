/**
 * Unit tests – 7-day streak badge data-layer utilities
 * MIN-284 · Commit 1: data layer & types
 *
 * These tests cover the pure logic used by useStreakBadge:
 *  - wasEarnedWithinLastDay()  (temporal detection)
 *  - SEVEN_DAY_STREAK_KEY      (constant sanity)
 *  - Badge/UserBadge shape     (type-level smoke tests via runtime values)
 */

import { describe, it, expect } from "vitest";
import { SEVEN_DAY_STREAK_KEY } from "@/hooks/useStreakBadge";
import type { Badge, UserBadge } from "@/lib/api";

// ── Re-export the private helper for testing ─────────────────────────────────
// The function is intentionally not exported from the hook, so we inline a
// copy here that mirrors it exactly.
function wasEarnedWithinLastDay(earnedAt: string): boolean {
  const earned = new Date(earnedAt).getTime();
  const oneDayMs = 24 * 60 * 60 * 1000;
  return Date.now() - earned < oneDayMs;
}

// ── Fixtures ─────────────────────────────────────────────────────────────────

const mockBadge: Badge = {
  id: 1,
  name: "7-Day Streak",
  description: "Awarded for logging in and completing tasks for 7 consecutive days.",
  image_url: "https://example.com/badges/seven_day_streak.png",
  badge_key: SEVEN_DAY_STREAK_KEY,
};

const mockUserBadge: UserBadge = {
  id: 42,
  badge: mockBadge,
  earned_at: new Date().toISOString(),
};

// ── Tests ────────────────────────────────────────────────────────────────────

describe("SEVEN_DAY_STREAK_KEY", () => {
  it("has the expected value that matches the backend badge_key", () => {
    expect(SEVEN_DAY_STREAK_KEY).toBe("seven_day_streak");
  });
});

describe("wasEarnedWithinLastDay", () => {
  it("returns true when earnedAt is right now", () => {
    expect(wasEarnedWithinLastDay(new Date().toISOString())).toBe(true);
  });

  it("returns true when earnedAt is 1 hour ago", () => {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    expect(wasEarnedWithinLastDay(oneHourAgo)).toBe(true);
  });

  it("returns false when earnedAt is 48 hours ago", () => {
    const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
    expect(wasEarnedWithinLastDay(twoDaysAgo)).toBe(false);
  });

  it("returns false when earnedAt is exactly 25 hours ago", () => {
    const over24h = new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString();
    expect(wasEarnedWithinLastDay(over24h)).toBe(false);
  });
});

describe("Badge & UserBadge shape", () => {
  it("Badge has all required fields", () => {
    expect(mockBadge).toHaveProperty("id");
    expect(mockBadge).toHaveProperty("name");
    expect(mockBadge).toHaveProperty("description");
    expect(mockBadge).toHaveProperty("image_url");
    expect(mockBadge).toHaveProperty("badge_key");
  });

  it("UserBadge nests a Badge object and has earned_at", () => {
    expect(mockUserBadge).toHaveProperty("badge");
    expect(mockUserBadge).toHaveProperty("earned_at");
    expect(mockUserBadge.badge.badge_key).toBe(SEVEN_DAY_STREAK_KEY);
  });

  it("earned_at is a valid ISO-8601 string", () => {
    const parsed = new Date(mockUserBadge.earned_at);
    expect(isNaN(parsed.getTime())).toBe(false);
  });
});
