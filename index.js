export default {
  async fetch(request) {

    if (request.method === "POST") {

      const { prompt } = await request.json();

      return Response.json({
        ok: true,
        promptRecibido: prompt
      });
    }

    return new Response(
      "PIXELLAB45 Worker Online",
      {
        headers: {
          "content-type": "text/plain"
        }
      }
    );
  }
};
