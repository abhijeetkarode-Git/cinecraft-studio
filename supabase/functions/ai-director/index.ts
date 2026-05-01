// AI Director edge function — calls Lovable AI Gateway with structured output.
// No API key in client; LOVABLE_API_KEY is auto-provisioned in Lovable Cloud.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SYSTEM_PROMPT = `You are an expert cinematographer and AI Director.
Given a natural-language scene description, design a complete cinematic plan:
a vivid scene summary, 3–5 shots (each with type, camera angle, movement,
lighting, and a one-sentence description), 3–5 actionable suggestions to
improve mood/composition/lighting, and a cinematic score breakdown (overall,
composition, lighting — each 1–10).
Be concise, specific, and grounded in real cinematography practice.`;

const tool = {
  type: "function",
  function: {
    name: "return_scene_plan",
    description: "Return a structured cinematic scene plan.",
    parameters: {
      type: "object",
      properties: {
        scene: { type: "string", description: "Vivid 1–2 sentence scene description" },
        mood: { type: "string", description: "Overall mood / cinematic tone" },
        shots: {
          type: "array",
          minItems: 3,
          maxItems: 5,
          items: {
            type: "object",
            properties: {
              shot_type: { type: "string", enum: ["wide", "medium", "close-up", "extreme close-up", "establishing", "over-the-shoulder", "reaction"] },
              camera_angle: { type: "string" },
              movement: { type: "string", enum: ["static", "dolly", "tracking", "orbit", "crane", "handheld", "pan", "tilt", "zoom"] },
              lighting: { type: "string" },
              description: { type: "string" },
            },
            required: ["shot_type", "camera_angle", "movement", "lighting", "description"],
            additionalProperties: false,
          },
        },
        suggestions: {
          type: "array",
          minItems: 3,
          maxItems: 5,
          items: { type: "string" },
        },
        score: {
          type: "object",
          properties: {
            overall: { type: "number" },
            composition: { type: "number" },
            lighting: { type: "number" },
          },
          required: ["overall", "composition", "lighting"],
          additionalProperties: false,
        },
      },
      required: ["scene", "mood", "shots", "suggestions", "score"],
      additionalProperties: false,
    },
  },
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    const prompt = typeof body?.prompt === "string" ? body.prompt.trim() : "";
    if (!prompt || prompt.length < 4 || prompt.length > 2000) {
      return new Response(JSON.stringify({ error: "Prompt must be 4–2000 characters." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-5",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: prompt },
        ],
        tools: [tool],
        tool_choice: { type: "function", function: { name: "return_scene_plan" } },
      }),
    });

    if (aiResp.status === 429) {
      return new Response(JSON.stringify({ error: "Rate limit reached. Please try again shortly." }), {
        status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (aiResp.status === 402) {
      return new Response(JSON.stringify({ error: "AI credits exhausted. Add credits in Settings → Workspace → Usage." }), {
        status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!aiResp.ok) {
      const t = await aiResp.text();
      console.error("AI gateway error", aiResp.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await aiResp.json();
    const call = data?.choices?.[0]?.message?.tool_calls?.[0];
    const argsStr = call?.function?.arguments;
    if (!argsStr) {
      return new Response(JSON.stringify({ error: "Model did not return structured output." }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    let parsed: unknown;
    try { parsed = JSON.parse(argsStr); } catch {
      return new Response(JSON.stringify({ error: "Failed to parse model output." }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-director error", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});