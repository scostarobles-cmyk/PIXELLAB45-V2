export default {
  async fetch(request) {
    return new Response("Pixellab45 worker online", {
      headers: { "content-type": "text/plain" },
    });
  },
};
