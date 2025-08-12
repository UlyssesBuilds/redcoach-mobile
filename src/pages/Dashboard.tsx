import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { FoodScanner } from '@/components/FoodScanner';
import { Coach } from '@/components/Coach';
import { FeedFilterPanel } from '@/components/FeedFilterPanel';
import { FeedItem } from '@/components/FeedItem';
import { fetchFeed, FeedFilterType, FeedItem as FeedItemType } from '@/lib/feedService';
import { 
  Activity, 
  Target, 
  Calendar, 
  Flame, 
  Apple, 
  Clock, 
  MessageCircle,
  BarChart3,
  Camera,
  Mic,
  Home,
  User,
  LogOut,
  Plus,
  Heart,
  Wheat,
  Droplet
} from 'lucide-react';

type BottomNavTab = 'home' | 'stats' | 'chat' | 'profile';

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<BottomNavTab>('home');
  const [showFoodScanner, setShowFoodScanner] = useState(false);
  const [showCoach, setShowCoach] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FeedFilterType>('all');
  const [feedData, setFeedData] = useState<FeedItemType[]>([]);
  const [isLoadingFeed, setIsLoadingFeed] = useState(false);
  const { user, logout } = useAuth();

  // Load initial feed data
  useEffect(() => {
    const loadFeedData = async () => {
      setIsLoadingFeed(true);
      try {
        const data = await fetchFeed(activeFilter);
        setFeedData(data);
      } catch (error) {
        console.error('Failed to load feed data:', error);
      } finally {
        setIsLoadingFeed(false);
      }
    };

    loadFeedData();
  }, [activeFilter]);

  const handleFilterChange = async (filter: FeedFilterType) => {
    setActiveFilter(filter);
  };

  // Mock data
  const dailyGoals = {
    calories: { current: 1405, target: 2200 },
    protein: { current: 89, target: 165 },
    carbs: { current: 145, target: 275 },
    fat: { current: 54, target: 73 },
    steps: { current: 8500, target: 10000 }
  };

  const recentActivities = [
    { id: 1, type: 'running', duration: '30 min', calories: 350, time: '2h ago' },
    { id: 2, type: 'meal', description: 'Chicken & Rice', calories: 520, time: '4h ago' },
    { id: 3, type: 'water', description: '2 glasses', time: '1h ago' }
  ];

  const handleFoodLogged = (food: any) => {
    // Update daily goals with new food
    console.log('Food logged:', food);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeTab 
            dailyGoals={dailyGoals} 
            recentActivities={recentActivities}
            onStartWorkout={() => setShowCoach(true)}
            onLogFood={() => setShowFoodScanner(true)}
            activeFilter={activeFilter}
            feedData={feedData}
            isLoadingFeed={isLoadingFeed}
            onFilterChange={handleFilterChange}
          />
        );
      case 'stats':
        return <StatsTab />;
      case 'chat':
        return <ChatTab />;
      case 'profile':
        return <ProfileTab user={user} onLogout={logout} />;
      default:
        return (
          <HomeTab 
            dailyGoals={dailyGoals} 
            recentActivities={recentActivities}
            onStartWorkout={() => setShowCoach(true)}
            onLogFood={() => setShowFoodScanner(true)}
            activeFilter={activeFilter}
            feedData={feedData}
            isLoadingFeed={isLoadingFeed}
            onFilterChange={handleFilterChange}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex flex-col">
      {/* Header */}
      <div className="bg-gradient-card border-b border-coach-border p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Good morning, {user?.name}!
            </h1>
            <p className="text-muted-foreground">Ready to crush your goals?</p>
          </div>
          <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        {renderTabContent()}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-card border-t border-coach-border">
        <div className="flex items-center justify-around py-2 relative">
          <Button
            variant={activeTab === 'home' ? 'coach' : 'ghost'}
            size="sm"
            className="flex-col h-14 px-3"
            onClick={() => setActiveTab('home')}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs mt-1">Home</span>
          </Button>
          
          <Button
            variant={activeTab === 'stats' ? 'coach' : 'ghost'}
            size="sm"
            className="flex-col h-14 px-3"
            onClick={() => setActiveTab('stats')}
          >
            <BarChart3 className="w-5 h-5" />
            <span className="text-xs mt-1">Stats</span>
          </Button>
          
          {/* Plus Button */}
          <Button
            variant="coach"
            size="icon"
            className="w-14 h-14 rounded-full bg-gradient-primary shadow-glow -mt-6"
            onClick={() => setShowQuickActions(true)}
          >
            <Plus className="w-6 h-6 text-white" />
          </Button>
          
          <Button
            variant={activeTab === 'chat' ? 'coach' : 'ghost'}
            size="sm"
            className="flex-col h-14 px-3"
            onClick={() => setActiveTab('chat')}
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-xs mt-1">Coach</span>
          </Button>
          
          <Button
            variant={activeTab === 'profile' ? 'coach' : 'ghost'}
            size="sm"
            className="flex-col h-14 px-3"
            onClick={() => setActiveTab('profile')}
          >
            <User className="w-5 h-5" />
            <span className="text-xs mt-1">Profile</span>
          </Button>
        </div>
      </div>

      {/* Modals */}
      {showFoodScanner && (
        <FoodScanner
          onClose={() => setShowFoodScanner(false)}
          onFoodLogged={handleFoodLogged}
        />
      )}
      
      {showCoach && (
        <Coach
          onClose={() => setShowCoach(false)}
          workoutType={user?.exerciseType || 'running'}
        />
      )}
      
      {/* Quick Actions Modal */}
      {showQuickActions && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-center">
          <div className="bg-gradient-card border-t border-coach-border rounded-t-3xl w-full max-w-md mx-4 mb-0 p-6 space-y-4">
            <div className="w-12 h-1 bg-muted-foreground/30 rounded-full mx-auto mb-4" />
            
            <div className="space-y-3">
              <Button
                variant="coach"
                className="w-full h-16 text-lg font-semibold rounded-2xl"
                onClick={() => {
                  setShowQuickActions(false);
                  setShowFoodScanner(true);
                }}
              >
                <Apple className="w-6 h-6 mr-3" />
                Food
              </Button>
              
              <Button
                variant="coach-outline"
                className="w-full h-16 text-lg font-semibold rounded-2xl"
                onClick={() => {
                  setShowQuickActions(false);
                  setShowCoach(true);
                }}
              >
                <Activity className="w-6 h-6 mr-3" />
                Running
              </Button>
            </div>
            
            <Button
              variant="ghost"
              className="w-full mt-4 text-muted-foreground"
              onClick={() => setShowQuickActions(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

const HomeTab = ({ dailyGoals, recentActivities, onStartWorkout, onLogFood, activeFilter, feedData, isLoadingFeed, onFilterChange }: any) => {
  console.log('HomeTab onFilterChange:', onFilterChange);
  return (
  <div className="p-4 space-y-6">
    {/* Daily Goals */}
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Calories</h2>
        <Button variant="ghost" size="sm" className="text-coach-red font-medium">
          Edit
        </Button>
      </div>
      
      {/* Circular Calorie Tracker */}
      <Card className="bg-gradient-card border-coach-border">
        <CardContent className="p-8">
          <div className="flex flex-col items-center space-y-6">
            {/* Circular Progress */}
            <div className="relative w-40 h-40">
              <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 160 160">
                {/* Background circle */}
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-muted/20"
                />
                {/* Progress circle */}
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="hsl(var(--coach-red))"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 70}`}
                  strokeDashoffset={`${2 * Math.PI * 70 * (1 - (dailyGoals.calories.current / dailyGoals.calories.target))}`}
                  className="transition-all duration-300"
                />
              </svg>
              {/* Center content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-4xl font-bold text-foreground">
                  {dailyGoals.calories.target - dailyGoals.calories.current}
                </span>
                <span className="text-sm text-muted-foreground">Remaining</span>
              </div>
            </div>
            
            {/* Macro Nutrients */}
            <div className="grid grid-cols-3 gap-6 w-full">
              {/* Protein */}
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center">
                  <Heart className="w-4 h-4 text-coach-red mr-1" />
                  <span className="text-sm text-muted-foreground">Protein</span>
                </div>
                <div className="space-y-1">
                  <p className="text-xl font-semibold text-foreground">
                    {dailyGoals.protein.current}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    /{dailyGoals.protein.target}g
                  </p>
                </div>
              </div>
              
              {/* Carbs */}
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center">
                  <Wheat className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-muted-foreground">Carbs</span>
                </div>
                <div className="space-y-1">
                  <p className="text-xl font-semibold text-foreground">
                    {dailyGoals.carbs.current}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    /{dailyGoals.carbs.target}g
                  </p>
                </div>
              </div>
              
              {/* Fat */}
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center">
                  <Droplet className="w-4 h-4 text-yellow-500 mr-1" />
                  <span className="text-sm text-muted-foreground">Fat</span>
                </div>
                <div className="space-y-1">
                  <p className="text-xl font-semibold text-foreground">
                    {dailyGoals.fat.current}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    /{dailyGoals.fat.target}g
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    {/* Quick Actions */}
    <div className="space-y-4">
      {/* Quick Actions - temporarily hidden */}
      {false && (
        <>
          <h2 className="text-xl font-semibold">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="coach-outline" 
              className="h-20 flex-col"
              onClick={onStartWorkout}
            >
              <Activity className="w-6 h-6 mb-2" />
              Start Workout
            </Button>
            <Button 
              variant="coach-outline" 
              className="h-20 flex-col"
              onClick={onLogFood}
            >
              <Camera className="w-6 h-6 mb-2" />
              Log Food
            </Button>
          </div>
        </>
      )}
    </div>

    {/* Community Feed */}
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Community Feed</h2>
      
      {/* Filter Panel */}
      <FeedFilterPanel 
        activeFilter={activeFilter}
        onFilterChange={onFilterChange}
        isLoading={isLoadingFeed}
      />
      
      {/* Feed Items */}
      <div className="space-y-3">
        {isLoadingFeed ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coach-red"></div>
          </div>
        ) : feedData.length > 0 ? (
          feedData.map((item) => (
            <FeedItem key={item.id} item={item} />
          ))
        ) : (
          <Card className="bg-gradient-card border-coach-border">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No activities found for this filter.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  </div>
  );
};

const StatsTab = () => {
  const [showStats, setShowStats] = useState(false);
  
  if (showStats) {
    const { StatsPage } = require('@/components/StatsPage');
    return <StatsPage onBack={() => setShowStats(false)} />;
  }
  
  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-semibold">Your Statistics</h2>
      <Card className="bg-gradient-card border-coach-border">
        <CardHeader>
          <CardTitle>Progress Overview</CardTitle>
          <CardDescription>Track your fitness journey and achievements</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            variant="coach" 
            className="w-full h-12"
            onClick={() => setShowStats(true)}
          >
            <BarChart3 className="w-5 h-5 mr-2" />
            View Detailed Stats
          </Button>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="space-y-1">
              <p className="text-2xl font-bold text-coach-red">87%</p>
              <p className="text-sm text-muted-foreground">Weekly Goal</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-coach-red">24</p>
              <p className="text-sm text-muted-foreground">Active Days</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const ChatTab = () => (
  <div className="p-4 space-y-6">
    <h2 className="text-xl font-semibold">AI Coach</h2>
    <Card className="bg-gradient-card border-coach-border">
      <CardHeader>
        <CardTitle>Chat with your AI Coach</CardTitle>
        <CardDescription>Get personalized advice and motivation</CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="coach" className="w-full">
          <MessageCircle className="w-4 h-4 mr-2" />
          Start Conversation
        </Button>
      </CardContent>
    </Card>
  </div>
);

const ProfileTab = ({ user, onLogout }: any) => (
  <div className="p-4 space-y-6">
    <div className="text-center space-y-4">
      <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
        <User className="w-10 h-10 text-white" />
      </div>
      <div>
        <h2 className="text-xl font-semibold">{user?.name}</h2>
        <p className="text-muted-foreground">{user?.email}</p>
      </div>
    </div>

    <Card className="bg-gradient-card border-coach-border">
      <CardHeader>
        <CardTitle>Fitness Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Height</p>
            <p className="font-medium">{user?.height} cm</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Weight</p>
            <p className="font-medium">{user?.weight} kg</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Goal</p>
            <p className="font-medium capitalize">{user?.goal}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Exercise</p>
            <p className="font-medium capitalize">{user?.exerciseType?.replace('_', ' ')}</p>
          </div>
        </div>
      </CardContent>
    </Card>

    <Button 
      variant="destructive" 
      className="w-full"
      onClick={onLogout}
    >
      <LogOut className="w-4 h-4 mr-2" />
      Sign Out
    </Button>
  </div>
);