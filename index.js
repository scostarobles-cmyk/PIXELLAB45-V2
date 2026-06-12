export default {
  async fetch(request) {

    const { prompt } = await request.json();

    return Response.json({
      ok: true,
      promptRecibido: prompt
    });

  }
}
