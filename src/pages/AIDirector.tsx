import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Sparkles, Camera, Lightbulb, Star, Loader2, Wand2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Shot {
  shot_type: string;
  camera_angle: string;
  movement: string;
  lighting: string;
  description: string;
}
interface ScenePlan {
  scene: string;
  mood: string;
  shots: Shot[];
  suggestions: string[];
  score: { overall: number; composition: number; lighting: number };
}

const examples = [
  "A lone detective enters a rain-soaked alley at midnight, neon reflections on wet pavement.",
  "Two old friends reunite at a sunlit train station after twenty years apart.",
  "A chef plates a dish in a bustling restaurant kitchen during dinner rush.",
];

export default function AIDirector() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<ScenePlan | null>(null);

  const generate = async () => {
    const text = prompt.trim();
    if (text.length < 4) {
      toast.error("Please describe your scene (at least a few words).");
      return;
    }
    setLoading(true);
    setPlan(null);
    try {
      const { data, error } = await supabase.functions.invoke("ai-director", {
        body: { prompt: text },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      setPlan(data as ScenePlan);
      toast.success("Scene plan generated");
    } catch (e: any) {
      const msg = e?.message || "Failed to generate scene";
      if (msg.includes("Rate limit")) toast.error("Rate limit reached. Try again shortly.");
      else if (msg.includes("credits")) toast.error("AI credits exhausted. Add credits in workspace settings.");
      else toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-amber-500" />
            <Badge variant="outline" className="text-xs">AI-Powered • GPT-5</Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">AI Director</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Describe a scene in natural language. The AI Director generates a complete cinematic plan —
            shots, camera moves, lighting, suggestions, and a cinematic score.
          </p>
        </div>

        {/* Input */}
        <Card className="p-5 md:p-6 mb-8 bg-card/60 backdrop-blur border-border/60">
          <label className="text-sm font-medium mb-2 block text-muted-foreground">
            Scene description
          </label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. A lone astronaut steps onto an alien shore at dawn..."
            rows={4}
            className="resize-none mb-3"
            maxLength={2000}
          />
          <div className="flex flex-wrap gap-2 mb-4">
            {examples.map((ex) => (
              <button
                key={ex}
                onClick={() => setPrompt(ex)}
                className="text-xs px-3 py-1.5 rounded-full border border-border/60 text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition"
              >
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

        {/* Results */}
        {plan && (
          <div className="space-y-6 animate-fade-in">
            {/* Scene + score */}
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
                <div className="text-4xl font-bold text-amber-500">{plan.score.overall}<span className="text-lg text-muted-foreground">/10</span></div>
                <div className="mt-3 space-y-1.5 text-sm">
                  <ScoreBar label="Composition" value={plan.score.composition} />
                  <ScoreBar label="Lighting" value={plan.score.lighting} />
                </div>
              </Card>
            </div>

            {/* Shots */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Camera className="h-4 w-4 text-amber-500" />
                <h2 className="text-lg font-semibold">Shot List</h2>
                <Badge variant="outline" className="text-xs">{plan.shots.length} shots</Badge>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {plan.shots.map((s, i) => (
                  <Card key={i} className="p-4 bg-card/60 backdrop-blur border-border/60 hover:border-amber-500/40 transition">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono text-muted-foreground">SHOT {String(i + 1).padStart(2, "0")}</span>
                      <Badge variant="secondary" className="text-[10px] uppercase">{s.shot_type}</Badge>
                    </div>
                    <p className="text-sm mb-3 leading-relaxed">{s.description}</p>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <Row k="Angle" v={s.camera_angle} />
                      <Row k="Movement" v={s.movement} />
                      <Row k="Lighting" v={s.lighting} />
                    </div>
                  </Card>
                ))}
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
          </div>
        )}
      </div>
    </Layout>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-2">
      <span className="text-muted-foreground/70">{k}</span>
      <span className="text-foreground/90 text-right truncate">{v}</span>
    </div>
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