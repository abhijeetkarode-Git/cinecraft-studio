import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Clock, Crosshair, Lightbulb, Move } from "lucide-react";
import type { AIShot } from "@/types/aiDirector";
import { cn } from "@/lib/utils";

interface Props {
  shot: AIShot;
  index: number;
  active: boolean;
  onClick: () => void;
}

export function ShotCard({ shot, index, active, onClick }: Props) {
  return (
    <Card
      onClick={onClick}
      className={cn(
        "p-4 cursor-pointer transition-all border bg-card/60 backdrop-blur",
        active
          ? "border-amber-500 ring-2 ring-amber-500/40 shadow-lg shadow-amber-500/10 scale-[1.01]"
          : "border-border/60 hover:border-amber-500/40"
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={cn(
            "text-xs font-mono px-1.5 py-0.5 rounded",
            active ? "bg-amber-500 text-black" : "bg-secondary text-muted-foreground"
          )}>
            SHOT {String(index + 1).padStart(2, "0")}
          </span>
          {active && <span className="text-[10px] uppercase tracking-wider text-amber-500 animate-pulse">● Live</span>}
        </div>
        <Badge variant="secondary" className="text-[10px] uppercase">{shot.shot_type}</Badge>
      </div>
      <p className="text-sm mb-3 leading-relaxed">{shot.description}</p>
      <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5"><Move className="h-3 w-3" /> {shot.movement}</div>
        <div className="flex items-center gap-1.5"><Clock className="h-3 w-3" /> {shot.duration}s</div>
        <div className="flex items-center gap-1.5"><Camera className="h-3 w-3" /> {shot.camera_angle}</div>
        <div className="flex items-center gap-1.5"><Crosshair className="h-3 w-3" /> {shot.target}</div>
        <div className="col-span-2 flex items-center gap-1.5"><Lightbulb className="h-3 w-3" /> {shot.lighting}</div>
      </div>
      <div className="mt-2 pt-2 border-t border-border/40 text-[10px] text-muted-foreground/70 font-mono">
        {`(${shot.start_position.x.toFixed(1)},${shot.start_position.y.toFixed(1)},${shot.start_position.z.toFixed(1)}) → (${shot.end_position.x.toFixed(1)},${shot.end_position.y.toFixed(1)},${shot.end_position.z.toFixed(1)})`}
      </div>
    </Card>
  );
}
