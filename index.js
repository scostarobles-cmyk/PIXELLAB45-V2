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
      // 🎨 CLOUDFARE AI MODEL
      // =========================

      const result = await env.AI.run(
  "@cf/stabilityai/stable-diffusion-xl-base-1.0",
  {
    prompt: enhancePrompt(prompt)
  }
);

console.log("AI RESULT:", result);

// 🔥 CLAVE REAL (Cloudflare SDXL)
let image = result?.image;

// fallback por seguridad
if (!image && result?.result?.image) {
  image = result.result.image;
}

// último fallback
if (!image && result?.output) {
  image = result.output;
}

if (!image) {
  return json({
    ok: false,
    error: "Modelo no devolvió imagen",
    debug: result
  }, 500);
}

// 🔥 convertir si es buffer (CASO COMÚN EN CLOUDFLARE)
if (image instanceof Uint8Array) {
  image = btoa(
    String.fromCharCode(...image)
  );
}

return json({
  ok: true,
  data: {
    output: `data:image/png;base64,${image}`
  }
});

      return json({
        ok: true,
        data: {
          output: image
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
