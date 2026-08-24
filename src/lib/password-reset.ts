import { createHmac, timingSafeEqual } from "node:crypto";

const secret = () => process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET ?? "";

function signature(email: string, expires: number, passwordHash: string) {
  return createHmac("sha256", secret()).update(`${email}|${expires}|${passwordHash}`).digest("base64url");
}

export function createPasswordResetToken(email: string, passwordHash: string) {
  if (!secret()) throw new Error("AUTH_SECRET is not configured");
  const expires = Date.now() + 60 * 60 * 1000;
  const payload = Buffer.from(JSON.stringify({ email, expires })).toString("base64url");
  return `${payload}.${signature(email, expires, passwordHash)}`;
}

export function verifyPasswordResetToken(token: string, passwordHash: string) {
  try {
    const [payload, supplied] = token.split(".");
    const { email, expires } = JSON.parse(Buffer.from(payload, "base64url").toString()) as { email: string; expires: number };
    if (!email || !expires || expires < Date.now() || !secret()) return null;
    const expected = signature(email, expires, passwordHash);
    if (supplied.length !== expected.length || !timingSafeEqual(Buffer.from(supplied), Buffer.from(expected))) return null;
    return { email };
  } catch { return null; }
}
