import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Square, Mic, MicOff, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VoiceCoachProps {
  onClose: () => void;
  workoutType: string;
}

export const VoiceCoach = ({ onClose, workoutType }: VoiceCoachProps) => {
  const [isRunning, setIsRunning] = useState(false);
  const [duration, setDuration] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [currentPhase, setCurrentPhase] = useState('warmup');
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

  const handleStart = () => {
    setIsRunning(true);
    setIsListening(true);
    toast({
      title: "Workout started!",
      description: "Your AI coach is now tracking your session",
    });
    
    // Simulate voice coaching
    setTimeout(() => {
      toast({
        title: "Coach says:",
        description: "Great pace! Keep it up!",
      });
    }, 30000);
  };

  const handlePause = () => {
    setIsRunning(false);
    setIsListening(false);
  };

  const handleStop = () => {
    setIsRunning(false);
    setIsListening(false);
    toast({
      title: "Workout complete!",
      description: `Total time: ${formatTime(duration)}`,
    });
    onClose();
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    toast({
      title: isListening ? "Voice disabled" : "Voice enabled",
      description: isListening ? "Coach will no longer listen" : "Coach is listening for commands",
    });
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gradient-card border-coach-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="capitalize">{workoutType} Session</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Timer Display */}
          <div className="text-center space-y-2">
            <div className="text-4xl font-bold text-coach-red">
              {formatTime(duration)}
            </div>
            <Badge variant="secondary" className="capitalize">
              {currentPhase}
            </Badge>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-coach-card-hover rounded-lg">
              <div className="text-lg font-semibold text-coach-red">145</div>
              <div className="text-xs text-muted-foreground">Heart Rate</div>
            </div>
            <div className="text-center p-3 bg-coach-card-hover rounded-lg">
              <div className="text-lg font-semibold text-coach-red">6.2</div>
              <div className="text-xs text-muted-foreground">km/h Pace</div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            {!isRunning ? (
              <Button 
                variant="coach" 
                size="lg"
                onClick={handleStart}
                className="rounded-full w-16 h-16"
              >
                <Play className="w-6 h-6" />
              </Button>
            ) : (
              <>
                <Button 
                  variant="coach-outline" 
                  size="lg"
                  onClick={handlePause}
                  className="rounded-full w-12 h-12"
                >
                  <Pause className="w-4 h-4" />
                </Button>
                <Button 
                  variant="destructive" 
                  size="lg"
                  onClick={handleStop}
                  className="rounded-full w-12 h-12"
                >
                  <Square className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>

          {/* Voice Controls */}
          <div className="flex items-center justify-between p-3 bg-coach-card-hover rounded-lg">
            <div className="flex items-center gap-2">
              {isListening ? (
                <Mic className="w-4 h-4 text-coach-red" />
              ) : (
                <MicOff className="w-4 h-4 text-muted-foreground" />
              )}
              <span className="text-sm">Voice Coach</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={toggleListening}
            >
              {isListening ? 'Disable' : 'Enable'}
            </Button>
          </div>

          {/* Tips */}
          <div className="text-center p-3 bg-coach-red/10 rounded-lg">
            <p className="text-sm text-coach-red">
              💡 Say "Coach" to get real-time feedback during your workout
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};