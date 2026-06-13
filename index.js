export default {
async fetch(request, env) {

  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { headers: cors });
  }

  if (request.method !== "POST") {
    return new Response(
      JSON.stringify({
        ok: true,
        mensaje: "PIXELLAB45 Image Generator"
      }),
      {
        headers: {
          ...cors,
          "Content-Type": "application/json"
        }
      }
    );
  }

  try {

    const body = await request.json();
    const prompt = body.prompt?.trim();

    if (!prompt) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: "⚠️ Prompt vacío"
        }),
        {
          status: 400,
          headers: {
            ...cors,
            "Content-Type": "application/json"
          }
        }
      );
    }

    const replicateResponse = await fetch(
      "https://api.replicate.com/v1/models/black-forest-labs/flux-1.1-pro/predictions",
      {
        method: "POST",
        headers: {
          "Authorization": `Token ${env.REPLICATE_API_TOKEN}`,
          "Content-Type": "application/json",
          "Prefer": "wait"
        },
        body: JSON.stringify({
          input: { prompt }
        })
      }
    );

    const dataText = await replicateResponse.text();

    let data;
    try {
      data = JSON.parse(dataText);
    } catch {
      data = { raw: dataText };
    }

    console.log("REPLICATE RESPONSE:", data);

    if (!replicateResponse.ok) {

      let mensaje = "❌ Error al generar imagen";

      if (replicateResponse.status === 402) {
        mensaje = "⚠️ No tienes créditos suficientes en Replicate.";
      } 
      else if (replicateResponse.status === 429) {
        mensaje = "⏳ Demasiadas solicitudes. Intenta en unos segundos.";
      }
      else if (replicateResponse.status >= 500) {
        mensaje = "🔥 Error del servidor de IA. Intenta más tarde.";
      }

      return new Response(
        JSON.stringify({
          ok: false,
          status: replicateResponse.status,
          error: mensaje,
          debug: data
        }),
        {
          status: replicateResponse.status,
          headers: {
            ...cors,
            "Content-Type": "application/json"
          }
        }
      );
    }

    return new Response(
      JSON.stringify({
        ok: true,
        data
      }),
      {
        headers: {
          ...cors,
          "Content-Type": "application/json"
        }
      }
    );

  } catch (error) {

    return new Response(
      JSON.stringify({
        ok: false,
        error: "❌ Error interno del servidor"
      }),
      {
        status: 500,
        headers: {
          ...cors,
          "Content-Type": "application/json"
        }
      }
    );
  }

}
  }
