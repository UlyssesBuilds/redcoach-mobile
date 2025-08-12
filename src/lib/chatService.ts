export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'ai';
  timestamp: Date;
  isLoading?: boolean;
}

export interface QuickQuestion {
  id: string;
  text: string;
  category: string;
}

export class ChatService {
  private static instance: ChatService;
  private apiKey: string | null = null;

  static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  getQuickQuestions(): QuickQuestion[] {
    return [
      {
        id: '1',
        text: 'What should I eat before a morning run?',
        category: 'nutrition'
      },
      {
        id: '2',
        text: 'How can I improve my running form?',
        category: 'technique'
      },
      {
        id: '3',
        text: 'What are some good recovery foods?',
        category: 'recovery'
      },
      {
        id: '4',
        text: 'How often should I do strength training?',
        category: 'training'
      }
    ];
  }

  async sendMessage(message: string): Promise<string> {
    // For MVP, we'll use a mock API response
    // This structure makes it easy to later integrate with real AI APIs
    return this.mockAIResponse(message);
  }

  private async mockAIResponse(userMessage: string): Promise<string> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    // Mock responses based on message content
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('eat') || lowerMessage.includes('food') || lowerMessage.includes('nutrition')) {
      return `Great question about nutrition! For optimal performance, I recommend eating a light snack 30-60 minutes before your run. Try a banana with a small amount of peanut butter, or some oatmeal with berries. 

Here are some key points:
• Focus on easily digestible carbs
• Avoid high fiber or high fat foods
• Stay hydrated
• Listen to your body's needs

Would you like specific meal suggestions for different types of workouts?`;
    }

    if (lowerMessage.includes('run') || lowerMessage.includes('form') || lowerMessage.includes('technique')) {
      return `Excellent question about running form! Here are my top tips for better running technique:

🏃‍♂️ **Posture**: Keep your head up, shoulders relaxed, and maintain a slight forward lean from your ankles
🦶 **Foot Strike**: Aim to land mid-foot under your center of gravity
💨 **Cadence**: Target 170-180 steps per minute
🤲 **Arms**: Keep them at 90 degrees, swinging naturally

Practice these gradually and focus on one element at a time. Your form will improve with consistent practice!`;
    }

    if (lowerMessage.includes('recovery') || lowerMessage.includes('rest')) {
      return `Recovery is just as important as training! Here's what I recommend:

🍎 **Post-workout nutrition**: Eat a combination of protein and carbs within 30 minutes
💧 **Hydration**: Replace fluids lost during exercise
😴 **Sleep**: Aim for 7-9 hours of quality sleep
🧘‍♀️ **Active recovery**: Light walking, stretching, or yoga

Some great recovery foods include:
• Greek yogurt with berries
• Chocolate milk
• Quinoa bowl with vegetables
• Sweet potato with lean protein

What specific aspect of recovery would you like to explore further?`;
    }

    if (lowerMessage.includes('strength') || lowerMessage.includes('training') || lowerMessage.includes('workout')) {
      return `Strength training is crucial for runners! Here's my recommendation:

📅 **Frequency**: 2-3 times per week for runners
🎯 **Focus areas**: Core, glutes, legs, and upper body
⏰ **Duration**: 30-45 minutes per session

Key exercises to include:
• Squats and lunges
• Deadlifts
• Planks and core work
• Single-leg exercises
• Upper body pulling movements

Start with bodyweight exercises and gradually add resistance. The key is consistency rather than intensity when you're beginning!`;
    }

    // Default response for general questions
    return `Thanks for your question! As your AI coach, I'm here to help you achieve your fitness goals. 

I can provide guidance on:
🏃‍♂️ Running technique and training
🥗 Nutrition and meal planning  
💪 Strength training routines
🧘‍♀️ Recovery and injury prevention
📊 Goal setting and motivation

What specific area would you like to focus on today? Feel free to ask me anything about your fitness journey!`;
  }

  formatMessage(content: string, role: 'user' | 'ai'): ChatMessage {
    return {
      id: `${Date.now()}-${Math.random()}`,
      content,
      role,
      timestamp: new Date(),
      isLoading: false
    };
  }

  createLoadingMessage(): ChatMessage {
    return {
      id: `loading-${Date.now()}`,
      content: '',
      role: 'ai',
      timestamp: new Date(),
      isLoading: true
    };
  }
}