import { Link } from 'react-router-dom';
import { Camera, Clock, Aperture, Sun, Trash2, ExternalLink } from 'lucide-react';
import { ShotPlan } from '@/types/cinematography';
import { SceneTagBadge } from './SceneTagBadge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface ShotPlanCardProps {
  shotPlan: ShotPlan;
  onDelete?: (id: string) => void;
  className?: string;
}

export function ShotPlanCard({ shotPlan, onDelete, className }: ShotPlanCardProps) {
  return (
    <div className={cn(
      "glass-card group hover:border-primary/30 transition-all duration-300",
      "hover:shadow-lg hover:shadow-primary/10",
      className
    )}>
      {/* Header */}
      <div className="p-4 border-b border-border/30">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate mb-1">
              {shotPlan.shotType}
            </h3>
            <p className="text-sm text-muted-foreground truncate font-mono">
              "{shotPlan.command}"
            </p>
          </div>
          <div className="flex items-center gap-1">
            <Link to={`/shot-plan/${shotPlan.id}`}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </Link>
            {onDelete && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={() => onDelete(shotPlan.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Scene info */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Camera className="h-4 w-4 text-primary" />
            <span>{shotPlan.camera.focalLength} {shotPlan.camera.lens}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Aperture className="h-4 w-4 text-accent" />
            <span>{shotPlan.camera.aperture}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Sun className="h-4 w-4 text-amber-400" />
            <span>{shotPlan.lighting.style}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{shotPlan.duration}</span>
          </div>
        </div>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {shotPlan.tags.map(tag => (
            <SceneTagBadge key={tag} tag={tag} />
          ))}
        </div>
        
        {/* Color palette preview */}
        <div className="flex items-center gap-1">
          {shotPlan.colorPalette.map((color, i) => (
            <div
              key={i}
              className="h-4 flex-1 rounded-sm first:rounded-l-md last:rounded-r-md"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border/30">
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(shotPlan.createdAt), { addSuffix: true })}
          </span>
          <span className={cn(
            "text-xs px-2 py-0.5 rounded-full",
            shotPlan.sceneType === 'exterior' 
              ? 'bg-emerald-500/20 text-emerald-400' 
              : 'bg-blue-500/20 text-blue-400'
          )}>
            {shotPlan.sceneType}
          </span>
        </div>
      </div>
    </div>
  );
}
