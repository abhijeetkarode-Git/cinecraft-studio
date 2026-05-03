// AI Storyboard edge function — generates one cinematic image per shot
// using the Lovable AI Gateway (Gemini image model). Returns base64 PNGs.
// API key stays server-side via LOVABLE_API_KEY.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface ShotIn {
  shot_type?: string;
  camera_angle?: string;
  movement?: string;
  lighting?: string;
  mood?: string;
  target?: string;
  description?: string;
}

function buildPrompt(scene: string, mood: string, shot: ShotIn, index: number): string {
  const parts = [
    `Cinematic film still, shot ${index + 1}.`,
    shot.description || scene,
    `Scene context: ${scene}.`,
    shot.shot_type ? `${shot.shot_type} shot` : null,
    shot.camera_angle ? `${shot.camera_angle} angle` : null,
    shot.movement && shot.movement !== "static" ? `${shot.movement} camera movement` : null,
    shot.lighting ? `${shot.lighting} lighting` : null,
    `Mood: ${shot.mood || mood}.`,
    shot.target ? `Subject: ${shot.target}.` : null,
    "Photorealistic, 16:9 widescreen, anamorphic lens, high contrast, color graded, depth of field, professional cinematography, no text, no watermark.",
  ].filter(Boolean);
  return parts.join(" ");
}

async function generateOne(prompt: string, apiKey: string): Promise<string | null> {
  const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash-image",
      messages: [{ role: "user", content: prompt }],
      modalities: ["image", "text"],
    }),
  });
  if (!resp.ok) {
    const t = await resp.text();
    console.error("image gen failed", resp.status, t);
    return null;
  }
  const data = await resp.json();
  const url = data?.choices?.[0]?.message?.images?.[0]?.image_url?.url;
  return typeof url === "string" ? url : null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY not configured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    const scene: string = typeof body?.scene === "string" ? body.scene : "";
    const mood: string = typeof body?.mood === "string" ? body.mood : "cinematic";
    const shots: ShotIn[] = Array.isArray(body?.shots) ? body.shots.slice(0, 6) : [];
    if (shots.length === 0) {
      return new Response(JSON.stringify({ error: "No shots provided." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Generate sequentially to be gentle on rate limits.
    const frames: { index: number; prompt: string; image: string | null }[] = [];
    for (let i = 0; i < shots.length; i++) {
      const prompt = buildPrompt(scene, mood, shots[i], i);
      const image = await generateOne(prompt, LOVABLE_API_KEY);
      frames.push({ index: i, prompt, image });
    }

    return new Response(JSON.stringify({ frames }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-storyboard error", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});