import { useState } from 'react';
import { SceneComposition } from '@/types/simulation';
import { getLightArrowDirection } from '@/lib/compositionAnalyzer';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  Save, Grid3X3, TrendingUp, Sun, Lightbulb,
  CheckCircle2, Circle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CompositionOverlayProps {
  composition: SceneComposition;
  onUpdate?: (composition: SceneComposition) => void;
  onSave?: (composition: SceneComposition) => void;
  className?: string;
}

export function CompositionOverlay({ composition, onUpdate, onSave, className }: CompositionOverlayProps) {
  const [showRuleOfThirds, setShowRuleOfThirds] = useState(composition.ruleOfThirdsEnabled);
  const [showLeadingLines, setShowLeadingLines] = useState(composition.leadingLinesEnabled);
  const [showLighting, setShowLighting] = useState(true);

  const keyArrow = getLightArrowDirection(composition.keyLightDirection);
  const fillArrow = getLightArrowDirection(composition.fillLightDirection);
  const rimArrow = composition.rimLightDirection ? getLightArrowDirection(composition.rimLightDirection) : null;

  const handleToggle = (type: 'ruleOfThirds' | 'leadingLines' | 'lighting', value: boolean) => {
    if (type === 'ruleOfThirds') {
      setShowRuleOfThirds(value);
      onUpdate?.({ ...composition, ruleOfThirdsEnabled: value });
    } else if (type === 'leadingLines') {
      setShowLeadingLines(value);
      onUpdate?.({ ...composition, leadingLinesEnabled: value });
    } else {
      setShowLighting(value);
    }
  };

  return (
    <div className={cn("glass-card p-4", className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-pink-500/20 text-pink-400">
            <Grid3X3 className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">Composition Analysis</h3>
            <p className="text-xs text-muted-foreground">
              Rule of thirds • Lighting • Leading lines
            </p>
          </div>
        </div>
        {onSave && (
          <Button variant="ghost" size="sm" onClick={() => onSave(composition)}>
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
        )}
      </div>

      {/* SVG Composition Preview */}
      <div className="relative bg-background/50 rounded-lg overflow-hidden">
        <svg viewBox="0 0 100 75" className="w-full aspect-video">
          {/* Background */}
          <rect width="100" height="75" fill="hsl(var(--muted))" opacity="0.3" />
          
          {/* Rule of Thirds Grid */}
          {showRuleOfThirds && (
            <g opacity="0.6">
              {/* Vertical lines */}
              <line x1="33.33" y1="0" x2="33.33" y2="75" stroke="hsl(var(--primary))" strokeWidth="0.5" strokeDasharray="2 2" />
              <line x1="66.67" y1="0" x2="66.67" y2="75" stroke="hsl(var(--primary))" strokeWidth="0.5" strokeDasharray="2 2" />
              {/* Horizontal lines */}
              <line x1="0" y1="25" x2="100" y2="25" stroke="hsl(var(--primary))" strokeWidth="0.5" strokeDasharray="2 2" />
              <line x1="0" y1="50" x2="100" y2="50" stroke="hsl(var(--primary))" strokeWidth="0.5" strokeDasharray="2 2" />
              
              {/* Power points */}
              <circle cx="33.33" cy="25" r="2" fill="hsl(var(--primary))" opacity="0.5" />
              <circle cx="66.67" cy="25" r="2" fill="hsl(var(--primary))" opacity="0.5" />
              <circle cx="33.33" cy="50" r="2" fill="hsl(var(--primary))" opacity="0.5" />
              <circle cx="66.67" cy="50" r="2" fill="hsl(var(--primary))" opacity="0.5" />
            </g>
          )}
          
          {/* Leading Lines */}
          {showLeadingLines && composition.leadingLinesPoints.map((line, i) => (
            <line
              key={i}
              x1={line.x1 * 100}
              y1={line.y1 * 75}
              x2={line.x2 * 100}
              y2={line.y2 * 75}
              stroke="hsl(var(--accent))"
              strokeWidth="1"
              strokeDasharray="3 2"
              opacity="0.7"
            />
          ))}
          
          {/* Subject highlight area */}
          <circle
            cx={composition.subjectPosition.x * 100}
            cy={composition.subjectPosition.y * 75}
            r="8"
            fill="hsl(var(--accent))"
            opacity="0.3"
          />
          <circle
            cx={composition.subjectPosition.x * 100}
            cy={composition.subjectPosition.y * 75}
            r="3"
            fill="hsl(var(--accent))"
          />
          
          {/* Lighting Arrows */}
          {showLighting && (
            <g>
              <defs>
                <marker id="keyArrow" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto">
                  <path d="M0,0 L4,2 L0,4 Z" fill="#f59e0b" />
                </marker>
                <marker id="fillArrow" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto">
                  <path d="M0,0 L4,2 L0,4 Z" fill="#3b82f6" />
                </marker>
                <marker id="rimArrow" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto">
                  <path d="M0,0 L4,2 L0,4 Z" fill="#a855f7" />
                </marker>
              </defs>
              
              {/* Key Light */}
              <line
                x1={keyArrow.startX}
                y1={keyArrow.startY * 0.75}
                x2={keyArrow.endX}
                y2={keyArrow.endY * 0.75}
                stroke="#f59e0b"
                strokeWidth="2"
                markerEnd="url(#keyArrow)"
              />
              <circle cx={keyArrow.startX} cy={keyArrow.startY * 0.75} r="4" fill="#f59e0b" opacity="0.5" />
              
              {/* Fill Light */}
              <line
                x1={fillArrow.startX}
                y1={fillArrow.startY * 0.75}
                x2={fillArrow.endX}
                y2={fillArrow.endY * 0.75}
                stroke="#3b82f6"
                strokeWidth="1.5"
                markerEnd="url(#fillArrow)"
              />
              <circle cx={fillArrow.startX} cy={fillArrow.startY * 0.75} r="3" fill="#3b82f6" opacity="0.5" />
              
              {/* Rim Light */}
              {rimArrow && (
                <>
                  <line
                    x1={rimArrow.startX}
                    y1={rimArrow.startY * 0.75}
                    x2={rimArrow.endX}
                    y2={rimArrow.endY * 0.75}
                    stroke="#a855f7"
                    strokeWidth="1"
                    markerEnd="url(#rimArrow)"
                  />
                  <circle cx={rimArrow.startX} cy={rimArrow.startY * 0.75} r="2.5" fill="#a855f7" opacity="0.5" />
                </>
              )}
            </g>
          )}
        </svg>
        
        {/* Legend */}
        {showLighting && (
          <div className="absolute bottom-2 right-2 flex items-center gap-2 text-[9px]">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> Key
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500" /> Fill
            </span>
            {rimArrow && (
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-purple-500" /> Rim
              </span>
            )}
          </div>
        )}
      </div>

      {/* Toggle Controls */}
      <div className="space-y-3 mt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Grid3X3 className="h-4 w-4 text-primary" />
            <span className="text-sm">Rule of Thirds</span>
          </div>
          <Switch
            checked={showRuleOfThirds}
            onCheckedChange={(v) => handleToggle('ruleOfThirds', v)}
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-accent" />
            <span className="text-sm">Leading Lines</span>
          </div>
          <Switch
            checked={showLeadingLines}
            onCheckedChange={(v) => handleToggle('leadingLines', v)}
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-amber-400" />
            <span className="text-sm">Lighting Arrows</span>
          </div>
          <Switch
            checked={showLighting}
            onCheckedChange={(v) => handleToggle('lighting', v)}
          />
        </div>
      </div>

      {/* Suggestions */}
      {composition.suggestions.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border/30">
          <h4 className="text-xs font-medium text-muted-foreground mb-2">Suggestions</h4>
          <div className="space-y-2">
            {composition.suggestions.map((suggestion, i) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                {suggestion.applied ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                ) : (
                  <Circle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <span className="font-medium">{suggestion.title}</span>
                  <p className="text-muted-foreground">{suggestion.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
