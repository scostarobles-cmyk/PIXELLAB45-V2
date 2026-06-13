export default {
  async fetch(request, env) {

    if (request.method !== "POST") {
      return json({ ok: false, error: "Solo POST permitido" }, 405);
    }

    let prompt = "";

    try {

      const contentType = request.headers.get("content-type") || "";

      if (contentType.includes("multipart/form-data")) {
        const form = await request.formData();
        prompt = form.get("prompt");
      }

      else if (contentType.includes("application/json")) {
        const body = await request.json();
        prompt = body.prompt;
      }

      if (!prompt) {
        return json({ ok: false, error: "Prompt requerido" }, 400);
      }

      const result = await env.AI.run(
        "@cf/stabilityai/stable-diffusion-xl-base-1.0",
        {
          prompt: enhancePrompt(prompt)
        }
      );

      console.log("RAW RESULT:", result);

      // 🔥 SOLO DEBUG (NO IMAGEN)
      return json({
        ok: false,
        debug: result
      });

    } catch (err) {
      return json({
        ok: false,
        error: err.message
      }, 500);
    }
  }
};

/* =========================
   PROMPT
========================= */

function enhancePrompt(prompt) {
  return `
cinematic ultra realistic 8k,
futuristic cyberpunk lighting,
neon glow,
high detail,

${prompt}
`;
}

/* =========================
   JSON
========================= */

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
}
