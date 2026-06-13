export default {
  async fetch(request, env) {

    if (request.method !== "POST") {
      return json({
        ok: false,
        error: "Solo POST permitido"
      }, 405);
    }

    try {

      const contentType =
        request.headers.get("content-type") || "";

      let prompt = "";

      if (contentType.includes("multipart/form-data")) {

        const form =
          await request.formData();

        prompt = form.get("prompt");
      }

      else if (contentType.includes("application/json")) {

        const body =
          await request.json();

        prompt = body.prompt;
      }

      if (!prompt) {

        return json({
          ok: false,
          error: "Prompt requerido"
        }, 400);
      }

      // ==================================
      // PRUEBA SIMPLE
      // ==================================

      return json({
        ok: true,
        prueba: "Worker funcionando",
        promptRecibido: prompt
      });

    }

    catch (err) {

      return json({
        ok: false,
        error: String(err),
        message: err?.message,
        stack: err?.stack
      }, 500);
    }
  }
};

/* =========================
   JSON HELPER
========================= */

function json(obj, status = 200) {

  return new Response(
    JSON.stringify(obj),
    {
      status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    }
  );
}
