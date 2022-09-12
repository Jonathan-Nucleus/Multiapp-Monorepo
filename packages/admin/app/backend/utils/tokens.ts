import jwt, { JwtPayload } from "jsonwebtoken";
import type { DeserializedUser } from "../db/collections/users";
import { BadRequestError } from "../apollo/validate";

import "dotenv/config";

if (!process.env.ADMIN_SECRET) {
  throw new Error("ADMIN_SECRET env var undefined");
}

const ADMIN_SECRET = process.env.ADMIN_SECRET as string;

export type AccessToken = string;
export type AccessTokenPayload = DeserializedUser;
export function getAccessToken(user: DeserializedUser): AccessToken {
  return jwt.sign(user, ADMIN_SECRET);
}

export function decodeToken(token: string): JwtPayload {
  try {
    return jwt.verify(token, ADMIN_SECRET, { complete: false }) as JwtPayload;
  } catch {
    throw new BadRequestError("Token is invalid.");
  }
}
