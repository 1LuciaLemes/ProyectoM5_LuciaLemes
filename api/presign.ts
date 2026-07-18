import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { randomUUID } from "node:crypto";

type PresignBody = {
  filename: string;
  contentType: string;
};

type PresignResponse = {
  url: string;
  key: string;
  publicUrl: string;
};

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.S3_BUCKET!;
const TTL_SECONDS = 600; // 10 minutos
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { filename, contentType } = (req.body ?? {}) as PresignBody;

  if (!filename || !contentType) {
    return res.status(400).json({ error: "filename y contentType son requeridos" });
  }

  if (!ALLOWED_TYPES.includes(contentType)) {
    return res.status(400).json({ error: "contentType no permitido" });
  }

  const key = `products/${randomUUID()}-${filename}`;

  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      ContentType: contentType,
    });

    const url = await getSignedUrl(s3, command, { expiresIn: TTL_SECONDS });
    const publicUrl = `https://${BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    const body: PresignResponse = { url, key, publicUrl };
    return res.status(200).json(body);
  } catch (err) {
    console.error("[presign] failed to sign", err);
    return res.status(500).json({ error: "Failed to sign URL" });
  }
}