import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from '@/components/ChatMessage';
import { ChatService, ChatMessage as ChatMessageType, QuickQuestion } from '@/lib/chatService';
import { Send, Sparkles } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const AIChatScreen = () => {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const chatService = ChatService.getInstance();
  const quickQuestions = chatService.getQuickQuestions();

  // Welcome message
  useEffect(() => {
    const welcomeMessage = chatService.formatMessage(
      `👋 Hey there! I'm your RedCoach AI assistant, ready to help you crush your fitness goals!

I can help you with:
🏃‍♂️ Training plans and running tips
🥗 Nutrition advice and meal planning
💪 Strength training guidance
🧘‍♀️ Recovery and injury prevention

What would you like to know about today?`,
      'ai'
    );
    setMessages([welcomeMessage]);
  }, []);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputValue.trim();
    if (!text || isLoading) return;

    const userMessage = chatService.formatMessage(text, 'user');
    const loadingMessage = chatService.createLoadingMessage();

    setMessages(prev => [...prev, userMessage, loadingMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const aiResponse = await chatService.sendMessage(text);
      const aiMessage = chatService.formatMessage(aiResponse, 'ai');

      setMessages(prev => {
        // Remove loading message and add AI response
        const withoutLoading = prev.filter(msg => !msg.isLoading);
        return [...withoutLoading, aiMessage];
      });
    } catch (error) {
      console.error('Failed to get AI response:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get response from AI coach. Please try again.",
      });
      
      // Remove loading message on error
      setMessages(prev => prev.filter(msg => !msg.isLoading));
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question: QuickQuestion) => {
    setInputValue(question.text);
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-subtle">
      {/* Header */}
      <div className="bg-gradient-card border-b border-coach-border p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">RedCoach AI</h1>
            <p className="text-sm text-muted-foreground">Your personal fitness assistant</p>
          </div>
        </div>
      </div>

      {/* Quick Questions */}
      {messages.length <= 1 && (
        <div className="p-4 border-b border-coach-border bg-gradient-card">
          <h3 className="text-sm font-medium text-foreground mb-3">Quick Questions</h3>
          <div className="grid grid-cols-1 gap-2">
            {quickQuestions.map((question) => (
              <Button
                key={question.id}
                variant="coach-outline"
                size="sm"
                className="justify-start text-left h-auto py-3 px-4"
                onClick={() => handleQuickQuestion(question)}
              >
                <span className="text-sm">{question.text}</span>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 bg-gradient-card border-t border-coach-border">
        <div className="flex items-center space-x-3">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about fitness..."
            className="flex-1 bg-coach-input border-coach-border focus:border-coach-red"
            disabled={isLoading}
          />
          <Button
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim() || isLoading}
            size="icon"
            className="bg-gradient-primary hover:bg-coach-red-dark disabled:opacity-50"
          >
            <Send className="w-4 h-4 text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
};