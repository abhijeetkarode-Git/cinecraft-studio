import { useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Film, Download, RefreshCw, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { AIScenePlan } from "@/types/aiDirector";

interface Frame { index: number; prompt: string; image: string | null }

interface Props { plan: AIScenePlan }

export function StoryboardGenerator({ plan }: Props) {
  const [loading, setLoading] = useState(false);
  const [frames, setFrames] = useState<Frame[] | null>(null);
  const [composite, setComposite] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generate = async () => {
    setLoading(true);
    setFrames(null);
    setComposite(null);
    try {
      const { data, error } = await supabase.functions.invoke("ai-storyboard", {
        body: { scene: plan.scene, mood: plan.mood, shots: plan.shots },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      const fr: Frame[] = (data as any).frames || [];
      setFrames(fr);
      await composeStoryboard(fr);
      toast.success("Storyboard generated");
    } catch (e: any) {
      toast.error(e?.message || "Failed to generate storyboard");
    } finally {
      setLoading(false);
    }
  };

  const composeStoryboard = async (fr: Frame[]) => {
    const valid = fr.filter((f) => f.image);
    if (valid.length === 0) return;

    // Layout
    const cols = valid.length <= 2 ? valid.length : valid.length <= 4 ? 2 : 3;
    const rows = Math.ceil(valid.length / cols);
    const cellW = 640; // 16:9
    const cellH = 360;
    const gap = 24;
    const pad = 40;
    const titleH = 60;
    const captionH = 56;
    const W = pad * 2 + cols * cellW + (cols - 1) * gap;
    const H = pad * 2 + titleH + rows * (cellH + captionH) + (rows - 1) * gap;

    const canvas = canvasRef.current ?? document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d")!;

    // Dark background
    ctx.fillStyle = "#0b0b0f";
    ctx.fillRect(0, 0, W, H);

    // Header
    ctx.fillStyle = "#f5b042";
    ctx.font = "bold 28px system-ui, -apple-system, sans-serif";
    ctx.fillText("AI VISUAL STORYBOARD", pad, pad + 28);
    ctx.fillStyle = "#9ca3af";
    ctx.font = "16px system-ui, -apple-system, sans-serif";
    const sceneLine = plan.scene.length > 110 ? plan.scene.slice(0, 107) + "…" : plan.scene;
    ctx.fillText(sceneLine, pad, pad + 52);

    // Load images in parallel
    const imgs = await Promise.all(
      valid.map(
        (f) =>
          new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = f.image!;
          }),
      ),
    );

    valid.forEach((f, i) => {
      const c = i % cols;
      const r = Math.floor(i / cols);
      const x = pad + c * (cellW + gap);
      const y = pad + titleH + r * (cellH + captionH + gap);

      // Frame border
      ctx.fillStyle = "#1a1a22";
      ctx.fillRect(x - 4, y - 4, cellW + 8, cellH + 8);
      // Image (cover)
      const img = imgs[i];
      const ir = img.width / img.height;
      const tr = cellW / cellH;
      let sx = 0, sy = 0, sw = img.width, sh = img.height;
      if (ir > tr) { sw = img.height * tr; sx = (img.width - sw) / 2; }
      else { sh = img.width / tr; sy = (img.height - sh) / 2; }
      ctx.drawImage(img, sx, sy, sw, sh, x, y, cellW, cellH);

      // Shot index badge
      ctx.fillStyle = "rgba(245,176,66,0.92)";
      ctx.fillRect(x + 12, y + 12, 90, 28);
      ctx.fillStyle = "#0b0b0f";
      ctx.font = "bold 14px system-ui, sans-serif";
      ctx.fillText(`SHOT ${f.index + 1}`, x + 22, y + 31);

      // Caption block
      const shot = plan.shots[f.index];
      const cy = y + cellH + 8;
      ctx.fillStyle = "#e5e7eb";
      ctx.font = "bold 16px system-ui, sans-serif";
      const title = `${(shot?.shot_type || "shot").toUpperCase()} • ${shot?.camera_angle || ""}`;
      ctx.fillText(title, x, cy + 18);
      ctx.fillStyle = "#9ca3af";
      ctx.font = "13px system-ui, sans-serif";
      ctx.fillText(`${shot?.movement || "static"} • ${shot?.lighting || ""}`.slice(0, 70), x, cy + 38);
    });

    setComposite(canvas.toDataURL("image/png"));
  };

  const download = () => {
    if (!composite) return;
    const a = document.createElement("a");
    a.href = composite;
    a.download = "cinecraft-storyboard.png";
    a.click();
  };

  return (
    <Card className="p-5 bg-card/60 backdrop-blur border-border/60">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Film className="h-4 w-4 text-amber-500" />
          <h2 className="text-lg font-semibold">AI Visual Storyboard</h2>
          <Badge variant="outline" className="text-xs">Image-gen</Badge>
        </div>
        <div className="flex gap-2">
          {composite && (
            <>
              <Button size="sm" variant="outline" onClick={download}>
                <Download className="h-4 w-4 mr-1" /> Download
              </Button>
              <Button size="sm" variant="ghost" onClick={generate} disabled={loading}>
                <RefreshCw className="h-4 w-4 mr-1" /> Regenerate
              </Button>
            </>
          )}
          {!composite && (
            <Button size="sm" variant="amber" onClick={generate} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <ImageIcon className="h-4 w-4 mr-1" />}
              {loading ? "Painting frames…" : "Generate Storyboard"}
            </Button>
          )}
        </div>
      </div>

      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {plan.shots.map((_, i) => (
            <div key={i} className="aspect-video rounded-md bg-secondary/40 animate-pulse flex items-center justify-center">
              <span className="text-xs text-muted-foreground">Shot {i + 1}</span>
            </div>
          ))}
        </div>
      )}

      {composite && (
        <div className="space-y-3 animate-fade-in">
          <div className="rounded-lg overflow-hidden border border-border/60 bg-black">
            <img src={composite} alt="AI generated storyboard" className="w-full h-auto block" />
          </div>
          {frames && frames.some((f) => !f.image) && (
            <p className="text-xs text-muted-foreground">
              Some frames failed to render and were skipped. Try regenerating.
            </p>
          )}
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </Card>
  );
}