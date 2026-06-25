export default {
  async fetch(request, env) {

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Content-Type": "application/json"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const json = (obj, status = 200) =>
      new Response(JSON.stringify(obj), {
        status,
        headers: corsHeaders
      });

    let data = {};

    try {
      if (request.method === "POST") {
        data = await request.json();
      }
    } catch {
      return json({ error: "JSON inválido" }, 400);
    }

    switch (data.tipo) {

      case "listar-imagenes":
          return listarImagenes(env, json);
      case "listar-categoria":
          return listarCategoria(data.categoria,env,json);
        case "ideas": {

  const match = tema.match(/\d+/);
  let cantidad = match ? parseInt(match[0]) : 5;

  if (cantidad > 20) cantidad = 20;

  const resultado = await ai(`
Eres un generador de ideas estructurado.

Genera EXACTAMENTE ${cantidad} ideas sobre: ${tema}

REGLAS OBLIGATORIAS:
- No repitas ideas
- No mezcles numeración
- No hagas bloques separados
- No reinicies la cuenta
- No agregues texto fuera de las ideas

FORMATO ESTRICTO:

Idea 1:
Título

Idea 2:
Título:

(continuar así hasta Idea ${cantidad})

Cada idea debe ser completamente diferente.
`);

  return new Response(
    JSON.stringify({
      ideas: resultado
    }),
    {
      headers: corsHeaders
    }
  );

  }  
      default:
        return json({
          error: "Tipo no válido"
        }, 400);

    }
  }
};
//Galería completa 
async function listarImagenes(env, json) {

  const lista = await env.IMAGES.list();
//está es la corrección 
  const imagenes = lista.objects.map(obj => ({
    nombre: obj.key,
    url: `https://pub-e461375551fb4e4086818d0c485c5fd4.r2.dev/${obj.key}`
  }));

  return json({
    success: true,
    images: imagenes,
    total: imagenes.length
  });

}

//Galería por categoría 
async function listarCategoria(
  categoria,
  env,
  json
) {

  const lista =
    await env.IMAGES.list({
      prefix: categoria + "/"
    });

  const imagenes =
    lista.objects.map(obj => ({
      nombre: obj.key,
      url:
        `https://pub-e461375551fb4e4086818d0c485c5fd4.r2.dev/${obj.key}`
    }));

  return json({
    success: true,
    images: imagenes,
    total: imagenes.length
  });

}

