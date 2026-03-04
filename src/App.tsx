import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ClerkProvider, SignIn, SignUp, SignedIn, SignedOut } from "@clerk/clerk-react";
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
import NotFound from "./pages/NotFound";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY");
}

const queryClient = new QueryClient();

// Wraps routes that require Clerk authentication
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => (
  <>
    <SignedIn>{children}</SignedIn>
    <SignedOut>
      <Navigate to="/login" replace />
    </SignedOut>
  </>
);

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
                  <SignUp routing="path" path="/signup" signInUrl="/login" afterSignUpUrl="/dashboard" />
                </div>
              }
            />

            {/* Protected dashboard routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/courses" element={<ProtectedRoute><CoursesPage /></ProtectedRoute>} />
            <Route path="/quizzes" element={<ProtectedRoute><QuizzesPage /></ProtectedRoute>} />
            <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
            <Route path="/chatbot" element={<ProtectedRoute><ChatbotPage /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
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
