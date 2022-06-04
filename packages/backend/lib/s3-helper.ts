import {
  S3Client,
  PutObjectCommand,
  CopyObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuid } from "uuid";

import { InternalServerError } from "./validate";

import "dotenv/config";

const AWS_UPLOAD_REGION = process.env.AWS_REGION;
const S3_BUCKET = process.env.AWS_S3_BUCKET;

export interface RemoteUpload {
  remoteName: string;
  uploadUrl: string;
}

export async function getUploadUrl(
  fileExt: string,
  type: "avatar" | "post" | "background" | "fund",
  id: string
): Promise<RemoteUpload> {
  if (!AWS_UPLOAD_REGION || !S3_BUCKET) {
    throw new InternalServerError("Missing AWS configuration");
  }

  const remoteFilename = `${uuid()}.${fileExt}`;
  const remoteKey = `${type}s/${id}/${remoteFilename}`;

  const client = new S3Client({
    region: AWS_UPLOAD_REGION,
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
    console.error(err);
    throw new InternalServerError("Not able to generate signed url.");
  }
}

export async function movePostMedia(
  userId: string,
  postId: string,
  filename: string
): Promise<boolean> {
  if (process.env.NODE_ENV === "test") return true;

  if (!AWS_UPLOAD_REGION || !S3_BUCKET) {
    throw new InternalServerError("Missing AWS configuration");
  }

  const originalKey = `posts/${userId}/${filename}`;
  const newKey = `posts/${userId}/${postId}/${filename}`;

  const client = new S3Client({
    region: AWS_UPLOAD_REGION,
  });
  const copyCommand = new CopyObjectCommand({
    Bucket: S3_BUCKET,
    CopySource: `${S3_BUCKET}/${originalKey}`,
    Key: newKey,
  });
  const deleteCommand = new DeleteObjectCommand({
    Bucket: S3_BUCKET,
    Key: originalKey,
  });

  try {
    await client.send(copyCommand);
    await client.send(deleteCommand);

    return true;
  } catch (err) {
    console.error(err);
    throw new InternalServerError("Not able to generate signed url.");
  }

  return false;
}
