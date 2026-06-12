export default {
  async fetch(request) {

    return Response.json({
      ok: true,
      image_url: "https://picsum.photos/600"
    });

  }
};
