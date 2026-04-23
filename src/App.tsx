import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ClerkProvider, SignIn, SignUp, useAuth } from "@clerk/clerk-react";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import CoursesPage from "./pages/CoursesPage";
import QuizzesPage from "./pages/QuizzesPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import ChatbotPage from "./pages/ChatbotPage";
import SettingsPage from "./pages/SettingsPage";
import LogoutPage from "./pages/LogoutPage";
import SubjectPage from "./pages/SubjectPage";
import SubjectQuizzesPage from "./pages/SubjectQuizzesPage";
import Countdown from "./pages/Countdown";
import CompleteProfilePage from "./pages/CompleteProfilePage";
import NotFound from "./pages/NotFound";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import QuizPlayPage from "./pages/QuizPlayPage";
import QuizReviewPage from "./pages/QuizReviewPage";
import UpgradePage from "./pages/UpgradePage";
import { useProfile } from "./hooks/useProfile";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY");
}

const queryClient = new QueryClient();

/**
 * ProtectedRoute — checks:
 * 1. User is signed in (Clerk)
 * 2. Backend profile is completed; if not → redirect to /complete-profile
 */
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn, isLoaded: authLoaded } = useAuth();
  const { profile, isLoading: profileLoading, error: profileError } = useProfile();

  // While Clerk auth or backend profile is loading, show a spinner
  if (!authLoaded || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <span className="w-10 h-10 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
      </div>
    );
  }

  // Not signed in → redirect to login
  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  // If there was a profile fetch error, still render the page so we don't
  // redirect to /complete-profile in an infinite loop. The page itself will
  // handle the null profile gracefully.
  if (profileError) {
    return <>{children}</>;
  }

  // Signed in but profile definitively not completed → force profile completion
  if (profile && !profile.profile_completed) {
    return <Navigate to="/complete-profile" replace />;
  }

  // Profile null but no error = still loading edge case, show children
  return <>{children}</>;
};

/**
 * CompleteProfileRoute — guards the /complete-profile page:
 * - Not signed in → /login
 * - Profile already completed → /dashboard
 * - Otherwise → show CompleteProfilePage
 */
const CompleteProfileRoute = () => {
  const { isSignedIn, isLoaded: authLoaded } = useAuth();
  const { profile, isLoading: profileLoading } = useProfile();

  if (!authLoaded || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <span className="w-10 h-10 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
      </div>
    );
  }

  if (!isSignedIn) return <Navigate to="/login" replace />;
  if (profile?.profile_completed) return <Navigate to="/dashboard" replace />;

  return <CompleteProfilePage />;
};


const App = () => (
  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/countdown" element={<Countdown />} />
            <Route
              path="/login/*"
              element={
                <div className="min-h-screen flex items-center justify-center bg-background">
                  <SignIn routing="path" path="/login" signUpUrl="/signup" afterSignInUrl="/dashboard" />
                </div>
              }
            />
            <Route
              path="/signup/*"
              element={
                <div className="min-h-screen flex items-center justify-center bg-background">
                  <SignUp routing="path" path="/signup" signInUrl="/login" afterSignUpUrl="/complete-profile" />
                </div>
              }
            />

            <Route path="/complete-profile" element={<CompleteProfileRoute />} />

            {/* Admin routes */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin/dashboard" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />

            {/* Protected dashboard routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/courses" element={<ProtectedRoute><CoursesPage /></ProtectedRoute>} />
            <Route path="/quizzes" element={<ProtectedRoute><QuizzesPage /></ProtectedRoute>} />
            <Route path="/quiz/play" element={<ProtectedRoute><QuizPlayPage /></ProtectedRoute>} />
            <Route path="/quiz/review" element={<ProtectedRoute><QuizReviewPage /></ProtectedRoute>} />
            <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
            <Route path="/chatbot" element={<ProtectedRoute><ChatbotPage /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
            <Route path="/upgrade" element={<ProtectedRoute><UpgradePage /></ProtectedRoute>} />
            <Route path="/subject/:id" element={<ProtectedRoute><SubjectPage /></ProtectedRoute>} />
            <Route path="/subject/:id/quizzes" element={<ProtectedRoute><SubjectQuizzesPage /></ProtectedRoute>} />
            <Route path="/logout" element={<ProtectedRoute><LogoutPage /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ClerkProvider>
);

export default App;
