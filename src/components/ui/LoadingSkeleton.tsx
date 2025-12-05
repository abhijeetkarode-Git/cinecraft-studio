import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'text' | 'card' | 'avatar' | 'button';
}

export function LoadingSkeleton({ className, variant = 'text' }: LoadingSkeletonProps) {
  const variants = {
    text: 'h-4 w-full rounded',
    card: 'h-48 w-full rounded-xl',
    avatar: 'h-10 w-10 rounded-full',
    button: 'h-10 w-24 rounded-lg',
  };
  
  return (
    <div className={cn('shimmer', variants[variant], className)} />
  );
}

export function CardSkeleton() {
  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-center gap-3">
        <LoadingSkeleton variant="avatar" />
        <div className="flex-1 space-y-2">
          <LoadingSkeleton className="w-1/3" />
          <LoadingSkeleton className="w-1/2" />
        </div>
      </div>
      <LoadingSkeleton />
      <LoadingSkeleton className="w-3/4" />
      <div className="flex gap-2 pt-2">
        <LoadingSkeleton variant="button" />
        <LoadingSkeleton variant="button" />
      </div>
    </div>
  );
}

export function ShotPlanSkeleton() {
  return (
    <div className="space-y-6">
      <LoadingSkeleton variant="card" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6 space-y-4">
          <LoadingSkeleton className="w-1/4 h-6" />
          <LoadingSkeleton />
          <LoadingSkeleton />
          <LoadingSkeleton className="w-2/3" />
        </div>
        <div className="glass-card p-6 space-y-4">
          <LoadingSkeleton className="w-1/4 h-6" />
          <LoadingSkeleton />
          <LoadingSkeleton />
          <LoadingSkeleton className="w-2/3" />
        </div>
      </div>
    </div>
  );
}
