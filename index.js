export default {
  async fetch(request, env) {

    return Response.json({
      ok: true,
      tokenExiste: !!env.REPLICATE_API_TOKEN
    });

  }
}
