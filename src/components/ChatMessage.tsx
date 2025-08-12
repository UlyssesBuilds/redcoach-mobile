import { ChatMessage as ChatMessageType } from '@/lib/chatService';
import { Card } from '@/components/ui/card';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === 'user';
  
  if (message.isLoading) {
    return (
      <div className="flex items-start space-x-3 animate-in slide-in-from-bottom-4 duration-300">
        <div className="w-8 h-8 bg-gradient-card border border-coach-border rounded-full flex items-center justify-center flex-shrink-0">
          <Bot className="w-4 h-4 text-coach-red" />
        </div>
        <Card className="bg-gradient-card border-coach-border max-w-[80%] p-4">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-coach-red rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-coach-red rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
            <div className="w-2 h-2 bg-coach-red rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={`flex items-start space-x-3 animate-in slide-in-from-bottom-4 duration-300 ${
      isUser ? 'flex-row-reverse space-x-reverse' : ''
    }`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
        isUser 
          ? 'bg-gradient-primary' 
          : 'bg-gradient-card border border-coach-border'
      }`}>
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-coach-red" />
        )}
      </div>
      
      <Card className={`max-w-[80%] p-4 ${
        isUser 
          ? 'bg-gradient-primary border-none' 
          : 'bg-gradient-card border-coach-border'
      }`}>
        <div className={`text-sm leading-relaxed whitespace-pre-wrap ${
          isUser ? 'text-white' : 'text-foreground'
        }`}>
          {message.content}
        </div>
        <div className={`text-xs mt-2 ${
          isUser ? 'text-white/70' : 'text-muted-foreground'
        }`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </Card>
    </div>
  );
};