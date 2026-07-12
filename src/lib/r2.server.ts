import { S3Client } from "@aws-sdk/client-s3";

const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID || "";
const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || "";
const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || "";

export const r2BucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME || "";
export const r2PublicUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL || "";

if (!accountId || !accessKeyId || !secretAccessKey || !r2BucketName) {
  console.warn(
    "[R2 Storage] Warning: Cloudflare R2 environment variables are missing! R2 Storage will not function properly."
  );
}

export const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});
