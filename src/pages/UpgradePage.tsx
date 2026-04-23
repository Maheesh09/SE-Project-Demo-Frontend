import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Sparkles, Zap, Crown, Users, Building2, ArrowRight } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type Workspace = "personal" | "teams";
type Cadence = "monthly" | "yearly";

interface Plan {
  id: string;
  name: string;
  tagline: string;
  monthly: number | null;
  yearly: number | null;
  Icon: typeof Sparkles;
  highlight?: boolean;
  cta: string;
  ctaVariant: "default" | "outline";
  features: string[];
  current?: boolean;
}

// ─── Plans (kept compact — 4 features each) ──────────────────────────────────

const PERSONAL: Plan[] = [
  {
    id: "free",
    name: "Free",
    tagline: "Try the basics",
    monthly: 0, yearly: 0,
    Icon: Sparkles,
    cta: "Current plan",
    ctaVariant: "outline",
    current: true,
    features: [
      "3 quizzes per day",
      "Basic AI tutor — 50 q/mo",
      "Community leaderboard",
      "Streaks & badges",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "Everything for serious students",
    monthly: 590, yearly: 4990,
    Icon: Zap,
    highlight: true,
    cta: "Get Pro",
    ctaVariant: "default",
    features: [
      "Unlimited quizzes & AI tutor",
      "All leaderboards (district / national)",
      "Personalised study schedule",
      "Streak insurance + analytics",
    ],
  },
  {
    id: "champion",
    name: "Champion",
    tagline: "Add real human help",
    monthly: 1290, yearly: 10900,
    Icon: Crown,
    cta: "Get Champion",
    ctaVariant: "outline",
    features: [
      "Everything in Pro",
      "Weekly 1-on-1 tutor session",
      "Past-paper marking & feedback",
      "Parent dashboard + custom plan",
    ],
  },
];

const TEAMS: Plan[] = [
  {
    id: "class",
    name: "Class",
    tagline: "For a single classroom",
    monthly: 4990, yearly: 49900,
    Icon: Users,
    highlight: true,
    cta: "Start a Class",
    ctaVariant: "default",
    features: [
      "Up to 30 students included",
      "Teacher dashboard + class leaderboard",
      "Bulk quiz assignments",
      "All Pro features for every student",
    ],
  },
  {
    id: "school",
    name: "School",
    tagline: "For an entire school",
    monthly: null, yearly: null,
    Icon: Building2,
    cta: "Talk to sales",
    ctaVariant: "outline",
    features: [
      "Unlimited students & classes",
      "Admin console + custom branding",
      "SSO (Google / Microsoft)",
      "Dedicated success manager",
    ],
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

const UpgradePage = () => {
  const [workspace, setWorkspace] = useState<Workspace>("personal");
  const [cadence, setCadence] = useState<Cadence>("yearly");

  const plans = workspace === "personal" ? PERSONAL : TEAMS;

  const handleSelect = (plan: Plan) => {
    if (plan.current) return;
    if (plan.monthly === null) {
      window.location.href = "mailto:hello@mindup.lk?subject=MindUp%20School%20Plan";
      return;
    }
    alert(`Checkout for "${plan.name}" — coming soon.`);
  };

  return (
    <AppLayout>
      {/* Outer wrapper — fills the AppLayout's content area to viewport height
          and arranges everything in a vertical flex column so the cards stretch
          to fill remaining space. AppLayout adds ~24px vertical padding on md+,
          plus mobile top nav (~50px on mobile only). */}
      <div className="md:min-h-[calc(100vh-3rem)] min-h-[calc(100vh-7rem)] flex flex-col">

        {/* ── Hero (compact) ── */}
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-4 md:mb-5"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
            Upgrade your plan
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Pick the workspace that fits how you study.
          </p>
        </motion.div>

        {/* ── Tabs + billing toggle (one row) ── */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 mb-5 md:mb-6">
          {/* Workspace tabs */}
          <div className="relative inline-flex items-center bg-muted/60 border border-border/60 rounded-full p-1 shadow-sm">
            {(["personal", "teams"] as Workspace[]).map((w) => {
              const active = workspace === w;
              return (
                <button
                  key={w}
                  onClick={() => setWorkspace(w)}
                  className={cn(
                    "relative z-10 px-5 py-1.5 text-xs sm:text-sm font-semibold rounded-full transition-colors duration-300",
                    active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {active && (
                    <motion.div
                      layoutId="workspace-tab-bg"
                      className="absolute inset-0 bg-card shadow-sm rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative capitalize">{w}</span>
                </button>
              );
            })}
          </div>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-2 text-xs">
            <button
              onClick={() => setCadence("monthly")}
              className={cn(
                "font-semibold transition-colors",
                cadence === "monthly" ? "text-foreground" : "text-muted-foreground/60 hover:text-foreground"
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setCadence(cadence === "yearly" ? "monthly" : "yearly")}
              role="switch"
              aria-checked={cadence === "yearly"}
              className="relative w-9 h-5 rounded-full border border-border transition-colors duration-300"
              style={{ background: cadence === "yearly" ? "hsl(var(--primary))" : "hsl(var(--muted))" }}
            >
              <span
                className="absolute top-0.5 w-4 h-4 rounded-full bg-card shadow transition-all duration-300 ease-quint"
                style={{ left: cadence === "yearly" ? "calc(100% - 18px)" : "2px" }}
              />
            </button>
            <button
              onClick={() => setCadence("yearly")}
              className={cn(
                "font-semibold flex items-center gap-1.5 transition-colors",
                cadence === "yearly" ? "text-foreground" : "text-muted-foreground/60 hover:text-foreground"
              )}
            >
              Yearly
              <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-primary/15 text-primary border border-primary/20">−30%</span>
            </button>
          </div>
        </div>

        {/* ── Plans grid — fills remaining height on desktop ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={workspace}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "grid gap-3 md:gap-4 max-w-5xl w-full mx-auto flex-1",
              plans.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"
            )}
          >
            {plans.map((plan) => {
              const price = cadence === "yearly" ? plan.yearly : plan.monthly;
              const monthly = cadence === "yearly" && plan.yearly ? Math.round(plan.yearly / 12) : null;

              return (
                <div
                  key={plan.id}
                  className={cn(
                    "relative rounded-2xl p-4 md:p-5 flex flex-col transition-all duration-300 ease-quint",
                    plan.highlight
                      ? "bg-card border-2 border-primary shadow-md hover:shadow-lg"
                      : "bg-card border border-border/60 hover:border-border hover:shadow-md"
                  )}
                >
                  {/* Header row */}
                  <div className="flex items-center gap-2 mb-1">
                    <plan.Icon className={cn("w-4 h-4", plan.highlight ? "text-primary" : "text-muted-foreground")} />
                    <h3 className="text-sm md:text-base font-semibold text-foreground">{plan.name}</h3>
                    {plan.highlight && workspace === "personal" && (
                      <span className="ml-auto text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-primary/15 text-primary border border-primary/20">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] md:text-xs text-muted-foreground mb-3">{plan.tagline}</p>

                  {/* Price */}
                  <div className="mb-3">
                    {price === null ? (
                      <div className="text-2xl font-bold text-foreground tracking-tight">Custom</div>
                    ) : (
                      <>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-2xl md:text-3xl font-bold text-foreground tracking-tight tabular-nums">
                            {price === 0 ? "Rs 0" : `Rs ${price.toLocaleString()}`}
                          </span>
                          {price > 0 && (
                            <span className="text-[11px] text-muted-foreground font-medium">
                              / {cadence === "yearly" ? "yr" : "mo"}
                            </span>
                          )}
                        </div>
                        {monthly !== null && (
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            Rs {monthly.toLocaleString()}/mo · billed yearly
                          </p>
                        )}
                      </>
                    )}
                  </div>

                  {/* CTA */}
                  <Button
                    onClick={() => handleSelect(plan)}
                    disabled={plan.current}
                    variant={plan.ctaVariant}
                    size="sm"
                    className="w-full mb-4"
                  >
                    {plan.cta}
                    {!plan.current && plan.monthly !== null && <ArrowRight className="w-3.5 h-3.5" />}
                  </Button>

                  {/* Features */}
                  <ul className="space-y-1.5 text-[12px] md:text-[13px] text-foreground/85">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <Check className={cn("w-3.5 h-3.5 mt-0.5 flex-shrink-0", plan.highlight ? "text-primary" : "text-muted-foreground")} strokeWidth={2.5} />
                        <span className="leading-snug">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* ── Footer (small, single line) ── */}
        <p className="text-center text-[10px] md:text-[11px] text-muted-foreground mt-4 md:mt-5">
          Cancel anytime · 14-day money-back · Secure payments via PayHere
        </p>
      </div>
    </AppLayout>
  );
};

export default UpgradePage;
