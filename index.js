export default {
  async fetch(request) {
    return new Response("Pixellab45 worker online desde github", {
      headers: { "content-type": "text/plain" },
    });
  },
};
