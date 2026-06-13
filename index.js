export default {
  async fetch(request, env) {

    // CORS PRE-FLIGHT
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders()
      });
    }

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

      // PRUEBA SIMPLE
      return json({
        ok: true,
        prueba: "Worker funcionando",
        promptRecibido: prompt
      });

    } catch (err) {

      return json({
        ok: false,
        error: String(err),
        message: err?.message
      }, 500);
    }
  }
};

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "*",
    "Content-Type": "application/json"
  };
}

function json(obj, status = 200) {
  return new Response(
    JSON.stringify(obj),
    {
      status,
      headers: corsHeaders()
    }
  );
}
