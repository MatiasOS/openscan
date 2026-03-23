/**
 * Static registry of known x402 payment facilitators.
 *
 * Data is keyed by EVM chain ID → lowercased address for O(1) lookup.
 * Only networks currently supported by OpenScan are included.
 */

export interface X402Facilitator {
  name: string;
  description: string;
  logoUrl: string;
  websiteUrl: string;
  baseUrl: string;
  schemes: string[];
  assets: string[];
  supports: {
    verify: boolean;
    settle: boolean;
    supported: boolean;
    list: boolean;
  };
}

/**
 * Chain ID → lowercased address → facilitator metadata.
 */
const X402_FACILITATORS: Record<number, Record<string, X402Facilitator>> = {
  // ── Base (8453) ──────────────────────────────────────────────
  8453: {
    "0x0ea9c5a6df69ff9e7236de69478473726c0109dd": {
      name: "0xArchive Facilitator",
      description:
        "First HyperEVM-native x402 facilitator. Fee-free USDC settlement on HyperEVM and Base Mainnet.",
      logoUrl: "/logos/0xarchive.png",
      websiteUrl: "https://0xarchive.io",
      baseUrl: "https://facilitator.0xarchive.io",
      schemes: ["exact"],
      assets: ["EIP-3009"],
      supports: { verify: true, settle: true, supported: true, list: false },
    },
    "0x15e2e2da7539ef1f652aa3c1d6142a535aa3d7ea": {
      name: "Bitrefill Facilitator",
      description: "Free x402 facilitator for EVM and Solana",
      logoUrl: "/logos/bitrefill.png",
      websiteUrl: "https://www.bitrefill.com",
      baseUrl: "https://api.bitrefill.com/x402",
      schemes: ["exact"],
      assets: ["EIP-3009", "SPL"],
      supports: { verify: true, settle: true, supported: true, list: false },
    },
    "0x3f8d2fb6fea24e70155bc61471936f3c9c30c206": {
      name: "fretchen.eu Facilitator",
      description:
        "Production x402 v2 Facilitator on Optimism and Base with EIP-3009 USDC payment verification and settlement.",
      logoUrl: "/logos/fretchen-facilitator.png",
      websiteUrl: "https://www.fretchen.eu/x402/",
      baseUrl: "https://facilitator.fretchen.eu",
      schemes: ["exact"],
      assets: ["EIP-3009"],
      supports: { verify: true, settle: true, supported: true, list: false },
    },
    "0x021cc47adeca6673def958e324ca38023b80a5be": {
      name: "Heurist Facilitator",
      description:
        "Enterprise-grade x402 facilitator on EVM chains. Supporting both V1 and V2. OFAC-Compliant.",
      logoUrl: "/logos/heurist-x402-logo.png",
      websiteUrl: "https://facilitator.heurist.ai",
      baseUrl: "https://facilitator.heurist.xyz",
      schemes: ["exact"],
      assets: ["EIP-3009"],
      supports: { verify: true, settle: true, supported: true, list: false },
    },
    "0x1fc230ee3c13d0d520d49360a967dbd1555c8326": {
      name: "Heurist Facilitator",
      description:
        "Enterprise-grade x402 facilitator on EVM chains. Supporting both V1 and V2. OFAC-Compliant.",
      logoUrl: "/logos/heurist-x402-logo.png",
      websiteUrl: "https://facilitator.heurist.ai",
      baseUrl: "https://facilitator.heurist.xyz",
      schemes: ["exact"],
      assets: ["EIP-3009"],
      supports: { verify: true, settle: true, supported: true, list: false },
    },
    "0x290d8b8edcafb25042725cb9e78bcac36b8865f8": {
      name: "Heurist Facilitator",
      description:
        "Enterprise-grade x402 facilitator on EVM chains. Supporting both V1 and V2. OFAC-Compliant.",
      logoUrl: "/logos/heurist-x402-logo.png",
      websiteUrl: "https://facilitator.heurist.ai",
      baseUrl: "https://facilitator.heurist.xyz",
      schemes: ["exact"],
      assets: ["EIP-3009"],
      supports: { verify: true, settle: true, supported: true, list: false },
    },
    "0x3f61093f61817b29d9556d3b092e67746af8cdfd": {
      name: "Heurist Facilitator",
      description:
        "Enterprise-grade x402 facilitator on EVM chains. Supporting both V1 and V2. OFAC-Compliant.",
      logoUrl: "/logos/heurist-x402-logo.png",
      websiteUrl: "https://facilitator.heurist.ai",
      baseUrl: "https://facilitator.heurist.xyz",
      schemes: ["exact"],
      assets: ["EIP-3009"],
      supports: { verify: true, settle: true, supported: true, list: false },
    },
    "0x48ab4b0af4ddc2f666a3fcc43666c793889787a3": {
      name: "Heurist Facilitator",
      description:
        "Enterprise-grade x402 facilitator on EVM chains. Supporting both V1 and V2. OFAC-Compliant.",
      logoUrl: "/logos/heurist-x402-logo.png",
      websiteUrl: "https://facilitator.heurist.ai",
      baseUrl: "https://facilitator.heurist.xyz",
      schemes: ["exact"],
      assets: ["EIP-3009"],
      supports: { verify: true, settle: true, supported: true, list: false },
    },
    "0x612d72dc8402bba997c61aa82ce718ea23b2df5d": {
      name: "Heurist Facilitator",
      description:
        "Enterprise-grade x402 facilitator on EVM chains. Supporting both V1 and V2. OFAC-Compliant.",
      logoUrl: "/logos/heurist-x402-logo.png",
      websiteUrl: "https://facilitator.heurist.ai",
      baseUrl: "https://facilitator.heurist.xyz",
      schemes: ["exact"],
      assets: ["EIP-3009"],
      supports: { verify: true, settle: true, supported: true, list: false },
    },
    "0xb578b7db22581507d62bdbeb85e06acd1be09e11": {
      name: "Heurist Facilitator",
      description:
        "Enterprise-grade x402 facilitator on EVM chains. Supporting both V1 and V2. OFAC-Compliant.",
      logoUrl: "/logos/heurist-x402-logo.png",
      websiteUrl: "https://facilitator.heurist.ai",
      baseUrl: "https://facilitator.heurist.xyz",
      schemes: ["exact"],
      assets: ["EIP-3009"],
      supports: { verify: true, settle: true, supported: true, list: false },
    },
    "0xd97c12726dcf994797c981d31cfb243d231189fb": {
      name: "Heurist Facilitator",
      description:
        "Enterprise-grade x402 facilitator on EVM chains. Supporting both V1 and V2. OFAC-Compliant.",
      logoUrl: "/logos/heurist-x402-logo.png",
      websiteUrl: "https://facilitator.heurist.ai",
      baseUrl: "https://facilitator.heurist.xyz",
      schemes: ["exact"],
      assets: ["EIP-3009"],
      supports: { verify: true, settle: true, supported: true, list: false },
    },
    "0x6448d7772cf9dbd6112ae14176ee5e447a040a45": {
      name: "KAMIYO Facilitator",
      description:
        "x402 payment facilitator powering autonomous agent transactions on Base and Solana.",
      logoUrl: "/logos/kamiyo.png",
      websiteUrl: "https://kamiyo.ai",
      baseUrl: "https://x402.kamiyo.ai",
      schemes: ["exact"],
      assets: ["ERC-20", "SPL"],
      supports: { verify: true, settle: true, supported: true, list: false },
    },
    "0x67a3176acd5db920747eef65b813b028ad143cdb": {
      name: "Kobaru",
      description:
        "x402 Facilitator built from scratch by payment veterans who understand what payment systems demand.",
      logoUrl: "/logos/kobaru.png",
      websiteUrl: "https://www.kobaru.io",
      baseUrl: "https://gateway.kobaru.io",
      schemes: ["exact"],
      assets: ["SPL", "EIP-3009"],
      supports: { verify: true, settle: true, supported: true, list: true },
    },
    "0xc6699d2aada6c36dfea5c248dd70f9cb0235cb63": {
      name: "PayAI Facilitator",
      description:
        "Accept x402 payments on all networks including Avalanche, Base, Polygon, Sei, Solana, and more! Get started in less than 1 minute. Supports all tokens. No API Keys required.",
      logoUrl: "/logos/payai.svg",
      websiteUrl: "https://facilitator.payai.network",
      baseUrl: "https://facilitator.payai.network",
      schemes: ["exact"],
      assets: ["EIP-3009", "SPL", "Token-2022"],
      supports: { verify: true, settle: true, supported: true, list: true },
    },
    "0xb2bd29925cbbcea7628279c91945ca5b98bf371b": {
      name: "PayAI Facilitator",
      description:
        "Accept x402 payments on all networks including Avalanche, Base, Polygon, Sei, Solana, and more! Get started in less than 1 minute. Supports all tokens. No API Keys required.",
      logoUrl: "/logos/payai.svg",
      websiteUrl: "https://facilitator.payai.network",
      baseUrl: "https://facilitator.payai.network",
      schemes: ["exact"],
      assets: ["EIP-3009", "SPL", "Token-2022"],
      supports: { verify: true, settle: true, supported: true, list: true },
    },
  },

  // ── Optimism (10) ────────────────────────────────────────────
  10: {
    "0x3f8d2fb6fea24e70155bc61471936f3c9c30c206": {
      name: "fretchen.eu Facilitator",
      description:
        "Production x402 v2 Facilitator on Optimism and Base with EIP-3009 USDC payment verification and settlement.",
      logoUrl: "/logos/fretchen-facilitator.png",
      websiteUrl: "https://www.fretchen.eu/x402/",
      baseUrl: "https://facilitator.fretchen.eu",
      schemes: ["exact"],
      assets: ["EIP-3009"],
      supports: { verify: true, settle: true, supported: true, list: false },
    },
  },

  // ── Polygon (137) ────────────────────────────────────────────
  137: {
    "0x15e2e2da7539ef1f652aa3c1d6142a535aa3d7ea": {
      name: "Bitrefill Facilitator",
      description: "Free x402 facilitator for EVM and Solana",
      logoUrl: "/logos/bitrefill.png",
      websiteUrl: "https://www.bitrefill.com",
      baseUrl: "https://api.bitrefill.com/x402",
      schemes: ["exact"],
      assets: ["EIP-3009", "SPL"],
      supports: { verify: true, settle: true, supported: true, list: false },
    },
    "0xc6699d2aada6c36dfea5c248dd70f9cb0235cb63": {
      name: "PayAI Facilitator",
      description:
        "Accept x402 payments on all networks including Avalanche, Base, Polygon, Sei, Solana, and more! Get started in less than 1 minute. Supports all tokens. No API Keys required.",
      logoUrl: "/logos/payai.svg",
      websiteUrl: "https://facilitator.payai.network",
      baseUrl: "https://facilitator.payai.network",
      schemes: ["exact"],
      assets: ["EIP-3009", "SPL", "Token-2022"],
      supports: { verify: true, settle: true, supported: true, list: true },
    },
    "0xb2bd29925cbbcea7628279c91945ca5b98bf371b": {
      name: "PayAI Facilitator",
      description:
        "Accept x402 payments on all networks including Avalanche, Base, Polygon, Sei, Solana, and more! Get started in less than 1 minute. Supports all tokens. No API Keys required.",
      logoUrl: "/logos/payai.svg",
      websiteUrl: "https://facilitator.payai.network",
      baseUrl: "https://facilitator.payai.network",
      schemes: ["exact"],
      assets: ["EIP-3009", "SPL", "Token-2022"],
      supports: { verify: true, settle: true, supported: true, list: true },
    },
  },
};

/**
 * Look up a facilitator by chain ID and address.
 * Returns the facilitator metadata or undefined if not found.
 */
export function getX402Facilitator(chainId: number, address: string): X402Facilitator | undefined {
  return X402_FACILITATORS[chainId]?.[address.toLowerCase()];
}

/**
 * Check whether an address is a known x402 facilitator on the given chain.
 */
export function isX402Facilitator(chainId: number, address: string): boolean {
  return getX402Facilitator(chainId, address) !== undefined;
}
