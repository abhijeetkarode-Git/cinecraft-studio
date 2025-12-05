import { ShotPlan } from '@/types/cinematography';
import { SceneTagBadge } from './SceneTagBadge';
import { StoryboardPlaceholder } from './StoryboardPlaceholder';
import { BlockingDiagramPlaceholder } from './BlockingDiagramPlaceholder';
import { cn } from '@/lib/utils';
import { 
  Camera, Aperture, Move, Layers, Sun, Palette, 
  Film, Clock, MapPin, Cloud, Thermometer
} from 'lucide-react';

interface ShotPlanDetailProps {
  shotPlan: ShotPlan;
  className?: string;
}

export function ShotPlanDetail({ shotPlan, className }: ShotPlanDetailProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Film className="h-4 w-4" />
              <span>Shot Plan</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {shotPlan.shotType}
            </h1>
            <p className="text-muted-foreground font-mono text-sm">
              "{shotPlan.command}"
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {shotPlan.tags.map(tag => (
              <SceneTagBadge key={tag} tag={tag} size="md" />
            ))}
          </div>
        </div>
        
        {/* Scene info row */}
        <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-border/30 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            <span>{shotPlan.location}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4 text-amber-400" />
            <span>{shotPlan.timeOfDay}</span>
          </div>
          {shotPlan.weather && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Cloud className="h-4 w-4 text-blue-400" />
              <span>{shotPlan.weather}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-muted-foreground">
            <Thermometer className="h-4 w-4 text-orange-400" />
            <span className="capitalize">{shotPlan.sceneType}</span>
          </div>
        </div>
      </div>
      
      {/* Visuals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Storyboard Frame</h3>
          <StoryboardPlaceholder shotPlan={shotPlan} />
        </div>
        <div className="glass-card p-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Blocking Diagram</h3>
          <BlockingDiagramPlaceholder shotPlan={shotPlan} />
        </div>
      </div>
      
      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Camera Setup */}
        <div className="glass-card p-6">
          <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
            <Camera className="h-5 w-5 text-primary" />
            Camera Setup
          </h3>
          <div className="space-y-3">
            <DetailRow label="Position" value={shotPlan.camera.position} />
            <DetailRow label="Angle" value={shotPlan.camera.angle.replace(/-/g, ' ')} />
            <DetailRow label="Lens" value={`${shotPlan.camera.lens} (${shotPlan.camera.focalLength})`} />
            <DetailRow label="Aperture" value={shotPlan.camera.aperture} />
            <DetailRow label="Framing" value={shotPlan.camera.framing.replace(/-/g, ' ')} />
            <DetailRow label="Stabilization" value={shotPlan.camera.stabilization} />
          </div>
        </div>
        
        {/* Movement */}
        <div className="glass-card p-6">
          <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
            <Move className="h-5 w-5 text-accent" />
            Camera Movement
          </h3>
          <div className="space-y-3">
            <DetailRow label="Type" value={shotPlan.camera.movement} />
            <DetailRow label="Duration" value={shotPlan.duration} />
            <div className="pt-3 mt-3 border-t border-border/30">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {shotPlan.description}
              </p>
            </div>
          </div>
        </div>
        
        {/* Lighting */}
        <div className="glass-card p-6">
          <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
            <Sun className="h-5 w-5 text-amber-400" />
            Lighting Setup
          </h3>
          <div className="space-y-3">
            <DetailRow label="Style" value={shotPlan.lighting.style} />
            <DetailRow label="Key Light" value={shotPlan.lighting.keyLight} />
            <DetailRow label="Fill Light" value={shotPlan.lighting.fillLight} />
            {shotPlan.lighting.backLight && (
              <DetailRow label="Back Light" value={shotPlan.lighting.backLight} />
            )}
            <DetailRow label="Color Temp" value={shotPlan.lighting.colorTemperature} />
            <DetailRow label="Contrast" value={shotPlan.lighting.contrast} />
            {shotPlan.lighting.practicals && (
              <DetailRow label="Practicals" value={shotPlan.lighting.practicals.join(', ')} />
            )}
          </div>
        </div>
        
        {/* Mood & Style */}
        <div className="glass-card p-6">
          <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
            <Palette className="h-5 w-5 text-pink-400" />
            Mood & Style
          </h3>
          <div className="space-y-3">
            <DetailRow label="Mood" value={shotPlan.mood} />
            <DetailRow label="Style" value={shotPlan.cinematicStyle} />
            <div className="pt-3">
              <span className="text-xs text-muted-foreground block mb-2">Color Palette</span>
              <div className="flex gap-2">
                {shotPlan.colorPalette.map((color, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-lg border border-border/50"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
            <div className="pt-3">
              <span className="text-xs text-muted-foreground block mb-2">References</span>
              <ul className="text-sm text-muted-foreground space-y-1">
                {shotPlan.references.map((ref, i) => (
                  <li key={i}>• {ref}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm text-foreground font-medium capitalize">{value}</span>
    </div>
  );
}
