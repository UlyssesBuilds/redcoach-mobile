import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { ChevronLeft, ChevronRight, Target, Activity, TrendingUp, TrendingDown, Minus } from 'lucide-react';

type Step = 1 | 2 | 3;

interface OnboardingData {
  height: number;
  weight: number;
  goal: 'cut' | 'bulk' | 'maintain';
  exerciseType: string;
}

export const OnboardingScreen = () => {
  const [step, setStep] = useState<Step>(1);
  const [data, setData] = useState<Partial<OnboardingData>>({});
  const { user, updateUser } = useAuth();

  const handleNext = () => {
    if (step < 3) {
      setStep((prev) => (prev + 1) as Step);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as Step);
    }
  };

  const handleComplete = async () => {
    if (user && data.height && data.weight && data.goal && data.exerciseType) {
      const updatedUser = {
        ...user,
        height: data.height,
        weight: data.weight,
        goal: data.goal,
        exerciseType: data.exerciseType,
        onboardingCompleted: true
      };
      await updateUser(updatedUser);
    }
  };

  const progress = (step / 3) * 100;

  const canProceed = () => {
    switch (step) {
      case 1:
        return data.height && data.weight;
      case 2:
        return data.goal;
      case 3:
        return data.exerciseType;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Step {step} of 3</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Content Card */}
        <Card className="bg-gradient-card border-coach-border shadow-card">
          {step === 1 && (
            <>
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Let's get your basics</CardTitle>
                <CardDescription>
                  We need your height and weight to calculate accurate metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="175"
                    value={data.height || ''}
                    onChange={(e) => setData(prev => ({ ...prev, height: Number(e.target.value) }))}
                    className="bg-coach-input border-coach-border rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="70"
                    value={data.weight || ''}
                    onChange={(e) => setData(prev => ({ ...prev, weight: Number(e.target.value) }))}
                    className="bg-coach-input border-coach-border rounded-xl"
                  />
                </div>
              </CardContent>
            </>
          )}

          {step === 2 && (
            <>
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <CardTitle>What's your goal?</CardTitle>
                <CardDescription>
                  Choose your primary fitness objective
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3">
                  <Button
                    variant={data.goal === 'cut' ? 'coach' : 'coach-outline'}
                    className="h-16 justify-start p-4"
                    onClick={() => setData(prev => ({ ...prev, goal: 'cut' }))}
                  >
                    <TrendingDown className="w-5 h-5 mr-3" />
                    <div className="text-left">
                      <div className="font-semibold">Cut</div>
                      <div className="text-sm opacity-80">Lose fat and get lean</div>
                    </div>
                  </Button>
                  
                  <Button
                    variant={data.goal === 'bulk' ? 'coach' : 'coach-outline'}
                    className="h-16 justify-start p-4"
                    onClick={() => setData(prev => ({ ...prev, goal: 'bulk' }))}
                  >
                    <TrendingUp className="w-5 h-5 mr-3" />
                    <div className="text-left">
                      <div className="font-semibold">Bulk</div>
                      <div className="text-sm opacity-80">Build muscle and size</div>
                    </div>
                  </Button>
                  
                  <Button
                    variant={data.goal === 'maintain' ? 'coach' : 'coach-outline'}
                    className="h-16 justify-start p-4"
                    onClick={() => setData(prev => ({ ...prev, goal: 'maintain' }))}
                  >
                    <Minus className="w-5 h-5 mr-3" />
                    <div className="text-left">
                      <div className="font-semibold">Maintain</div>
                      <div className="text-sm opacity-80">Stay at current weight</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </>
          )}

          {step === 3 && (
            <>
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Preferred exercise?</CardTitle>
                <CardDescription>
                  What type of exercise do you enjoy most?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3">
                  <Button
                    variant={data.exerciseType === 'running' ? 'coach' : 'coach-outline'}
                    className="h-16 justify-start p-4"
                    onClick={() => setData(prev => ({ ...prev, exerciseType: 'running' }))}
                  >
                    <Activity className="w-5 h-5 mr-3" />
                    <div className="text-left">
                      <div className="font-semibold">Running</div>
                      <div className="text-sm opacity-80">Cardiovascular endurance</div>
                    </div>
                  </Button>
                  
                  <Button
                    variant={data.exerciseType === 'weight_training' ? 'coach' : 'coach-outline'}
                    className="h-16 justify-start p-4"
                    onClick={() => setData(prev => ({ ...prev, exerciseType: 'weight_training' }))}
                  >
                    <Target className="w-5 h-5 mr-3" />
                    <div className="text-left">
                      <div className="font-semibold">Weight Training</div>
                      <div className="text-sm opacity-80">Strength and muscle building</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </>
          )}
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="coach-ghost"
            onClick={handlePrevious}
            disabled={step === 1}
            className="flex items-center"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>
          
          <Button
            variant="coach"
            onClick={handleNext}
            disabled={!canProceed()}
            className="flex items-center"
          >
            {step === 3 ? 'Complete' : 'Next'}
            {step !== 3 && <ChevronRight className="w-4 h-4 ml-1" />}
          </Button>
        </div>
      </div>
    </div>
  );
};