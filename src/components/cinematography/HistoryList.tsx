import { Link } from 'react-router-dom';
import { Clock, ChevronRight, Trash2 } from 'lucide-react';
import { CommandHistory } from '@/types/cinematography';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';

interface HistoryListProps {
  history: CommandHistory[];
  onClear?: () => void;
  className?: string;
  maxItems?: number;
}

export function HistoryList({ history, onClear, className, maxItems }: HistoryListProps) {
  const displayHistory = maxItems ? history.slice(0, maxItems) : history;
  
  if (history.length === 0) {
    return (
      <div className={cn("text-center py-8", className)}>
        <Clock className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">No command history yet</p>
        <p className="text-xs text-muted-foreground/70 mt-1">Your generated shot plans will appear here</p>
      </div>
    );
  }
  
  return (
    <div className={cn("space-y-2", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Recent Commands
        </h3>
        {onClear && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 text-xs text-muted-foreground hover:text-destructive"
            onClick={onClear}
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Clear
          </Button>
        )}
      </div>
      
      {/* History items */}
      <div className="space-y-1">
        {displayHistory.map((item) => (
          <Link
            key={item.id}
            to={item.shotPlanId ? `/shot-plan/${item.shotPlanId}` : '#'}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg",
              "bg-secondary/30 hover:bg-secondary/50 transition-colors",
              "group"
            )}
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground truncate font-mono">
                {item.command}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
              </p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        ))}
      </div>
      
      {maxItems && history.length > maxItems && (
        <Link
          to="/library"
          className="block text-center text-sm text-primary hover:underline py-2"
        >
          View all {history.length} commands
        </Link>
      )}
    </div>
  );
}
