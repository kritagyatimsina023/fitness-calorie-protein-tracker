import { SignJWT, jwtVerify } from "jose";

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) throw new Error("JWT_SECRET must be at least 32 characters.");
  return new TextEncoder().encode(secret);
}

export type SessionClaims = { sessionId: string; userId: string };

export async function signSessionToken(claims: SessionClaims, expiresAt: Date) {
  return new SignJWT({ userId: claims.userId })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(claims.sessionId)
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(getSecret());
}

export async function verifySessionToken(token: string): Promise<SessionClaims | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret(), { algorithms: ["HS256"] });
    if (!payload.sub || typeof payload.userId !== "string") return null;
    return { sessionId: payload.sub, userId: payload.userId };
  } catch {
    return null;
  }
}

export function getSessionExpiry() {
  return new Date(Date.now() + SESSION_DURATION_MS);
}
