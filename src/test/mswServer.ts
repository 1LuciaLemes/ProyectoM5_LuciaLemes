import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

export const handlers = [
  http.post("/api/presign", () => {
    return HttpResponse.json({
      url: "https://s3.fake/presigned-url",
      publicUrl: "https://cdn.fake/producto.png",
    });
  }),
  http.put("https://s3.fake/presigned-url", () => {
    return new HttpResponse(null, {
      status: 200,
    });
  }),
];

export const server = setupServer(...handlers);
