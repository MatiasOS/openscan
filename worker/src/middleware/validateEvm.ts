import type { Context, Next } from "hono";
import {
  ALLOWED_EVM_METHODS,
  ALLOWED_EVM_NETWORKS,
  type EvmRpcRequestBody,
  type Env,
} from "../types";

const allowedMethodSet = new Set<string>(ALLOWED_EVM_METHODS);

export async function validateEvmMiddleware(c: Context<{ Bindings: Env }>, next: Next) {
  const networkId = c.req.param("networkId");

  if (!networkId || !ALLOWED_EVM_NETWORKS[networkId]) {
    const allowed = Object.keys(ALLOWED_EVM_NETWORKS).join(", ");
    return c.json({ error: `Invalid networkId. Allowed: ${allowed}` }, 400);
  }

  let body: EvmRpcRequestBody;
  try {
    body = await c.req.json<EvmRpcRequestBody>();
  } catch {
    return c.json({ error: "Invalid JSON" }, 400);
  }

  if (body.jsonrpc !== "2.0") {
    return c.json({ error: 'jsonrpc must be "2.0"' }, 400);
  }

  if (typeof body.method !== "string" || !allowedMethodSet.has(body.method)) {
    return c.json({ error: `Method not allowed. Allowed: ${ALLOWED_EVM_METHODS.join(", ")}` }, 400);
  }

  if (!Array.isArray(body.params)) {
    return c.json({ error: "params must be an array" }, 400);
  }

  c.set("validatedBody" as never, body as never);
  await next();
}
