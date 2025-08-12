import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { ArrowLeft, Zap, TrendingUp } from 'lucide-react';

type TimeRange = 'weekly' | 'monthly' | 'yearly';

interface ActivityRing {
  day: string;
  eating: number; // 0-100 percentage for healthy eating
  exercise: number; // 0-100 percentage for exercise goals
  target: number; // 0-100 percentage for daily target goals
}

interface ActivityTrendData {
  day: string;
  value: number;
}

interface MacroTrendData {
  day: string;
  protein: number;
  carbs: number;
  fat: number;
}

interface AIInsight {
  title: string;
  description: string;
  actionable: boolean;
}

interface StatsData {
  activityRings: ActivityRing[];
  activityTrend: ActivityTrendData[];
  macroTrends: MacroTrendData[];
  aiInsights: AIInsight;
}

// Mock API function - replace with real API calls
const fetchStatsData = async (timeRange: TimeRange): Promise<StatsData> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const mockData: Record<TimeRange, StatsData> = {
    weekly: {
      activityRings: [
        { day: 'M', eating: 85, exercise: 92, target: 78 },
        { day: 'T', eating: 92, exercise: 88, target: 95 },
        { day: 'W', eating: 45, exercise: 65, target: 82 },
        { day: 'T', eating: 88, exercise: 95, target: 90 },
        { day: 'F', eating: 95, exercise: 82, target: 88 },
        { day: 'S', eating: 78, exercise: 90, target: 85 },
        { day: 'S', eating: 100, exercise: 85, target: 100 },
      ],
      activityTrend: [
        { day: 'Mon', value: 65 },
        { day: 'Tue', value: 85 },
        { day: 'Wed', value: 45 },
        { day: 'Thu', value: 92 },
        { day: 'Fri', value: 78 },
        { day: 'Sat', value: 110 },
        { day: 'Sun', value: 95 },
      ],
      macroTrends: [
        { day: 'Mon', protein: 120, carbs: 200, fat: 80 },
        { day: 'Tue', protein: 110, carbs: 180, fat: 85 },
        { day: 'Wed', protein: 95, carbs: 160, fat: 75 },
        { day: 'Thu', protein: 125, carbs: 220, fat: 90 },
        { day: 'Fri', protein: 130, carbs: 240, fat: 95 },
        { day: 'Sat', protein: 115, carbs: 190, fat: 88 },
        { day: 'Sun', protein: 140, carbs: 250, fat: 100 },
      ],
      aiInsights: {
        title: "Protein Intake Alert",
        description: "Your protein intake was below your goal on Tuesday and Friday. Tap to see the full report and a suggested meal plan.",
        actionable: true
      }
    },
    monthly: {
      activityRings: [
        { day: 'W1', eating: 78, exercise: 85, target: 82 },
        { day: 'W2', eating: 85, exercise: 90, target: 88 },
        { day: 'W3', eating: 72, exercise: 80, target: 75 },
        { day: 'W4', eating: 90, exercise: 95, target: 92 },
      ],
      activityTrend: [
        { day: 'Week 1', value: 78 },
        { day: 'Week 2', value: 85 },
        { day: 'Week 3', value: 72 },
        { day: 'Week 4', value: 90 },
      ],
      macroTrends: [
        { day: 'W1', protein: 115, carbs: 195, fat: 85 },
        { day: 'W2', protein: 120, carbs: 210, fat: 88 },
        { day: 'W3', protein: 108, carbs: 185, fat: 82 },
        { day: 'W4', protein: 125, carbs: 220, fat: 92 },
      ],
      aiInsights: {
        title: "Consistent Progress",
        description: "You've maintained consistent workout intensity this month. Your average daily activity increased by 15% compared to last month.",
        actionable: true
      }
    },
    yearly: {
      activityRings: [
        { day: 'Q1', eating: 82, exercise: 88, target: 85 },
        { day: 'Q2', eating: 88, exercise: 92, target: 90 },
        { day: 'Q3', eating: 75, exercise: 80, target: 78 },
        { day: 'Q4', eating: 92, exercise: 95, target: 94 },
      ],
      activityTrend: [
        { day: 'Q1', value: 82 },
        { day: 'Q2', value: 88 },
        { day: 'Q3', value: 75 },
        { day: 'Q4', value: 92 },
      ],
      macroTrends: [
        { day: 'Q1', protein: 118, carbs: 200, fat: 86 },
        { day: 'Q2', protein: 122, carbs: 215, fat: 89 },
        { day: 'Q3', protein: 115, carbs: 190, fat: 84 },
        { day: 'Q4', protein: 128, carbs: 225, fat: 94 },
      ],
      aiInsights: {
        title: "Year-End Achievement",
        description: "Congratulations! You've achieved 87% of your annual fitness goals. Your consistency improved significantly in Q4.",
        actionable: true
      }
    }
  };
  
  return mockData[timeRange];
};

