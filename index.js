export default {
  async fetch(request) {

    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "*"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: cors
      });
    }

    return new Response(
      JSON.stringify({
        ok: true,
        image_url: "https://picsum.photos/600"
      }),
      {
        headers: {
          ...cors,
          "Content-Type": "application/json"
        }
      }
    );
  }
};
