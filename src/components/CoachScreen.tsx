import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Pause, Play, X, Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CoachScreenProps {
  onClose?: () => void;
  isFullScreen?: boolean;
}

type CoachState = 'greeting' | 'listening' | 'speaking' | 'paused' | 'stopped';

export const CoachScreen = ({ onClose, isFullScreen = false }: CoachScreenProps) => {
  const [coachState, setCoachState] = useState<CoachState>('greeting');
  const [coachMessage, setCoachMessage] = useState("What is today's goal..");
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const { toast } = useToast();

  // Simulate AI coach interaction
  useEffect(() => {
    if (coachState === 'greeting') {
      // Simulate initial greeting
      const timer = setTimeout(() => {
        setCoachMessage("What is today's goal..");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [coachState]);

  const handlePlayPause = () => {
    if (coachState === 'greeting' || coachState === 'stopped') {
      // Start the session
      setCoachState('listening');
      setCoachMessage("I'm listening... Tell me your goal for today");
      
      // Simulate AI response after user speaks
      setTimeout(() => {
        setCoachState('speaking');
        setCoachMessage("Great! Let's focus on that goal. I'll guide you through today's session.");
        
        // Continue with coaching
        setTimeout(() => {
          setCoachMessage("Take deep breaths and maintain good form. You're doing amazing!");
        }, 3000);
      }, 5000);

      toast({
        title: "Coach activated",
        description: "Your AI coach is ready to help!",
      });
    } else if (coachState === 'speaking' || coachState === 'listening') {
      // Pause
      setCoachState('paused');
      setCoachMessage("Session paused. Ready to continue when you are.");
    } else if (coachState === 'paused') {
      // Resume
      setCoachState('speaking');
      setCoachMessage("Welcome back! Let's continue your session.");
    }
  };

  const handleStop = () => {
    setCoachState('stopped');
    setCoachMessage("Session complete! Great work today.");
    
    setTimeout(() => {
      setCoachMessage("What is today's goal..");
      setCoachState('greeting');
    }, 3000);

    toast({
      title: "Session ended",
      description: "Great job on your workout!",
    });

    if (onClose && !isFullScreen) {
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  const toggleVoice = () => {
    setIsVoiceEnabled(!isVoiceEnabled);
    toast({
      title: isVoiceEnabled ? "Voice disabled" : "Voice enabled",
      description: isVoiceEnabled ? "Coach will no longer speak" : "Coach voice activated",
    });
  };

  const isPaused = coachState === 'paused';
  const isActive = coachState === 'listening' || coachState === 'speaking';
  const showPlayButton = coachState === 'greeting' || coachState === 'paused' || coachState === 'stopped';

  const containerClasses = isFullScreen 
    ? "min-h-screen bg-background flex flex-col" 
    : "fixed inset-0 bg-background z-50 flex flex-col";

  return (
    <div className={containerClasses}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-gradient-card border-b border-coach-border">
        <h1 className="text-2xl font-bold text-foreground">Coach</h1>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-12">
        {/* Coach Message */}
        <div className="text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-medium text-foreground max-w-md leading-relaxed">
            {coachMessage}
          </h2>
          
          {/* Voice Indicator */}
          {isVoiceEnabled && (coachState === 'speaking' || coachState === 'listening') && (
            <div className="flex items-center justify-center">
              <Volume2 className="w-8 h-8 text-coach-red animate-pulse" />
            </div>
          )}
        </div>

        {/* Control Buttons */}
        <div className="flex items-center gap-8">
          {/* Pause/Play Button */}
          <Button
            variant="secondary"
            size="lg"
            className="w-20 h-20 rounded-full bg-muted hover:bg-muted/80 border-2 border-muted-foreground/20"
            onClick={handlePlayPause}
          >
            {showPlayButton ? (
              <Play className="w-8 h-8 text-muted-foreground ml-1" />
            ) : (
              <Pause className="w-8 h-8 text-muted-foreground" />
            )}
          </Button>

          {/* Stop Button */}
          <Button
            variant="destructive"
            size="lg"
            className="w-20 h-20 rounded-full bg-coach-red hover:bg-coach-red-dark"
            onClick={handleStop}
          >
            <X className="w-8 h-8 text-white" />
          </Button>
        </div>

        {/* Session Status */}
        {isActive && (
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {coachState === 'listening' ? '🎤 Listening...' : '🗣️ Speaking...'}
            </p>
          </div>
        )}
      </div>

      {/* Voice Toggle (Bottom) */}
      <div className="p-6 border-t border-coach-border">
        <Button
          variant="ghost"
          className="w-full flex items-center justify-center gap-2"
          onClick={toggleVoice}
        >
          <Volume2 className={`w-4 h-4 ${isVoiceEnabled ? 'text-coach-red' : 'text-muted-foreground'}`} />
          <span className="text-sm">
            Voice {isVoiceEnabled ? 'Enabled' : 'Disabled'}
          </span>
        </Button>
      </div>
    </div>
  );
};