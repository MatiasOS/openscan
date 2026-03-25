import type { Context } from "hono";
import type { BtcRpcRequestBody, Env } from "../types";

const ALCHEMY_BTC_URL = "https://bitcoin-mainnet.g.alchemy.com/v2";

export async function btcAlchemyHandler(c: Context<{ Bindings: Env }>) {
  const body = c.get("validatedBody" as never) as unknown as BtcRpcRequestBody;
  const url = `${ALCHEMY_BTC_URL}/${c.env.ALCHEMY_API_KEY}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) {
        const retryAfter = response.headers.get("Retry-After");
        if (retryAfter) c.header("Retry-After", retryAfter);
        return c.json({ error: "Bitcoin RPC rate limit exceeded" }, 429);
      }
      return c.json({ error: `Bitcoin RPC error (HTTP ${status})` }, 502);
    }

    const data = await response.json();
    return c.json(data);
  } catch {
    return c.json({ error: "Failed to connect to Bitcoin RPC" }, 502);
  }
}
