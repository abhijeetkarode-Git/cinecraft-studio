import { useEffect, useRef, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Sparkles, Camera, Lightbulb, Star, Loader2, Wand2, Play, Pause, RotateCcw, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Scene3DViewer } from "@/components/ai-director/Scene3DViewer";
import { ShotCard } from "@/components/ai-director/ShotCard";
import { StoryboardGenerator } from "@/components/ai-director/StoryboardGenerator";
import type { AIScenePlan, AIShot } from "@/types/aiDirector";

const examples = [
  "A lone detective enters a rain-soaked alley at midnight, neon reflections on wet pavement.",
  "Two old friends reunite at a sunlit train station after twenty years apart.",
  "A chef plates a dish in a bustling restaurant kitchen during dinner rush.",
];

// Defensive normalisation: ensure all required fields exist on every shot.
function normalisePlan(raw: any): AIScenePlan {
  const fallbackPos = (i: number, end = false) => ({
    x: Math.cos((i + (end ? 0.5 : 0)) * 1.2) * 5,
    y: 1.6,
    z: Math.sin((i + (end ? 0.5 : 0)) * 1.2) * 5,
  });
  const shots: AIShot[] = (raw?.shots || []).map((s: any, i: number) => ({
    shot_type: s.shot_type || "medium",
    camera_angle: s.camera_angle || "eye-level",
    movement: s.movement || "static",
    duration: typeof s.duration === "number" ? s.duration : 4,
    target: s.target || "subject",
    start_position: s.start_position || fallbackPos(i, false),
    end_position: s.end_position || fallbackPos(i, true),
    lighting: s.lighting || "natural",
    mood: s.mood || raw?.mood || "neutral",
    description: s.description || "",
  }));
  return {
    scene: raw?.scene || "",
    mood: raw?.mood || "neutral",
    shots,
    suggestions: raw?.suggestions || [],
    score: raw?.score || { overall: 0, composition: 0, lighting: 0 },
  };
}

