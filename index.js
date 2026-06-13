export default {
  async fetch(request, env) {

    if (request.method !== "POST") {
      return json({ ok: false, error: "Solo POST permitido" }, 405);
    }

    try {

      const contentType = request.headers.get("content-type") || "";
      let prompt = "";

      if (contentType.includes("multipart/form-data")) {
        const form = await request.formData();
        prompt = form.get("prompt");
      } else {
        const body = await request.json();
        prompt = body.prompt;
      }

      prompt = String(prompt || "");

      if (!prompt) {
        return json({ ok: false, error: "Prompt vacío" }, 400);
      }

      console.log("PROMPT:", prompt);

      const result = await env.AI.run(
        "@cf/stabilityai/stable-diffusion-xl-base-1.0",
        {
          prompt: enhancePrompt(prompt)
        }
      );

      console.log("RAW RESULT:", result);

      // =========================
      // 🔥 EXTRACCIÓN REALISTA
      // =========================

      let image = null;

      if (result?.image) {
        image = result.image;
      } else if (result?.result?.image) {
        image = result.result.image;
      } else if (result instanceof Uint8Array) {
        image = result;
      } else if (result?.result instanceof Uint8Array) {
        image = result.result;
      }

      // ❌ SI FALLA → MOSTRAMOS DEBUG REAL
      if (!image) {
        return json({
          ok: false,
          error: "No se pudo extraer imagen",
          debug_type: typeof result,
          debug_keys: result ? Object.keys(result) : null,
          raw: result
        }, 500);
      }

      // =========================
      // 🔥 CONVERSIÓN SEGURA
      // =========================

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

      console.log("ERROR FULL:", err);

      return json({
        ok: false,
        error: err.message,
        stack: err.stack
      }, 500);
    }
  }
};

/* =========================
   PROMPT ENGINE
========================= */

function enhancePrompt(prompt) {
  return `
cinematic ultra realistic 8k,
futuristic cyberpunk lighting,
neon glow,
ultra detailed,

${prompt}
`;
}

/* =========================
   JSON HELPER
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
