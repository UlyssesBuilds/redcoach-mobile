export type FeedFilterType = 'all' | 'events' | 'food' | 'activity';

export interface FeedItem {
  id: string;
  type: 'event' | 'food' | 'activity';
  user: {
    name: string;
    avatar?: string;
  };
  content: string;
  timestamp: string;
  data?: {
    calories?: number;
    distance?: string;
    duration?: string;
    macros?: {
      protein: number;
      carbs: number;
      fat: number;
    };
    pace?: string;
    workout_type?: string;
    food_name?: string;
    meal_type?: string;
  };
  likes?: number;
  comments?: number;
}

// Mock data for different feed types
const mockFeedData: Record<FeedFilterType, FeedItem[]> = {
  all: [
    {
      id: '1',
      type: 'activity',
      user: { name: 'Sarah Chen' },
      content: 'Completed a 5K morning run 🏃‍♀️',
      timestamp: '2h ago',
      data: {
        distance: '5.0 km',
        duration: '26:30',
        pace: '5:18/km',
        calories: 285,
        workout_type: 'running'
      },
      likes: 12,
      comments: 3
    },
    {
      id: '2',
      type: 'food',
      user: { name: 'Mike Rodriguez' },
      content: 'Enjoyed a healthy breakfast bowl 🥗',
      timestamp: '3h ago',
      data: {
        calories: 420,
        food_name: 'Acai Bowl',
        meal_type: 'breakfast',
        macros: {
          protein: 15,
          carbs: 65,
          fat: 12
        }
      },
      likes: 8,
      comments: 1
    },
    {
      id: '3',
      type: 'event',
      user: { name: 'Jessica Park' },
      content: 'Reached my weekly goal of 10,000 steps daily! 🎯',
      timestamp: '5h ago',
      likes: 24,
      comments: 7
    },
    {
      id: '4',
      type: 'activity',
      user: { name: 'Alex Thompson' },
      content: 'Crushed leg day at the gym 💪',
      timestamp: '6h ago',
      data: {
        duration: '45 min',
        calories: 340,
        workout_type: 'strength'
      },
      likes: 15,
      comments: 2
    }
  ],
  events: [
    {
      id: '3',
      type: 'event',
      user: { name: 'Jessica Park' },
      content: 'Reached my weekly goal of 10,000 steps daily! 🎯',
      timestamp: '5h ago',
      likes: 24,
      comments: 7
    },
    {
      id: '5',
      type: 'event',
      user: { name: 'David Kim' },
      content: 'Completed 30-day fitness challenge! 🏆',
      timestamp: '1d ago',
      likes: 45,
      comments: 12
    }
  ],
  food: [
    {
      id: '2',
      type: 'food',
      user: { name: 'Mike Rodriguez' },
      content: 'Enjoyed a healthy breakfast bowl 🥗',
      timestamp: '3h ago',
      data: {
        calories: 420,
        food_name: 'Acai Bowl',
        meal_type: 'breakfast',
        macros: {
          protein: 15,
          carbs: 65,
          fat: 12
        }
      },
      likes: 8,
      comments: 1
    },
    {
      id: '6',
      type: 'food',
      user: { name: 'Emma Wilson' },
      content: 'Post-workout protein smoothie 🥤',
      timestamp: '4h ago',
      data: {
        calories: 250,
        food_name: 'Protein Smoothie',
        meal_type: 'snack',
        macros: {
          protein: 25,
          carbs: 20,
          fat: 5
        }
      },
      likes: 6,
      comments: 0
    }
  ],
  activity: [
    {
      id: '1',
      type: 'activity',
      user: { name: 'Sarah Chen' },
      content: 'Completed a 5K morning run 🏃‍♀️',
      timestamp: '2h ago',
      data: {
        distance: '5.0 km',
        duration: '26:30',
        pace: '5:18/km',
        calories: 285,
        workout_type: 'running'
      },
      likes: 12,
      comments: 3
    },
    {
      id: '4',
      type: 'activity',
      user: { name: 'Alex Thompson' },
      content: 'Crushed leg day at the gym 💪',
      timestamp: '6h ago',
      data: {
        duration: '45 min',
        calories: 340,
        workout_type: 'strength'
      },
      likes: 15,
      comments: 2
    }
  ]
};

export const fetchFeed = async (filterType: FeedFilterType = 'all'): Promise<FeedItem[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // In a real implementation, this would make an API call:
  // const response = await fetch(`/feed?filter=${filterType}`);
  // return response.json();
  
  return mockFeedData[filterType] || [];
};