export default {
  async fetch(request, env) {

    return Response.json({
      tokenExiste: !!env.REPLICATE_API_TOKEN,
      tokenPrimeros5: env.REPLICATE_API_TOKEN?.substring(0,5)
    });

  }
};
