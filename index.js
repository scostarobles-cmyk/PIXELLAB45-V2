export default {
  async fetch(request) {

    if (request.method !== "POST") {
      return Response.json({
        ok: true,
        mensaje: "Worker activo"
      });
    }

    try {

      const { prompt } = await request.json();

      return Response.json({
        ok: true,
        promptRecibido: prompt
      });

    } catch (err) {

      return Response.json({
        ok: false,
        error: err.message
      });

    }

  }
};