export default function AIDirector() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<AIScenePlan | null>(null);

  // Playback
  const [activeIdx, setActiveIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0..1 within active shot
  const [freeView, setFreeView] = useState(false);
  const lastTsRef = useRef<number | null>(null);

  const activeShot = plan?.shots[activeIdx] || null;

  const generate = async () => {
    const text = prompt.trim();
    if (text.length < 4) return toast.error("Please describe your scene.");
    setLoading(true);
    setPlan(null);
    setPlaying(false);
    setProgress(0);
    setActiveIdx(0);
    try {
      const { data, error } = await supabase.functions.invoke("ai-director", { body: { prompt: text } });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      const norm = normalisePlan(data);
      setPlan(norm);
      toast.success("Scene plan generated");
      setTimeout(() => setPlaying(true), 300);
    } catch (e: any) {
      const msg = e?.message || "Failed to generate scene";
      if (msg.includes("Rate limit")) toast.error("Rate limit reached.");
      else if (msg.includes("credits")) toast.error("AI credits exhausted.");
      else toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Animation loop
  useEffect(() => {
    if (!playing || !plan || !activeShot) return;
    let raf = 0;
    const tick = (ts: number) => {
      if (lastTsRef.current == null) lastTsRef.current = ts;
      const dt = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;
      setProgress((p) => {
        const next = p + dt / Math.max(0.5, activeShot.duration);
        if (next >= 1) {
          if (activeIdx < plan.shots.length - 1) {
            setActiveIdx(activeIdx + 1);
            return 0;
          }
          setPlaying(false);
          return 1;
        }
        return next;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      lastTsRef.current = null;
    };
  }, [playing, plan, activeShot, activeIdx]);

  const jumpTo = (i: number) => {
    setActiveIdx(i);
    setProgress(0);
    lastTsRef.current = null;
  };

  const reset = () => {
    setActiveIdx(0);
    setProgress(0);
    setPlaying(false);
    lastTsRef.current = null;
  };

  return (
    <Layout>
      <SEO
        title="AI Director"
        description="Describe a scene and the AI generates a multi-shot cinematography plan with synchronized 3D camera animation and an AI storyboard."
        path="/ai-director"
      />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-amber-500" />
            <Badge variant="outline" className="text-xs">AI-Powered • GPT-5 + 3D Sync</Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">AI Director</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Describe a scene. The AI generates a multi-shot plan that animates live in the 3D simulator.
          </p>
        </div>

        {/* Input */}
        <Card className="p-5 mb-6 bg-card/60 backdrop-blur border-border/60">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. A lone astronaut steps onto an alien shore at dawn..."
            rows={3}
            className="resize-none mb-3"
            maxLength={2000}
          />
          <div className="flex flex-wrap gap-2 mb-4">
            {examples.map((ex) => (
              <button key={ex} onClick={() => setPrompt(ex)}
                className="text-xs px-3 py-1.5 rounded-full border border-border/60 text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition">
                {ex.slice(0, 48)}…
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{prompt.length}/2000</span>
            <Button onClick={generate} disabled={loading} variant="amber">
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Wand2 className="h-4 w-4 mr-2" />}
              {loading ? "Directing…" : "Generate Scene"}
            </Button>
          </div>
        </Card>

        {plan && (
          <div className="space-y-6 animate-fade-in">
            {/* Scene + Score */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="md:col-span-2 p-5 bg-card/60 backdrop-blur border-border/60">
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Scene</div>
                <p className="text-base leading-relaxed">{plan.scene}</p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Mood:</span>
                  <Badge variant="secondary">{plan.mood}</Badge>
                </div>
              </Card>
              <Card className="p-5 bg-card/60 backdrop-blur border-border/60">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="h-4 w-4 text-amber-500" />
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">Cinematic Score</span>
                </div>
                <div className="text-4xl font-bold text-amber-500">
                  {plan.score.overall}<span className="text-lg text-muted-foreground">/10</span>
                </div>
                <div className="mt-3 space-y-1.5 text-sm">
                  <ScoreBar label="Composition" value={plan.score.composition} />
                  <ScoreBar label="Lighting" value={plan.score.lighting} />
                </div>
              </Card>
            </div>

            {/* Main split: Shot list + 3D viewer */}
            <div className="grid lg:grid-cols-5 gap-4">
              {/* Left: shot panel */}
              <div className="lg:col-span-2 space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <Camera className="h-4 w-4 text-amber-500" />
                  <h2 className="text-lg font-semibold">Shot List</h2>
                  <Badge variant="outline" className="text-xs">{plan.shots.length} shots</Badge>
                </div>
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                  {plan.shots.map((s, i) => (
                    <ShotCard key={i} shot={s} index={i} active={i === activeIdx} onClick={() => jumpTo(i)} />
                  ))}
                </div>
              </div>

              {/* Right: 3D viewer */}
              <div className="lg:col-span-3 space-y-3">
                <Card className="p-3 bg-card/60 backdrop-blur border-border/60">
                  <div className="aspect-video rounded-lg overflow-hidden bg-black">
                    <Scene3DViewer shot={activeShot} shotProgress={progress} freeView={freeView} />
                  </div>

                  {/* Playback controls */}
                  <div className="flex items-center gap-2 mt-3">
                    <Button size="sm" variant="outline" aria-label={playing ? "Pause playback" : "Play scene"} onClick={() => setPlaying((p) => !p)}>
                      {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button size="sm" variant="ghost" aria-label="Reset playback" onClick={reset}>
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant={freeView ? "amber" : "ghost"} onClick={() => setFreeView((v) => !v)}>
                      <Eye className="h-4 w-4 mr-1" /> Free
                    </Button>
                    <div className="flex-1 mx-2">
                      <div className="text-[10px] text-muted-foreground mb-1 flex justify-between">
                        <span>Shot {activeIdx + 1} / {plan.shots.length}</span>
                        <span>{Math.round(progress * 100)}%</span>
                      </div>
                      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 transition-[width] duration-100" style={{ width: `${progress * 100}%` }} />
                      </div>
                    </div>
                  </div>
                </Card>

                {activeShot && (
                  <Card className="p-4 bg-card/60 backdrop-blur border-border/60">
                    <div className="text-xs uppercase tracking-wider text-amber-500 mb-1">Now Playing</div>
                    <p className="text-sm">{activeShot.description}</p>
                  </Card>
                )}
              </div>
            </div>

            {/* Suggestions */}
            <Card className="p-5 bg-card/60 backdrop-blur border-border/60">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="h-4 w-4 text-amber-500" />
                <h2 className="text-lg font-semibold">AI Suggestions</h2>
              </div>
              <ul className="space-y-2">
                {plan.suggestions.map((s, i) => (
                  <li key={i} className="flex gap-2 text-sm">
                    <span className="text-amber-500 mt-0.5">›</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* AI Visual Storyboard */}
            <StoryboardGenerator plan={plan} />
          </div>
        )}
      </div>
    </Layout>
  );
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  const pct = Math.max(0, Math.min(100, (value / 10) * 100));
  return (
    <div>
      <div className="flex justify-between text-xs text-muted-foreground mb-1">
        <span>{label}</span><span>{value}/10</span>
      </div>
      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
        <div className="h-full bg-amber-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
