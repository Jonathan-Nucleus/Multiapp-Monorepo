import jwt, { JwtPayload } from "jsonwebtoken";
import type { DeserializedUser } from "../db/collections/users";
import { BadRequestError } from "./validate";

import "dotenv/config";

if (!process.env.IGNITE_SECRET) {
  throw new Error("IGNITE_SECRET env var undefined");
}

if (!process.env.WATERMARK_JWT_SECRET) {
  throw new Error("WATERMARK_JWT_SECRET env var undefined");
}

const IGNITE_SECRET = process.env.IGNITE_SECRET as string;
const WATERMARK_JWT_SECRET = process.env.WATERMARK_JWT_SECRET as string;

export type AccessToken = string;
export type AccessTokenPayload = DeserializedUser;
export function getAccessToken(user: DeserializedUser): AccessToken {
  return jwt.sign(user, IGNITE_SECRET);
}

export type Token = string;
export type ResetTokenPayload = { email: string; tkn: string };
export function getResetToken(email: string, emailToken: string): Token {
  return jwt.sign(
    {
      email: email,
      tkn: emailToken,
    },
    IGNITE_SECRET
  );
}

export function decodeToken(token: string): JwtPayload {
  try {
    return jwt.verify(token, IGNITE_SECRET, { complete: false }) as JwtPayload;
  } catch {
    throw new BadRequestError("Token is invalid.");
  }
}

export function getDocumentToken(
  email: string,
  fundId: string,
  filename: string
): Token {
  return jwt.sign(
    {
      watermark: email,
      file: `funds/${fundId}/${filename}`,
    },
    WATERMARK_JWT_SECRET
  );
}
