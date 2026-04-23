import { describe, expect, it } from "vitest";
import { rewriteIpfsUrl, toSafeExternalHref } from "./urlUtils";

describe("rewriteIpfsUrl", () => {
  it("rewrites ipfs:// to the public HTTPS gateway", () => {
    expect(rewriteIpfsUrl("ipfs://QmHash/foo.png")).toBe("https://ipfs.io/ipfs/QmHash/foo.png");
  });

  it("leaves http(s) and other schemes unchanged", () => {
    expect(rewriteIpfsUrl("https://example.com/a")).toBe("https://example.com/a");
    expect(rewriteIpfsUrl("http://example.com/a")).toBe("http://example.com/a");
    expect(rewriteIpfsUrl("javascript:alert(1)")).toBe("javascript:alert(1)");
  });
});

describe("toSafeExternalHref", () => {
  it("accepts http:// and https:// URLs", () => {
    expect(toSafeExternalHref("http://example.com")).toBe("http://example.com");
    expect(toSafeExternalHref("https://example.com/path?q=1")).toBe("https://example.com/path?q=1");
  });

  it("rewrites ipfs:// to the HTTPS gateway", () => {
    expect(toSafeExternalHref("ipfs://QmHash")).toBe("https://ipfs.io/ipfs/QmHash");
  });

  it("rejects dangerous schemes", () => {
    expect(toSafeExternalHref("javascript:alert(1)")).toBeNull();
    expect(toSafeExternalHref("JAVASCRIPT:alert(1)")).toBeNull();
    expect(toSafeExternalHref("data:text/html,<script>alert(1)</script>")).toBeNull();
    expect(toSafeExternalHref("vbscript:msgbox")).toBeNull();
    expect(toSafeExternalHref("file:///etc/passwd")).toBeNull();
  });

  it("rejects empty, non-string, and malformed input", () => {
    expect(toSafeExternalHref("")).toBeNull();
    expect(toSafeExternalHref(undefined)).toBeNull();
    expect(toSafeExternalHref(null)).toBeNull();
    expect(toSafeExternalHref(123)).toBeNull();
    expect(toSafeExternalHref("not a url")).toBeNull();
    expect(toSafeExternalHref("/relative/path")).toBeNull();
  });
});
