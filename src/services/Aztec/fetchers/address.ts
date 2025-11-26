// src/services/EVM/Aztec/fetchers/address.ts
import { RPCClient, RPCResponse } from "../../common/RPCClient";
import type { AddressTransactionsResult } from "../../../types";

export class AddressFetcherAztec {
	constructor(
		private rpcClient: RPCClient,
		private chainId: number,
	) {}

	// Standard Ethereum methods still work for EOAs
	async getBalance(address: string): Promise<bigint> {
		return BigInt(0);
	}

	// Get contract code (if deployed)
	async getCode(address: string): Promise<string> {
		const contractClass: RPCResponse = await this.rpcClient.call<RPCResponse>("node_getContractClass", [
			address,
			"latest",
		]);

		if (!contractClass || contractClass?.result) return "0x";
		return contractClass.result;

	}

	// Get transaction count (nonce)
	async getTransactionCount(address: string): Promise<number> {
		// const result = await this.rpcClient.call<string>(
		// 	"eth_getTransactionCount",
		// 	[address, "latest"],
		// );
		return 0;
	}

	// Get public storage at slot
	async getPublicStorageAt(
		address: string,
		slot: string,
		blockNumber?: number | "latest",
	): Promise<string> {
		return await this.rpcClient.call<string>("node_getPublicStorageAt", [
			blockNumber || "latest",
			address,
			slot,
		]);
	}

	// Get address transactions (using logs)
	async getAddressTransactions(
		address: string,
		fromBlock: number | "earliest",
		toBlock: number | "latest",
	): Promise<AddressTransactionsResult> {
		try {
			// Use public logs to find transactions involving this address
			const logs = await this.rpcClient.call("node_getPublicLogs", [
				{
					fromBlock,
					toBlock,
					contractAddress: address,
				},
			]);

			// Extract unique transaction hashes
			const txHashes = new Set<string>();
			if (logs?.logs) {
				logs.logs.forEach((log: any) => {
					if (log.txHash) txHashes.add(log.txHash);
				});
			}

			return {
				transactions: Array.from(txHashes),
				source: "logs",
				isComplete: false,
				message: "Aztec transaction history from public logs only",
			};
		} catch (error) {
			console.error("Error fetching address transactions:", error);
			return {
				transactions: [],
				source: "none",
				isComplete: false,
				message: "Could not fetch transaction history",
			};
		}
	}

	getChainId(): number {
		return this.chainId;
	}
}
