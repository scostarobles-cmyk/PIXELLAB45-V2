export default {
  async fetch(request, env) {

    if (request.method !== "POST") {
      return json({ ok: false, error: "Solo POST permitido" }, 405);
    }

    let prompt = "";

    try {

      const contentType = request.headers.get("content-type") || "";

      // =========================
      // 📦 INPUT (MULTIPART / JSON)
      // =========================

      if (contentType.includes("multipart/form-data")) {
        const form = await request.formData();
        prompt = form.get("prompt");
      }

      else if (contentType.includes("application/json")) {
        const body = await request.json();
        prompt = body.prompt;
      }

      if (!prompt) {
        return json({
          ok: false,
          error: "Prompt requerido"
        }, 400);
      }

      // =========================
      // 🎨 CLOUDFARE AI IMAGE MODEL
      // =========================

      const result = await env.AI.run(
        "@cf/stabilityai/stable-diffusion-xl-base-1.0",
        {
          prompt: enhancePrompt(prompt)
        }
      );

      if (!result || !result.image) {
        return json({
          ok: false,
          error: "No se generó imagen",
          raw: result
        }, 500);
      }
const result = await env.AI.run(
  "@cf/stabilityai/stable-diffusion-xl-base-1.0",
  {
    prompt: enhancePrompt(prompt)
  }
);

// 🔥 DEBUG REAL
console.log("AI RESULT:", result);

// 🔥 extracción robusta
const image =
  result?.image ||
  result?.result?.image ||
  result?.result ||
  result?.output?.[0];

if (!image) {
  return json({
    ok: false,
    error: "Modelo no devolvió imagen",
    debug: result
  }, 500);
}

return json({
  ok: true,
  data: {
    output: image
  }
});
      

/* =========================
   🧠 PROMPT ENGINE (PIXELLAB45 STYLE)
========================= */

function enhancePrompt(prompt) {

  return `
cinematic ultra realistic 8k,
futuristic cyberpunk lighting,
neon blue glow, high detail,
professional digital art,

${prompt}
`;
}

/* =========================
   📦 JSON HELPER
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
