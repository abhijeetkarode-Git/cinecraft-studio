import { cn } from '@/lib/utils';
import { ShotPlan } from '@/types/cinematography';
import { Video, User, Lightbulb, ArrowRight } from 'lucide-react';

interface BlockingDiagramPlaceholderProps {
  shotPlan: ShotPlan;
  className?: string;
}

export function BlockingDiagramPlaceholder({ shotPlan, className }: BlockingDiagramPlaceholderProps) {
  return (
    <div className={cn(
      "relative aspect-square rounded-xl overflow-hidden",
      "bg-gradient-to-br from-secondary to-muted",
      "border border-border/50",
      className
    )}>
      {/* Grid background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            radial-gradient(circle, hsl(var(--muted-foreground)) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px',
        }}
      />
      
      {/* Camera icon */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
            <Video className="h-5 w-5 text-primary" />
          </div>
          <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-mono text-primary whitespace-nowrap">
            CAM A
          </span>
          
          {/* Camera movement indicator */}
          {shotPlan.camera.movement !== 'Static' && (
            <div className="absolute -right-6 top-1/2 -translate-y-1/2">
              <ArrowRight className="h-4 w-4 text-primary animate-pulse" />
            </div>
          )}
        </div>
      </div>
      
      {/* Subject icon */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center">
            <User className="h-4 w-4 text-accent" />
          </div>
          <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-mono text-accent whitespace-nowrap">
            SUBJECT
          </span>
        </div>
      </div>
      
      {/* Key light */}
      <div className="absolute top-1/4 right-8">
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center">
            <Lightbulb className="h-3 w-3 text-amber-400" />
          </div>
          <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[9px] font-mono text-amber-400 whitespace-nowrap">
            KEY
          </span>
          {/* Light rays */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-px h-8 bg-gradient-to-b from-amber-400/30 to-transparent" />
        </div>
      </div>
      
      {/* Fill light */}
      <div className="absolute top-1/3 left-8">
        <div className="relative">
          <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/50 flex items-center justify-center">
            <Lightbulb className="h-2.5 w-2.5 text-blue-400" />
          </div>
          <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[9px] font-mono text-blue-400 whitespace-nowrap">
            FILL
          </span>
        </div>
      </div>
      
      {/* Camera angle line */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--primary))" fillOpacity="0.5" />
          </marker>
        </defs>
        <line 
          x1="50" y1="75" x2="50" y2="40" 
          stroke="hsl(var(--primary))" 
          strokeWidth="0.5" 
          strokeDasharray="2,2"
          strokeOpacity="0.5"
          markerEnd="url(#arrowhead)"
        />
      </svg>
      
      {/* Legend */}
      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-center gap-4 text-[9px] text-muted-foreground">
        <span>Angle: {shotPlan.camera.angle}</span>
        <span>•</span>
        <span>Movement: {shotPlan.camera.movement}</span>
      </div>
      
      {/* Title */}
      <div className="absolute top-3 left-3">
        <span className="text-xs font-medium text-foreground/70">Blocking Diagram</span>
      </div>
    </div>
  );
}
