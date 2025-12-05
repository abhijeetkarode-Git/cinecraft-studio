import { Recommendation } from '@/types/cinematography';
import { cn } from '@/lib/utils';
import { 
  ArrowDown, MoveRight, RotateCcw, Plane, Sun, Aperture,
  Lightbulb, Camera, Clapperboard
} from 'lucide-react';

interface RecommendationCardProps {
  recommendation: Recommendation;
  onApply?: () => void;
  className?: string;
}

const iconMap: Record<string, React.ElementType> = {
  ArrowDown,
  MoveRight,
  RotateCcw,
  Plane,
  Sun,
  Aperture,
  Lightbulb,
  Camera,
  Clapperboard,
};

const typeColors: Record<string, string> = {
  angle: 'from-blue-500/20 to-blue-500/5 border-blue-500/30',
  movement: 'from-purple-500/20 to-purple-500/5 border-purple-500/30',
  lighting: 'from-amber-500/20 to-amber-500/5 border-amber-500/30',
  lens: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/30',
  style: 'from-pink-500/20 to-pink-500/5 border-pink-500/30',
};

const typeIconColors: Record<string, string> = {
  angle: 'text-blue-400',
  movement: 'text-purple-400',
  lighting: 'text-amber-400',
  lens: 'text-emerald-400',
  style: 'text-pink-400',
};

export function RecommendationCard({ recommendation, onApply, className }: RecommendationCardProps) {
  const Icon = iconMap[recommendation.icon] || Clapperboard;
  const colorClass = typeColors[recommendation.type] || 'from-muted to-muted/50';
  const iconColor = typeIconColors[recommendation.type] || 'text-muted-foreground';
  
  return (
    <div className={cn(
      "relative rounded-xl border overflow-hidden",
      "bg-gradient-to-br",
      colorClass,
      "hover:border-primary/50 transition-all duration-300 group",
      "cursor-pointer",
      className
    )}
    onClick={onApply}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div className={cn(
            "p-2 rounded-lg bg-background/50",
            iconColor
          )}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <span className={cn(
              "text-xs font-medium uppercase tracking-wider",
              iconColor
            )}>
              {recommendation.type}
            </span>
            <h3 className="font-semibold text-foreground mt-0.5">
              {recommendation.title}
            </h3>
          </div>
        </div>
        
        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          {recommendation.description}
        </p>
        
        {/* Benefit */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground">Benefit:</span>
          <span className="text-foreground/80">{recommendation.benefit}</span>
        </div>
      </div>
      
      {/* Hover indicator */}
      <div className="absolute inset-0 flex items-center justify-center bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-sm font-medium text-primary">Click to Apply</span>
      </div>
    </div>
  );
}
