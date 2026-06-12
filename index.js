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
        error: "Prompt vacío"
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
        input: {
          prompt
        }
      })
    }
  );

  if (!replicateResponse.ok) {

    const errorText = await replicateResponse.text();

    return new Response(
      JSON.stringify({
        ok: false,
        status: replicateResponse.status,
        error: errorText
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

  const data = await replicateResponse.json();

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
      error: error.message
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
