// src/services/EVM/Aztec/adapters/transaction.ts
import type { TransactionAztec } from "../../../types";

export class TransactionAztecAdapter {
	static fromRPCTransaction(
		rpcTx: any,
		chainId: number,
		receipt?: any,
	): TransactionAztec {
		// Aztec transactions have a different structure
		const txEffect = receipt || rpcTx.txEffect;
		const txData = rpcTx.data || {};

		return {
			// Standard fields (mapped from Aztec)
			hash: rpcTx.txHash || rpcTx.hash || "",
			blockHash: rpcTx.blockHash || "",
			blockNumber: rpcTx.blockNumber?.toString() || "",
			from: txData.from || "0x0", // May not be directly exposed
			to: txData.to || "0x0",
			value: "0", // Value transfers work differently in Aztec
			data: txData.enqueuedCalls?.[0]?.args || "0x",
			nonce: "0", // Nonces work differently
			gas: "0",
			gasPrice: "0",
			transactionIndex: rpcTx.transactionIndex?.toString() || "0",
			type: "0x0",
			v: "0x0",
			r: "0x0",
			s: "0x0",

			// Aztec-specific
			status: this.mapStatus(receipt?.status),
			privateCallRequests: txData.forPrivate,
			publicCallRequests: txData.forPublic,
			txEffect,
			manaUsed: txEffect?.gasUsed?.toString(),
			nullifiers: txEffect?.data?.nullifiers || [],
			noteHashes: txEffect?.data?.noteHashes || [],
			l2ToL1Messages: txEffect?.data?.l2ToL1Msgs || [],

			// Receipt data if available
			receipt: receipt
				? {
						blockHash: receipt.blockHash || "",
						blockNumber: receipt.blockNumber?.toString() || "0",
						contractAddress: null,
						cumulativeGasUsed: "0",
						effectiveGasPrice: txEffect?.data?.transactionFee || "0",
						from: txData.from || "0x0",
						gasUsed: txEffect?.gasUsed?.toString() || "0",
						logs: [],
						logsBloom: "0x",
						status: receipt.status === "success" ? "0x1" : "0x0",
						to: txData.to || "0x0",
						transactionHash: rpcTx.txHash || "",
						transactionIndex: "0",
						type: "0x0",
					}
				: undefined,
		};
	}

	private static mapStatus(
		status?: string,
	): "pending" | "mined" | "proven" | "dropped" {
		if (!status) return "pending";

		switch (status) {
			case "success":
			case "app_logic_reverted":
			case "teardown_reverted":
			case "both_reverted":
				return "mined";
			case "proven":
				return "proven";
			case "dropped":
				return "dropped";
			default:
				return "pending";
		}
	}
}
