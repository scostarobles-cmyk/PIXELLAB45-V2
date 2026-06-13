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
        return json({ ok: false, error: "Prompt requerido" }, 400);
      }

      // =========================
      // 🎨 MODELO NUEVO
      // =========================

      const result = await env.AI.run(
        "@cf/bytedance/stable-diffusion-xl-lightning",
        {
          prompt: enhancePrompt(prompt)
        }
      );

      console.log("RAW RESULT:", result);

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

      if (!image) {
        return json({
          ok: false,
          error: "No se pudo extraer la imagen",
          raw: result
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
   PROMPT ENGINE
========================= */

function enhancePrompt(prompt) {
  return `
cinematic ultra realistic 8k,
futuristic cyberpunk lighting,
neon glow, ultra detailed, professional,

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
