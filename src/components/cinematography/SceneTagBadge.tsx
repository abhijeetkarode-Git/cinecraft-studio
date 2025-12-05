import { cn } from '@/lib/utils';
import { SceneTag } from '@/types/cinematography';

interface SceneTagBadgeProps {
  tag: SceneTag | string;
  size?: 'sm' | 'md';
  className?: string;
}

const tagColors: Record<string, string> = {
  action: 'bg-red-500/20 text-red-400 border-red-500/30',
  dialogue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  establishing: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  transition: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  dramatic: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  romantic: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  suspense: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  comedy: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
};

export function SceneTagBadge({ tag, size = 'sm', className }: SceneTagBadgeProps) {
  const colorClass = tagColors[tag] || 'bg-muted text-muted-foreground border-border';
  
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-medium capitalize",
        colorClass,
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        className
      )}
    >
      {tag}
    </span>
  );
}
