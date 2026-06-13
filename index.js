export default {
  async fetch(request, env) {

    return new Response(
      JSON.stringify({
        ok: true,
        tokenExiste: !!env.HF_API_TOKEN
      }),
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

  }
}
