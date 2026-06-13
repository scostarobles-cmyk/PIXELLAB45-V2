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
  "@cfconsole.log("AI RAW RESULT:", result);

let image = null;

// 🔥 CASO 1: directo (lo más común en Cloudflare)
if (result?.image) {
  image = result.image;
}

// 🔥 CASO 2: respuesta directa binaria
else if (result instanceof Uint8Array) {
  image = result;
}

// 🔥 CASO 3: envuelto en result
else if (result?.result?.image) {
  image = result.result.image;
}

// 🔥 CASO 4: result directo binario dentro de objeto
else if (result?.result instanceof Uint8Array) {
  image = result.result;
}

// ❌ si no hay nada
if (!image) {
  return json({
    ok: false,
    error: "No se pudo extraer imagen del modelo",
    debug: result
  }, 500);
}

// 🔥 convertir a base64 SI es binario
if (image instanceof Uint8Array) {
  image = btoa(String.fromCharCode(...image));
}

// ✔ devolver lista para frontend
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
