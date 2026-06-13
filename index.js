export default {
  async fetch(request, env) {

    if (request.method !== "POST") {
      return json({ ok: false, error: "Solo POST permitido" }, 405);
    }

    let prompt = "";

    try {

      const contentType = request.headers.get("content-type") || "";

      // =========================
      // 📦 INPUT
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
        return json({ ok: false, error: "Prompt requerido" }, 400);
      }

      // =========================
      // 🎨 IA MODEL
      // =========================

      const result = await env.AI.run(
        "@cf/stabilityai/stable-diffusion-xl-base-1.0",
        {
          prompt: enhancePrompt(prompt)
        }
      );

      console.log("AI RAW RESULT:", result);

      let image = null;

      // 🔥 CASO 1
      if (result?.image) {
        image = result.image;
      }

      // 🔥 CASO 2
      else if (result instanceof Uint8Array) {
        image = result;
      }

      // 🔥 CASO 3
      else if (result?.result?.image) {
        image = result.result.image;
      }

      // 🔥 CASO 4
      else if (result?.result instanceof Uint8Array) {
        image = result.result;
      }

      if (!image) {
        return json({
          ok: false,
          error: "No se pudo extraer imagen del modelo",
          debug: result
        }, 500);
      }

      if (image instanceof Uint8Array) {
        image = btoa(String.fromCharCode(...image));
      }

      return json({
        ok: true,
        data: {
          output: `data:image/png;base64,${image}`
        }
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
   🧠 PROMPT ENGINE
========================= */

function enhancePrompt(prompt) {
  return `
cinematic ultra realistic 8k,
futuristic cyberpunk lighting,
neon blue glow,
high detail,
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
