// src/services/EVM/Aztec/fetchers/address.ts
import { RPCClient } from "../../common/RPCClient";
import type { AddressTransactionsResult } from "../../../types";

export class AddressFetcherAztec {
	constructor(
		private rpcClient: RPCClient,
		private chainId: number,
	) {}

	// Standard Ethereum methods still work for EOAs
	async getBalance(address: string): Promise<bigint> {
		const result = await this.rpcClient.call<string>("eth_getBalance", [
			address,
			"latest",
		]);
		return BigInt(result);
	}

	// Get contract code (if deployed)
	async getCode(address: string): Promise<string> {
		return await this.rpcClient.call<string>("eth_getCode", [
			address,
			"latest",
		]);
	}

	// Get transaction count (nonce)
	async getTransactionCount(address: string): Promise<number> {
		const result = await this.rpcClient.call<string>(
			"eth_getTransactionCount",
			[address, "latest"],
		);
		return parseInt(result, 16);
	}

	// Aztec-specific: Get contract instance
	async getContract(address: string): Promise<any> {
		try {
			return await this.rpcClient.call("node_getContract", [address]);
		} catch (error) {
			// Contract might not exist or not be an Aztec contract
			return null;
		}
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
