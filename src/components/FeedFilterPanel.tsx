import { Button } from "@/components/ui/button";
import { FeedFilterType } from "@/lib/feedService";
import { Users, Calendar, Utensils, Dumbbell } from "lucide-react";

interface FilterPanelProps {
  activeFilter: FeedFilterType;
  onFilterChange: (filter: FeedFilterType) => void;
  isLoading?: boolean;
}

const filterConfig = [
  { value: 'all' as const, label: 'All', icon: Users },
  { value: 'events' as const, label: 'Circle', icon: Calendar },
  { value: 'food' as const, label: 'Food', icon: Utensils },
  { value: 'activity' as const, label: 'Exercise', icon: Dumbbell },
];

export const FeedFilterPanel = ({ activeFilter, onFilterChange, isLoading }: FilterPanelProps) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {filterConfig.map(({ value, label, icon: Icon }) => (
        <Button
          key={value}
          variant={activeFilter === value ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange(value)}
          disabled={isLoading}
          className={`flex-shrink-0 flex items-center gap-2 ${
            activeFilter === value 
              ? 'bg-coach-red hover:bg-coach-red/90 text-white border-coach-red' 
              : 'border-coach-border hover:bg-coach-red/10'
          }`}
        >
          <Icon className="w-4 h-4" />
          {label}
        </Button>
      ))}
    </div>
  );
};