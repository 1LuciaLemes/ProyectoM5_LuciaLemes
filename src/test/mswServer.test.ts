import { afterEach, describe, expect, test, vi } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "./mswServer";
import { uploadImage } from "@/services/imgPresign/img.service";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("mswServer + uploadImage", () => {
  test("devuelve la publicUrl esperada en el flujo feliz", async () => {
    const file = new File(["fake image"], "foto.png", { type: "image/png" });

    const publicUrl = await uploadImage(file);

    expect(publicUrl).toBe("https://cdn.fake/producto.png");
  });

  test("falla si presign responde error", async () => {
    server.use(
      http.post("/api/presign", () => {
        return HttpResponse.json({ error: "bad request" }, { status: 400 });
      }),
    );

    const file = new File(["fake image"], "foto.png", { type: "image/png" });

    await expect(uploadImage(file)).rejects.toThrow(
      "No se pudo generar la URL firmada",
    );
  });

  test("falla si la subida a S3 responde error", async () => {
    server.use(
      http.put("https://s3.fake/presigned-url", () => {
        return new HttpResponse(null, { status: 500 });
      }),
    );

    const file = new File(["fake image"], "foto.png", { type: "image/png" });

    await expect(uploadImage(file)).rejects.toThrow(
      "No se pudo subir la imagen a S3",
    );
  });
});
