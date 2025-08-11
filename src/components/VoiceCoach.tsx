import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Play, Pause, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VoiceCoachProps {
  onClose: () => void;
  workoutType: string;
}

export const VoiceCoach = ({ onClose, workoutType }: VoiceCoachProps) => {
  const [isRunning, setIsRunning] = useState(false);
  const [duration, setDuration] = useState(0);
  const [showGoalPrompt, setShowGoalPrompt] = useState(true);
  const [goal, setGoal] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleGoalSubmit = () => {
    if (goal.trim()) {
      setShowGoalPrompt(false);
      setIsRunning(true);
      toast({
        title: "Workout started!",
        description: `Goal: ${goal}`,
      });
      
      // Simulate AI coach feedback based on goal
      setTimeout(() => {
        toast({
          title: "Coach says:",
          description: "Great start! Keep your pace steady.",
        });
      }, 15000);
    }
  };

  const handlePause = () => {
    setIsRunning(!isRunning);
  };

  const handleStop = () => {
    toast({
      title: "Workout complete!",
      description: `Total time: ${formatTime(duration)}`,
    });
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleGoalSubmit();
    }
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-coach-border">
        <h1 className="text-xl font-semibold capitalize text-coach-red">
          {workoutType} Session
        </h1>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-6 h-6" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        {showGoalPrompt ? (
          <div className="w-full max-w-md space-y-6 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-8">
              What is your goal today?
            </h2>
            <Input
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g., Run 5km, Burn 300 calories..."
              className="text-center text-lg h-12"
              autoFocus
            />
            <Button 
              variant="coach" 
              className="w-full h-12 text-lg"
              onClick={handleGoalSubmit}
              disabled={!goal.trim()}
            >
              Start Workout
            </Button>
          </div>
        ) : (
          <div className="text-center space-y-8">
            {/* Timer */}
            <div className="text-8xl font-bold text-coach-red font-mono">
              {formatTime(duration)}
            </div>
            
            {/* Goal Display */}
            <div className="text-lg text-muted-foreground max-w-md">
              Goal: {goal}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      {!showGoalPrompt && (
        <div className="p-8 flex items-center justify-center gap-8">
          <Button 
            variant={isRunning ? "coach-outline" : "coach"}
            size="lg"
            onClick={handlePause}
            className="rounded-full w-20 h-20"
          >
            {isRunning ? (
              <Pause className="w-8 h-8" />
            ) : (
              <Play className="w-8 h-8" />
            )}
          </Button>
          
          <Button 
            variant="destructive" 
            size="lg"
            onClick={handleStop}
            className="rounded-full w-20 h-20"
          >
            <X className="w-8 h-8" />
          </Button>
        </div>
      )}
    </div>
  );
};