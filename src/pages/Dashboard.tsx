import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { FoodScanner } from '@/components/FoodScanner';
import { Coach } from '@/components/Coach';
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
  Plus
} from 'lucide-react';

type BottomNavTab = 'home' | 'stats' | 'chat' | 'profile';

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<BottomNavTab>('home');
  const [showFoodScanner, setShowFoodScanner] = useState(false);
  const [showCoach, setShowCoach] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const { user, logout } = useAuth();

  // Mock data
  const dailyGoals = {
    calories: { current: 1850, target: 2200 },
    protein: { current: 120, target: 150 },
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

const HomeTab = ({ dailyGoals, recentActivities, onStartWorkout, onLogFood }: any) => (
  <div className="p-4 space-y-6">
    {/* Daily Goals */}
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Today's Progress</h2>
      <div className="grid gap-4">
        <Card className="bg-gradient-card border-coach-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-coach-red" />
                <span className="font-medium">Calories</span>
              </div>
              <Badge variant="secondary">
                {dailyGoals.calories.current}/{dailyGoals.calories.target}
              </Badge>
            </div>
            <Progress 
              value={(dailyGoals.calories.current / dailyGoals.calories.target) * 100} 
              className="h-2" 
            />
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-coach-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Apple className="w-5 h-5 text-green-500" />
                <span className="font-medium">Protein</span>
              </div>
              <Badge variant="secondary">
                {dailyGoals.protein.current}g/{dailyGoals.protein.target}g
              </Badge>
            </div>
            <Progress 
              value={(dailyGoals.protein.current / dailyGoals.protein.target) * 100} 
              className="h-2" 
            />
          </CardContent>
        </Card>
      </div>
    </div>

    {/* Quick Actions */}
    <div className="space-y-4">
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
    </div>

    {/* Recent Activity */}
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Recent Activity</h2>
      <div className="space-y-3">
        {recentActivities.map((activity) => (
          <Card key={activity.id} className="bg-gradient-card border-coach-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-coach-red/10 rounded-lg flex items-center justify-center">
                    <Activity className="w-5 h-5 text-coach-red" />
                  </div>
                  <div>
                    <p className="font-medium">{activity.description || activity.type}</p>
                    <p className="text-sm text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
                {activity.calories && (
                  <Badge variant="outline">{activity.calories} cal</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </div>
);

const StatsTab = () => (
  <div className="p-4 space-y-6">
    <h2 className="text-xl font-semibold">Your Statistics</h2>
    <Card className="bg-gradient-card border-coach-border">
      <CardHeader>
        <CardTitle>Weekly Overview</CardTitle>
        <CardDescription>Your progress this week</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Detailed analytics coming soon...</p>
      </CardContent>
    </Card>
  </div>
);

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