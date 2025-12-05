import { ImageIcon, Frame } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ShotPlan } from '@/types/cinematography';

interface StoryboardPlaceholderProps {
  shotPlan: ShotPlan;
  className?: string;
}

export function StoryboardPlaceholder({ shotPlan, className }: StoryboardPlaceholderProps) {
  return (
    <div className={cn(
      "relative aspect-video rounded-xl overflow-hidden",
      "bg-gradient-to-br from-secondary to-muted",
      "border border-border/50",
      className
    )}>
      {/* Grid overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--foreground)) 1px, transparent 1px)
          `,
          backgroundSize: '20% 20%',
        }}
      />
      
      {/* Rule of thirds */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-0 right-0 h-px bg-primary/30" />
        <div className="absolute top-2/3 left-0 right-0 h-px bg-primary/30" />
        <div className="absolute left-1/3 top-0 bottom-0 w-px bg-primary/30" />
        <div className="absolute left-2/3 top-0 bottom-0 w-px bg-primary/30" />
      </div>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground gap-4">
        <div className="relative">
          <Frame className="h-16 w-16 opacity-30" />
          <ImageIcon className="h-8 w-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-50" />
        </div>
        <div className="text-center px-4">
          <p className="text-sm font-medium text-foreground/70">Storyboard Frame</p>
          <p className="text-xs mt-1 max-w-xs">
            {shotPlan.camera.framing.replace(/-/g, ' ')} • {shotPlan.camera.angle.replace(/-/g, ' ')} angle
          </p>
        </div>
      </div>
      
      {/* Frame info */}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-background/90 to-transparent">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground font-mono">{shotPlan.camera.focalLength}</span>
          <span className="text-muted-foreground">{shotPlan.camera.movement}</span>
          <span className="text-muted-foreground font-mono">{shotPlan.camera.aperture}</span>
        </div>
      </div>
      
      {/* Aspect ratio markers */}
      <div className="absolute top-2 left-2 text-[10px] font-mono text-muted-foreground/50">16:9</div>
      <div className="absolute top-2 right-2 flex items-center gap-1">
        <div className="w-2 h-2 rounded-full bg-red-500/70" />
        <span className="text-[10px] font-mono text-muted-foreground/50">REC</span>
      </div>
    </div>
  );
}