interface StatsPageProps {
  onBack?: () => void;
}

export const StatsPage = ({ onBack }: StatsPageProps) => {
  const [activeTab, setActiveTab] = useState<TimeRange>('weekly');
  const [statsData, setStatsData] = useState<StatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showInsightModal, setShowInsightModal] = useState(false);

  useEffect(() => {
    loadStatsData(activeTab);
  }, [activeTab]);

  const loadStatsData = async (timeRange: TimeRange) => {
    setIsLoading(true);
    try {
      const data = await fetchStatsData(timeRange);
      setStatsData(data);
    } catch (error) {
      console.error('Failed to load stats data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as TimeRange);
  };

  if (isLoading || !statsData) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coach-red"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <div className="bg-gradient-card border-b border-coach-border p-4">
        <div className="flex items-center space-x-4">
          {onBack && (
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          <h1 className="text-2xl font-bold text-foreground">Progress</h1>
        </div>
        
        {/* Time Range Tabs */}
        <div className="mt-4">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-muted/20">
              <TabsTrigger 
                value="weekly" 
                className="data-[state=active]:bg-background data-[state=active]:text-foreground"
              >
                Weekly
              </TabsTrigger>
              <TabsTrigger 
                value="monthly"
                className="data-[state=active]:bg-background data-[state=active]:text-foreground"
              >
                Monthly
              </TabsTrigger>
              <TabsTrigger 
                value="yearly"
                className="data-[state=active]:bg-background data-[state=active]:text-foreground"
              >
                Yearly
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* AI Insights */}
        <Card className="bg-gradient-card border-coach-border">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 space-y-3">
                <h3 className="text-lg font-semibold text-foreground">AI Insights</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {statsData.aiInsights.description}
                </p>
                <Button 
                  variant="ghost" 
                  className="text-coach-red font-medium p-0 h-auto hover:bg-transparent"
                  onClick={() => setShowInsightModal(true)}
                >
                  View Full Report →
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Rings */}
        <Card className="bg-gradient-card border-coach-border">
          <CardContent className="p-6">
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-4 justify-items-center">
              {statsData.activityRings.map((ring, index) => (
                <ActivityRingComponent key={index} ring={ring} />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activity Trend */}
        <Card className="bg-gradient-card border-coach-border">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-coach-red" />
              <span>Activity Trend</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ChartContainer
                config={{
                  value: {
                    label: "Activity",
                    color: "hsl(var(--coach-red))",
                  },
                }}
                className="h-full w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={statsData.activityTrend} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                    <XAxis 
                      dataKey="day" 
                      axisLine={false}
                      tickLine={false}
                      className="text-muted-foreground"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis hide />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="hsl(var(--coach-red))"
                      strokeWidth={3}
                      dot={{ fill: "hsl(var(--coach-red))", strokeWidth: 2, r: 6 }}
                      activeDot={{ r: 8, stroke: "hsl(var(--coach-red))", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        {/* Macro Trends */}
        <Card className="bg-gradient-card border-coach-border">
          <CardHeader>
            <CardTitle>Macro Trends</CardTitle>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-coach-red rounded-full"></div>
                <span className="text-muted-foreground">Protein</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-muted rounded-full"></div>
                <span className="text-muted-foreground">Carbs</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-muted-foreground">Fat</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ChartContainer
                config={{
                  protein: {
                    label: "Protein",
                    color: "hsl(var(--coach-red))",
                  },
                  carbs: {
                    label: "Carbs", 
                    color: "hsl(var(--muted))",
                  },
                  fat: {
                    label: "Fat",
                    color: "hsl(142, 76%, 36%)",
                  },
                }}
                className="h-full w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statsData.macroTrends} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                    <XAxis 
                      dataKey="day"
                      axisLine={false}
                      tickLine={false}
                      className="text-muted-foreground"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis hide />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="protein" stackId="a" fill="hsl(var(--coach-red))" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="carbs" stackId="a" fill="hsl(var(--muted))" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="fat" stackId="a" fill="hsl(142, 76%, 36%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights Modal */}
      {showInsightModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-center sm:items-center">
          <div className="bg-gradient-card border-t border-coach-border sm:border sm:rounded-2xl w-full max-w-md mx-4 mb-0 sm:mb-4 p-6 space-y-4">
            <div className="w-12 h-1 bg-muted-foreground/30 rounded-full mx-auto sm:hidden" />
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">{statsData.aiInsights.title}</h3>
            </div>
            
            <p className="text-muted-foreground leading-relaxed">
              {statsData.aiInsights.description}
            </p>
            
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">Recommendations:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Add protein-rich snacks between meals</li>
                <li>• Consider a post-workout protein shake</li>
                <li>• Plan meals with lean meats or plant proteins</li>
              </ul>
            </div>
            
            <div className="flex space-x-3 pt-4">
              <Button 
                variant="coach" 
                className="flex-1"
                onClick={() => setShowInsightModal(false)}
              >
                Got it
              </Button>
              <Button 
                variant="coach-outline" 
                className="flex-1"
                onClick={() => setShowInsightModal(false)}
              >
                View Meal Plan
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Activity Ring Component - Apple Health Style
const ActivityRingComponent = ({ ring }: { ring: ActivityRing }) => {
  const radius1 = 20; // Outer ring (target)
  const radius2 = 16; // Middle ring (exercise)
  const radius3 = 12; // Inner ring (eating)
  
  const circumference1 = 2 * Math.PI * radius1;
  const circumference2 = 2 * Math.PI * radius2;
  const circumference3 = 2 * Math.PI * radius3;

  const targetOffset = circumference1 - (ring.target / 100) * circumference1;
  const exerciseOffset = circumference2 - (ring.exercise / 100) * circumference2;
  const eatingOffset = circumference3 - (ring.eating / 100) * circumference3;

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="relative w-16 h-16">
        <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 56 56">
          {/* Background circles */}
          <circle cx="28" cy="28" r={radius1} stroke="currentColor" strokeWidth="3" fill="none" className="text-muted/20" />
          <circle cx="28" cy="28" r={radius2} stroke="currentColor" strokeWidth="3" fill="none" className="text-muted/20" />
          <circle cx="28" cy="28" r={radius3} stroke="currentColor" strokeWidth="3" fill="none" className="text-muted/20" />
          
          {/* Outer ring - Target Goals (Red) */}
          <circle
            cx="28" cy="28" r={radius1}
            stroke="hsl(var(--coach-red))"
            strokeWidth="3" fill="none" strokeLinecap="round"
            strokeDasharray={circumference1}
            strokeDashoffset={targetOffset}
            className="transition-all duration-1000 ease-out"
          />
          
          {/* Middle ring - Exercise (Green) */}
          <circle
            cx="28" cy="28" r={radius2}
            stroke="hsl(142, 76%, 36%)"
            strokeWidth="3" fill="none" strokeLinecap="round"
            strokeDasharray={circumference2}
            strokeDashoffset={exerciseOffset}
            className="transition-all duration-1000 ease-out"
            style={{ animationDelay: '0.2s' }}
          />
          
          {/* Inner ring - Healthy Eating (Orange/Yellow) */}
          <circle
            cx="28" cy="28" r={radius3}
            stroke="hsl(45, 93%, 58%)"
            strokeWidth="3" fill="none" strokeLinecap="round"
            strokeDasharray={circumference3}
            strokeDashoffset={eatingOffset}
            className="transition-all duration-1000 ease-out"
            style={{ animationDelay: '0.4s' }}
          />
        </svg>
      </div>
      <span className="text-xs text-muted-foreground font-medium">{ring.day}</span>
    </div>
  );
};