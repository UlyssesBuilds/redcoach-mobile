import { Activity, Loader2 } from 'lucide-react';

export const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto shadow-glow animate-pulse">
          <Activity className="w-10 h-10 text-white" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            RedCoach
          </h1>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading your fitness journey...</span>
          </div>
        </div>
      </div>
    </div>
  );
};