import { scryptSync, timingSafeEqual } from "crypto";

/**
 * Verifies a plaintext password against a "salt:hash" string produced by
 * scryptSync (see src/db/seed.ts for the matching hash function).
 */
export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hashHex] = stored.split(":");
  if (!salt || !hashHex) return false;
  const candidate = scryptSync(password, salt, 64);
  const expected = Buffer.from(hashHex, "hex");
  if (candidate.length !== expected.length) return false;
  return timingSafeEqual(candidate, expected);
}
