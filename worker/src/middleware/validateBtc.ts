import type { Context, Next } from "hono";
import { ALLOWED_BTC_METHODS, type BtcRpcRequestBody, type Env } from "../types";

export async function validateBtcMiddleware(c: Context<{ Bindings: Env }>, next: Next) {
  let body: BtcRpcRequestBody;
  try {
    body = await c.req.json<BtcRpcRequestBody>();
  } catch {
    return c.json({ error: "Invalid JSON" }, 400);
  }

  if (body.jsonrpc !== "2.0") {
    return c.json({ error: 'jsonrpc must be "2.0"' }, 400);
  }

  if (typeof body.method !== "string" || !ALLOWED_BTC_METHODS.includes(body.method as never)) {
    return c.json({ error: `Method not allowed. Allowed: ${ALLOWED_BTC_METHODS.join(", ")}` }, 400);
  }

  if (!Array.isArray(body.params)) {
    return c.json({ error: "params must be an array" }, 400);
  }

  c.set("validatedBody" as never, body as never);
  await next();
}
