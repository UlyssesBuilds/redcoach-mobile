import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FeedItem as FeedItemType } from "@/lib/feedService";
import { Heart, MessageCircle, Calendar, Utensils, Dumbbell, Award } from "lucide-react";

interface FeedItemProps {
  item: FeedItemType;
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'event':
      return <Award className="w-5 h-5 text-coach-red" />;
    case 'food':
      return <Utensils className="w-5 h-5 text-coach-red" />;
    case 'activity':
      return <Dumbbell className="w-5 h-5 text-coach-red" />;
    default:
      return <Calendar className="w-5 h-5 text-coach-red" />;
  }
};

const getTypeColor = (type: string) => {
  return 'bg-muted/50 border-border';
};

export const FeedItem = ({ item }: FeedItemProps) => {
  return (
    <Card className={`bg-gradient-card border-coach-border ${getTypeColor(item.type)}`}>
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-coach-red to-coach-red/70 rounded-full flex items-center justify-center text-white font-semibold">
            {item.user.name.charAt(0)}
          </div>
          <div className="flex-1">
            <p className="font-medium text-foreground">{item.user.name}</p>
            <p className="text-sm text-muted-foreground">{item.timestamp}</p>
          </div>
          <div className="w-8 h-8 bg-coach-red/10 rounded-lg flex items-center justify-center">
            {getTypeIcon(item.type)}
          </div>
        </div>

        {/* Content */}
        <p className="text-foreground mb-3">{item.content}</p>

        {/* Data based on type */}
        {item.data && (
          <div className="space-y-2 mb-3">
            {item.type === 'activity' && (
              <div className="flex flex-wrap gap-2">
                {item.data.distance && <Badge variant="outline">{item.data.distance}</Badge>}
                {item.data.duration && <Badge variant="outline">{item.data.duration}</Badge>}
                {item.data.pace && <Badge variant="outline">{item.data.pace}</Badge>}
                {item.data.calories && <Badge variant="outline">{item.data.calories} cal</Badge>}
              </div>
            )}
            
            {item.type === 'food' && (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {item.data.calories && <Badge variant="outline">{item.data.calories} cal</Badge>}
                  {item.data.meal_type && (
                    <Badge variant="outline" className="capitalize">{item.data.meal_type}</Badge>
                  )}
                </div>
                {item.data.macros && (
                  <div className="flex gap-2 text-sm">
                    <span className="text-muted-foreground">P: {item.data.macros.protein}g</span>
                    <span className="text-muted-foreground">C: {item.data.macros.carbs}g</span>
                    <span className="text-muted-foreground">F: {item.data.macros.fat}g</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4 pt-2 border-t border-coach-border">
          <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground hover:text-coach-red">
            <Heart className="w-4 h-4" />
            {item.likes || 0}
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground hover:text-coach-red">
            <MessageCircle className="w-4 h-4" />
            {item.comments || 0}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};