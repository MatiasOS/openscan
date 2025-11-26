// src/services/EVM/Aztec/fetchers/transaction.ts
import { RPCClient } from "../../common/RPCClient";

export class TransactionFetcherAztec {
	constructor(
		private rpcClient: RPCClient,
		private chainId: number,
	) {}

	// Get transaction by hash
	async getTransaction(txHash: string): Promise<any> {
		return await this.rpcClient.call("node_getTxByHash", [txHash]);
	}

	// Get transaction receipt
	async getTransactionReceipt(txHash: string): Promise<any> {
		return await this.rpcClient.call("node_getTxReceipt", [txHash]);
	}

	// Get transaction effect (execution result)
	async getTxEffect(txHash: string): Promise<any> {
		return await this.rpcClient.call("node_getTxEffect", [txHash]);
	}

	// Get pending transactions
	async getPendingTxs(limit?: number, after?: string): Promise<any[]> {
		return await this.rpcClient.call("node_getPendingTxs", [limit, after]);
	}

	// Get pending tx count
	async getPendingTxCount(): Promise<number> {
		return await this.rpcClient.call<number>("node_getPendingTxCount", []);
	}

	// Validate transaction
	async isValidTx(
		tx: any,
		options?: { isSimulation?: boolean; skipFeeEnforcement?: boolean },
	): Promise<any> {
		return await this.rpcClient.call("node_isValidTx", [tx, options]);
	}

	// Simulate public calls
	async simulatePublicCalls(
		tx: any,
		skipFeeEnforcement?: boolean,
	): Promise<any> {
		return await this.rpcClient.call("node_simulatePublicCalls", [
			tx,
			skipFeeEnforcement,
		]);
	}

	// Send transaction
	async sendTx(tx: any): Promise<void> {
		return await this.rpcClient.call("node_sendTx", [tx]);
	}

	getChainId(): number {
		return this.chainId;
	}
}
