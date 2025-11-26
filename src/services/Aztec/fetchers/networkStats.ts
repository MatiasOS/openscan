// src/services/EVM/Aztec/fetchers/networkStats.ts
import { RPCClient } from "../../common/RPCClient";
import type { NetworkStats } from "../../../types";

export class NetworkStatsFetcherAztec {
	constructor(
		private rpcClient: RPCClient,
		private chainId: number,
	) {}

	async getNetworkStats(): Promise<NetworkStats> {
		const [blockNumber, gasFees, nodeInfo, syncStatus, pendingTxCount] =
			await Promise.all([
				this.rpcClient.call<number>("node_getBlockNumber", []),
				this.rpcClient
					.call<any>("node_getCurrentBaseFees", [])
					.catch(() => ({ feePerDaGas: "0", feePerL2Gas: "0" })),
				this.rpcClient.call<any>("node_getNodeInfo", []).catch(() => null),
				this.rpcClient
					.call<any>("node_getWorldStateSyncStatus", [])
					.catch(() => ({ isSyncing: false })),
				this.rpcClient.call<number>("node_getPendingTxCount", []).catch(() => 0),
			]);

		return {
			currentBlockNumber: blockNumber.toString(),
			currentGasPrice: gasFees.feePerL2Gas || "0",
			isSyncing: syncStatus.isSyncing || false,
			metadata: {
				aztecSpecific: true,
				nodeVersion: nodeInfo?.nodeVersion,
				protocolVersion: nodeInfo?.protocolVersion,
				pendingTransactions: pendingTxCount,
				baseFees: gasFees,
				l1ContractAddresses: nodeInfo?.l1ContractAddresses,
			},
		};
	}

	getChainId(): number {
		return this.chainId;
	}
}
