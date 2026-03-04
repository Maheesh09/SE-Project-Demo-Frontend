import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";

import Index from "./pages/Index";
import CoursesPage from "./pages/CoursesPage";
import QuizzesPage from "./pages/QuizzesPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import ChatbotPage from "./pages/ChatbotPage";
import SettingsPage from "./pages/SettingsPage";
import LogoutPage from "./pages/LogoutPage";
import RegisterPage from "./pages/RegisterPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import CompleteProfilePage from "./pages/CompleteProfilePage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import SubjectPage from "./pages/SubjectPage";
import SubjectQuizzesPage from "./pages/SubjectQuizzesPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Wraps routes that require a completed profile
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isProfileComplete } = useAuth();
  if (!isProfileComplete) return <Navigate to="/complete-profile" replace />;
  return <>{children}</>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isProfileComplete } = useAuth();
  if (isProfileComplete) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    {/* Redirect /login to the dashboard (login page removed) */}
    <Route path="/login" element={<Navigate to="/" replace />} />

    {/* Public Auth Routes */}
    <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
    <Route path="/verify-email" element={<EmailVerificationPage />} />
    <Route path="/complete-profile" element={<CompleteProfilePage />} />
    <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />

    {/* Protected */}
    <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
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
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
