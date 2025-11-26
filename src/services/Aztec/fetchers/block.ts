// src/services/EVM/Aztec/fetchers/block.ts
import { RPCClient } from "../../common/RPCClient";

export class BlockFetcherAztec {
	constructor(
		private rpcClient: RPCClient,
		private chainId: number,
	) {}

	// Get L2 block using Aztec-specific method
	async getBlock(blockNumber: number | "latest"): Promise<any> {
		const result = await this.rpcClient.call("node_getBlock", [blockNumber]);
		return result;
	}

	// Get block with full transactions
	async getBlockWithTransactions(blockNumber: number | "latest"): Promise<any> {
		const block = await this.getBlock(blockNumber);

		// Fetch full transaction details for each tx hash
		if (block && block.body?.txEffects) {
			const txDetails = await Promise.all(
				block.body.txEffects.map((txHash: string) =>
					this.rpcClient.call("node_getTxEffect", [txHash]),
				),
			);
			block.transactionDetails = txDetails;
		}

		return block;
	}

	// Get latest block number (L2)
	async getLatestBlockNumber(): Promise<number> {
		return await this.rpcClient.call<number>("node_getBlockNumber", []);
	}

	// Get proven block number
	async getProvenBlockNumber(): Promise<number> {
		return await this.rpcClient.call<number>("node_getProvenBlockNumber", []);
	}

	// Get L2 tips (latest, pending, proven)
	async getL2Tips(): Promise<any> {
		return await this.rpcClient.call("node_getL2Tips", []);
	}

	// Get block header
	async getBlockHeader(blockNumber?: number | "latest"): Promise<any> {
		return await this.rpcClient.call("node_getBlockHeader", [blockNumber]);
	}

	// Get block by hash
	async getBlockByHash(
		blockHash: string,
		fullTransactions: boolean = false,
	): Promise<any> {
		// Aztec uses node_getBlock with block number
		// We need to find the block number first or use a different approach
		// For now, return null as this requires additional logic
		console.warn(
			"getBlockByHash not directly supported in Aztec node API, requires block number",
		);
		return null;
	}

	getChainId(): number {
		return this.chainId;
	}
}
