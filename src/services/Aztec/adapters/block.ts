// src/services/EVM/Aztec/adapters/block.ts
import type { BlockAztec } from "../../../types";

export class BlockAztecAdapter {
	static fromRPCBlock(rpcBlock: any, chainId: number): BlockAztec {
		// Extract relevant fields from Aztec L2 block
		const header = rpcBlock.header || {};
		const archive = rpcBlock.archive || {};
		const globalVariables = header.globalVariables || {};
		const state = header.state?.partial || {};

		// Extract block number and timestamp from global variables
		const blockNumber = globalVariables.blockNumber?.toString() || "0";
		const timestamp = globalVariables.timestamp?.toString() || "0";

		// Extract transaction hashes
		const transactions =
			rpcBlock.body?.txEffects?.map((tx: any) => tx.txHash || tx) || [];

		return {
			// Standard block fields (mapped from Aztec structure)
			number: blockNumber,
			hash: rpcBlock.hash || "",
			parentHash: "", // Not directly exposed in Aztec
			timestamp,

			// Aztec-specific
			archive: archive.root || "",
			noteHashRoot: state.noteHashTree?.root || "",
			nullifierRoot: state.nullifierTree?.root || "",
			publicDataRoot: state.publicDataTree?.root || "",
			globalVariablesHash: header.globalVariablesHash || "",
			bodyHash: rpcBlock.body?.hash || "",

			// Transaction list
			transactions,

			// Fees and resources
			totalFees: header.totalFees || "0",
			totalManaUsed: header.totalManaUsed || "0",

			// Proving status (if available from separate call)
			provenBlock: undefined,
			pendingBlock: undefined,

			// L1 integration
			l1BlockNumber: globalVariables.l1BlockNumber?.toString() || undefined,

			// Fields not applicable to Aztec (set defaults)
			difficulty: "0",
			extraData: "0x",
			gasLimit: "0",
			gasUsed: "0",
			logsBloom: "0x",
			miner: globalVariables.coinbase || "0x0",
			mixHash: "0x",
			nonce: "0x0",
			receiptsRoot: "0x",
			sha3Uncles: "0x",
			size: "0",
			stateRoot: state.nullifierTree?.root || "0x",
			baseFeePerGas: undefined,
			totalDifficulty: "0",
			transactionsRoot: "0x",
			uncles: [],
			blobGasUsed: "0",
			excessBlobGas: "0",
			withdrawalsRoot: "0x",
			withdrawals: [],
		};
	}
}
