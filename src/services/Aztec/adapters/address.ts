// src/services/EVM/Aztec/adapters/address.ts
import type { Address } from "../../../types";

export class AddressAdapterAztec {
	static fromRawData(
		address: string,
		balance: bigint,
		code: string,
		txCount: number,
		chainId: number,
		contractInstance?: any,
	): Address {
		return {
			address,
			balance: balance.toString(),
			code,
			txCount: txCount.toString(),
			storeageAt: {},
			recentTransactions: [],
			// Add Aztec-specific metadata if contract instance exists
			metadata: contractInstance
				? {
						aztecContract: true,
						contractClassId: contractInstance.contractClassId,
						version: contractInstance.version,
						deployer: contractInstance.deployer,
					}
				: undefined,
		};
	}
}
