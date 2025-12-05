import { useStore } from '@/store/useStore';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Notifications() {
  const { notifications, removeNotification } = useStore();
  
  if (notifications.length === 0) return null;
  
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg animate-slide-in-right",
            "bg-card border border-border/50 backdrop-blur-xl",
            notification.type === 'success' && "border-l-4 border-l-green-500",
            notification.type === 'error' && "border-l-4 border-l-destructive",
            notification.type === 'info' && "border-l-4 border-l-accent"
          )}
        >
          {notification.type === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
          {notification.type === 'error' && <AlertCircle className="h-5 w-5 text-destructive" />}
          {notification.type === 'info' && <Info className="h-5 w-5 text-accent" />}
          
          <span className="text-sm text-foreground">{notification.message}</span>
          
          <button
            onClick={() => removeNotification(notification.id)}
            className="ml-2 p-1 rounded hover:bg-secondary transition-colors"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      ))}
    </div>
  );
}
