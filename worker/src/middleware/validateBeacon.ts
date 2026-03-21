import type { Context, Next } from "hono";
import { ALLOWED_BEACON_NETWORKS, type Env } from "../types";

export async function validateBeaconMiddleware(c: Context<{ Bindings: Env }>, next: Next) {
  const networkId = c.req.param("networkId");
  const slot = c.req.param("slot");

  if (!networkId || !ALLOWED_BEACON_NETWORKS[networkId]) {
    const allowed = Object.keys(ALLOWED_BEACON_NETWORKS).join(", ");
    return c.json({ error: `Invalid networkId. Allowed: ${allowed}` }, 400);
  }

  if (!slot || !/^\d+$/.test(slot) || Number(slot) <= 0) {
    return c.json({ error: "slot must be a positive integer" }, 400);
  }

  await next();
}
