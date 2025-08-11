import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { AuthScreen } from "@/pages/AuthScreen";
import { OnboardingScreen } from "@/pages/OnboardingScreen";
import { Dashboard } from "@/pages/Dashboard";
import { LoadingScreen } from "@/components/LoadingScreen";

const queryClient = new QueryClient();

const AppContent = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <AuthScreen />;
  }

  if (!user.onboardingCompleted) {
    return <OnboardingScreen />;
  }

  return <Dashboard />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <div className="dark">
          <Toaster />
          <Sonner />
          <AppContent />
        </div>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
