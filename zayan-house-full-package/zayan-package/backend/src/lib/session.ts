import { createHmac, timingSafeEqual } from "crypto";

const SECRET = process.env.ADMIN_SESSION_SECRET || "dev-only-secret-change-me";
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export type SessionPayload = { email: string; role: string; exp: number };

function sign(data: string) {
  return createHmac("sha256", SECRET).update(data).digest("hex");
}

export function createSessionToken(email: string, role: string) {
  const payload: SessionPayload = { email, role, exp: Date.now() + ONE_DAY_MS };
  const json = JSON.stringify(payload);
  const b64 = Buffer.from(json).toString("base64url");
  const sig = sign(b64);
  return `${b64}.${sig}`;
}

export function verifySessionToken(token: string | undefined | null): SessionPayload | null {
  if (!token) return null;
  const [b64, sig] = token.split(".");
  if (!b64 || !sig) return null;
  const expected = sign(b64);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const payload: SessionPayload = JSON.parse(Buffer.from(b64, "base64url").toString());
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export const SESSION_COOKIE = "zh_admin_session";
