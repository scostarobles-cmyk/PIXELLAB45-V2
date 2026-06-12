export default {
  async fetch(request) {
    if (request.method === "POST") {
      const { prompt } = await request.json();

      // Hacemos la solicitud a Replicate
      const replicateResponse = await fetch("https://api.replicate.com/v1/predictions", {
        method: "POST",
        headers: {
          "Authorization": `Token ${env.REPLICATE_API_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "flux-1.1-pro", // Reemplaza con el ID del modelo en Replicate
          input: { prompt: prompt }
        })
      });

      // Obtenemos la respuesta de Replicate
      const replicateData = await replicateResponse.json();

      // Extraemos la URL de la imagen generada
      const imageUrl = replicateData.output; // Esto asume que Replicate devuelve una URL

      // Devolvemos la URL en la respuesta
      return new Response(JSON.stringify({
        ok: true,
        image_url: imageUrl
      }
                                         }                
