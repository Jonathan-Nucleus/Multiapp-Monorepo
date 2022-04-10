import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";

import "dotenv/config";

const AWS_ACCESS_KEY_ID = process.env.AWS_S3_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_S3_SECRET_ACCESS_KEY;
const AWS_UPLOAD_REGION = process.env.AWS_REGION;
const S3_BUCKET = process.env.AWS_S3_BUCKET;

export interface RemoteUpload {
  remoteName: string;
  uploadUrl: string;
}

export async function getUploadUrl(
  fileExt: string,
  type: "avatar" | "post"
): Promise<RemoteUpload | null> {
  if (
    !AWS_ACCESS_KEY_ID ||
    !AWS_SECRET_ACCESS_KEY ||
    !AWS_UPLOAD_REGION ||
    !S3_BUCKET
  ) {
    return null;
  }

  const remoteFilename = `${uuid()}.${fileExt}`;
  const remoteKey = `${type}s/${remoteFilename}`;

  const client = new S3Client({
    region: AWS_UPLOAD_REGION,
    credentials: {
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
  });
  const command = new PutObjectCommand({
    Bucket: S3_BUCKET,
    Key: remoteKey,
  });

  try {
    const url = await getSignedUrl(client, command, { expiresIn: 60 });
    return {
      remoteName: remoteFilename,
      uploadUrl: url,
    };
  } catch (err) {
    return null;
  }
}
