import jwt, { JwtPayload } from "jsonwebtoken";
import type { DeserializedUser } from "backend/db/collections/users";

import "dotenv/config";

if (!process.env.IGNITE_SECRET) {
  throw new Error("IGNITE_SECRET env var undefined");
}
const IGNITE_SECRET = process.env.IGNITE_SECRET as string;

export type AccessToken = string;
export type AccessTokenPayload = DeserializedUser;
export function getAccessToken(user: DeserializedUser): AccessToken {
  return jwt.sign(user, IGNITE_SECRET);
}

export type Token = string;
export type ResetTokenPayload = { _id: string; tkn: string };
export function getResetToken(userId: string, emailToken: string): Token {
  return jwt.sign(
    {
      _id: userId,
      tkn: emailToken,
    },
    IGNITE_SECRET
  );
}

export function decodeToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, IGNITE_SECRET, { complete: false }) as JwtPayload;
  } catch {
    return null;
  }
}
