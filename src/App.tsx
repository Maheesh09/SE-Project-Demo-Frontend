import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import SubjectPage from "./pages/SubjectPage";
import Leaderboard from "./pages/Leaderboard";
import Notes from "./pages/Notes";
import Planner from "./pages/Planner";
import ExamReadiness from "./pages/ExamReadiness";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/subject/:subjectId" element={<SubjectPage />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/exam-readiness" element={<ExamReadiness />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
