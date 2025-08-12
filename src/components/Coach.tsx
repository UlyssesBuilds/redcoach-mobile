import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, X, Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CoachProps {
  onClose: () => void;
  workoutType: string;
}

type CoachState = 'greeting' | 'listening' | 'speaking' | 'paused' | 'stopped';

export const Coach = ({ onClose, workoutType }: CoachProps) => {
  const [state, setState] = useState<CoachState>('listening');
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentMessage, setCurrentMessage] = useState("What is today's goal?");
  const { toast } = useToast();

  // Mock AI messages for different states
  const messages = {
    greeting: "What is today's goal?",
    listening: "I'm listening... Tell me your goal",
    speaking: "Great! Let's work towards that goal together. I'll guide you through your workout.",
    paused: "Workout paused. Ready to continue?",
    stopped: "Session ended. Great work today!"
  };

  // Simulate AI greeting on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentMessage(messages.greeting);
      simulateVoiceOutput();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Mock Gemini API call simulation
  const mockGeminiAPICall = async (userInput: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      response: `I understand you want to ${userInput}. Let's start with some warm-up exercises to prepare your body.`,
      nextAction: 'speaking'
    };
  };

  const simulateVoiceOutput = () => {
    setIsPlaying(true);
    // Simulate voice duration
    setTimeout(() => {
      setIsPlaying(false);
      if (state === 'greeting') {
        setState('listening');
        setCurrentMessage(messages.listening);
      }
    }, 2000);
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      // Pause listening
      setState('paused');
      setIsPlaying(false);
      setCurrentMessage("Session paused. Tap to continue listening.");
    } else {
      // Resume listening
      setState('listening');
      setIsPlaying(true);
      setCurrentMessage("What is today's goal?");
    }
  };

  const handleStop = () => {
    setState('stopped');
    setIsPlaying(false);
    setCurrentMessage(messages.stopped);
    
    toast({
      title: "Session ended",
      description: "Your coaching session has been completed",
    });
    
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  const getButtonIcon = () => {
    if (state === 'paused' || !isPlaying) {
      return <Play className="w-8 h-8" />;
    }
    return <Pause className="w-8 h-8" />;
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-card border-b border-coach-border p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Coach</h1>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-12">
        {/* AI Message Display */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
              <Volume2 className={`w-8 h-8 text-white ${isPlaying ? 'animate-pulse' : ''}`} />
            </div>
          </div>
          
          <div className="max-w-md mx-auto">
            <p className="text-2xl font-medium text-foreground leading-relaxed">
              {currentMessage}
            </p>
          </div>
          
          {state === 'listening' && (
            <div className="w-3 h-3 bg-coach-red rounded-full animate-pulse mx-auto" />
          )}
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-center gap-8">
          {/* Play/Pause Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePlayPause}
            className="w-20 h-20 rounded-full bg-muted hover:bg-muted/80 border-2 border-muted-foreground/20"
            disabled={state === 'stopped'}
          >
            {getButtonIcon()}
          </Button>

          {/* Stop Button */}
          <Button
            variant="destructive"
            size="icon"
            onClick={handleStop}
            className="w-20 h-20 rounded-full bg-coach-red hover:bg-coach-red/90"
          >
            <X className="w-8 h-8" />
          </Button>
        </div>

        {/* State Indicator */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground capitalize">
            {state === 'greeting' && 'Starting session...'}
            {state === 'listening' && 'Listening for your response'}
            {state === 'speaking' && 'AI Coach is speaking'}
            {state === 'paused' && 'Session paused'}
            {state === 'stopped' && 'Session completed'}
          </p>
        </div>
      </div>

      {/* Bottom Navigation Spacer */}
      <div className="h-20" />
    </div>
  );
};