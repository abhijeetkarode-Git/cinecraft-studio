import { useState, useEffect, useRef } from 'react';
import { CameraPath } from '@/types/simulation';
import { getPositionAtProgress } from '@/lib/cameraPathGenerator';
import { Button } from '@/components/ui/button';
import { 
  Play, Pause, RotateCcw, Save,
  ArrowRight, RotateCw, Maximize2, ArrowUp
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CameraPathVisualizerProps {
  cameraPath: CameraPath;
  onSave?: (path: CameraPath) => void;
  className?: string;
}

export function CameraPathVisualizer({ cameraPath, onSave, className }: CameraPathVisualizerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const animationRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);

  // Animation loop
  useEffect(() => {
    if (isPlaying) {
      const animate = (time: number) => {
        if (lastTimeRef.current === 0) {
          lastTimeRef.current = time;
        }
        const delta = (time - lastTimeRef.current) / 1000;
        lastTimeRef.current = time;
        
        setProgress(prev => {
          const next = prev + delta / cameraPath.duration;
          if (next >= 1) {
            setIsPlaying(false);
            lastTimeRef.current = 0;
            return 1;
          }
          return next;
        });
        
        animationRef.current = requestAnimationFrame(animate);
      };
      
      animationRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, cameraPath.duration]);

  const handleReset = () => {
    setIsPlaying(false);
    setProgress(0);
    lastTimeRef.current = 0;
  };

  const currentPosition = getPositionAtProgress(cameraPath, progress);

  // Map 3D path to 2D SVG coordinates
  const mapToSVG = (point: { x: number; y: number; z: number }) => {
    // Top-down view: x stays x, z becomes y
    const scale = 15;
    return {
      x: 150 + point.x * scale,
      y: 150 - point.z * scale, // Invert z for proper orientation
    };
  };

  const pathPoints = cameraPath.pathPoints.map(mapToSVG);
  const currentSVG = mapToSVG(currentPosition);
  const targetSVG = { x: 150, y: 150 }; // Subject at center

  const getMovementIcon = () => {
    switch (cameraPath.movementType) {
      case 'dolly': return <ArrowRight className="h-4 w-4" />;
      case 'tracking': return <ArrowRight className="h-4 w-4" />;
      case 'orbit': return <RotateCw className="h-4 w-4" />;
      case 'crane': return <ArrowUp className="h-4 w-4" />;
      default: return <Maximize2 className="h-4 w-4" />;
    }
  };

  return (
    <div className={cn("glass-card p-4", className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-accent/20 text-accent">
            {getMovementIcon()}
          </div>
          <div>
            <h3 className="text-sm font-semibold">Camera Path</h3>
            <p className="text-xs text-muted-foreground capitalize">
              {cameraPath.movementType} • {cameraPath.speed} • {cameraPath.direction}
            </p>
          </div>
        </div>
        {onSave && (
          <Button variant="ghost" size="sm" onClick={() => onSave(cameraPath)}>
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
        )}
      </div>

      {/* SVG Visualization - Top Down View */}
      <div className="relative bg-background/50 rounded-lg overflow-hidden">
        <svg viewBox="0 0 300 300" className="w-full aspect-square">
          {/* Grid */}
          <defs>
            <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.3" />
            </pattern>
          </defs>
          <rect width="300" height="300" fill="url(#grid)" />
          
          {/* Center crosshair (subject) */}
          <circle cx="150" cy="150" r="12" fill="hsl(var(--primary))" opacity="0.3" />
          <circle cx="150" cy="150" r="6" fill="hsl(var(--primary))" />
          <text x="150" y="175" textAnchor="middle" className="text-[10px] fill-muted-foreground">Subject</text>
          
          {/* Camera path */}
          {pathPoints.length > 1 && (
            <path
              d={`M ${pathPoints[0].x} ${pathPoints[0].y} ${pathPoints.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')}`}
              fill="none"
              stroke="hsl(var(--accent))"
              strokeWidth="2"
              strokeDasharray="4 2"
              opacity="0.7"
            />
          )}
          
          {/* Start position */}
          <circle 
            cx={pathPoints[0]?.x || 150} 
            cy={pathPoints[0]?.y || 200} 
            r="8" 
            fill="hsl(var(--muted))" 
            stroke="hsl(var(--border))" 
            strokeWidth="2"
          />
          <text 
            x={(pathPoints[0]?.x || 150) + 12} 
            y={(pathPoints[0]?.y || 200) + 4} 
            className="text-[9px] fill-muted-foreground"
          >
            Start
          </text>
          
          {/* End position */}
          <circle 
            cx={pathPoints[pathPoints.length - 1]?.x || 150} 
            cy={pathPoints[pathPoints.length - 1]?.y || 100} 
            r="8" 
            fill="hsl(var(--muted))" 
            stroke="hsl(var(--accent))" 
            strokeWidth="2"
          />
          <text 
            x={(pathPoints[pathPoints.length - 1]?.x || 150) + 12} 
            y={(pathPoints[pathPoints.length - 1]?.y || 100) + 4} 
            className="text-[9px] fill-muted-foreground"
          >
            End
          </text>
          
          {/* Current camera position */}
          <g transform={`translate(${currentSVG.x}, ${currentSVG.y})`}>
            {/* Camera direction line */}
            <line 
              x1="0" 
              y1="0" 
              x2={targetSVG.x - currentSVG.x} 
              y2={targetSVG.y - currentSVG.y} 
              stroke="hsl(var(--primary))" 
              strokeWidth="1" 
              opacity="0.5"
              strokeDasharray="2 2"
            />
            {/* Camera body */}
            <rect x="-8" y="-6" width="16" height="12" rx="2" fill="hsl(var(--primary))" />
            <rect x="8" y="-3" width="4" height="6" rx="1" fill="hsl(var(--primary))" />
          </g>
          
          {/* Legend */}
          <g transform="translate(10, 270)">
            <text className="text-[9px] fill-muted-foreground font-medium">Top-Down View</text>
          </g>
        </svg>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{Math.round(progress * 100)}%</span>
          <div className="w-24 h-1 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-accent transition-all duration-100"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <span>{cameraPath.duration}s</span>
        </div>
      </div>

      {/* Path Info */}
      <div className="grid grid-cols-3 gap-2 mt-4 text-xs">
        <div className="bg-background/50 rounded p-2">
          <span className="text-muted-foreground block">Radius</span>
          <span className="font-medium">{cameraPath.radius || 'N/A'}</span>
        </div>
        <div className="bg-background/50 rounded p-2">
          <span className="text-muted-foreground block">Points</span>
          <span className="font-medium">{cameraPath.pathPoints.length}</span>
        </div>
        <div className="bg-background/50 rounded p-2">
          <span className="text-muted-foreground block">Position</span>
          <span className="font-medium font-mono text-[10px]">
            {currentPosition.x.toFixed(1)}, {currentPosition.z.toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  );
}
