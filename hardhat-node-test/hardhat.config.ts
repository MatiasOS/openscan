import hardhatToolboxViemPlugin from "@nomicfoundation/hardhat-toolbox-viem";
import { configVariable, defineConfig } from "hardhat/config";
import { localhost } from "viem/chains";

console.log(localhost);

export default defineConfig({
	plugins: [hardhatToolboxViemPlugin],
	solidity: {
		profiles: {
			default: {
				version: "0.8.28",
			},
			production: {
				version: "0.8.28",
				settings: {
					optimizer: {
						enabled: true,
						runs: 200,
					},
				},
			},
		},
	},
	networks: {
		localhost: {
			...localhost,
			type: "edr-simulated",
			chainType: "l1",
		},
		intervalMined: {
			type: "edr-simulated",
			mining: {
				auto: false, // disable automining
				interval: [3000, 6000], // mine blocks at random intervals between 3-6 seconds
			},
		},
		hardhatMainnet: {
			type: "edr-simulated",
			chainType: "l1",
		},
		mainnetFork: {
			type: "edr-simulated",
			forking: {
				url: "https://mainnet.infura.io/v3/a24572a24c2e4312a76c1e4212973fef",
			},
		},
		hardhatOp: {
			type: "edr-simulated",
			chainType: "op",
		},
		sepolia: {
			type: "http",
			chainType: "l1",
			url: configVariable("SEPOLIA_RPC_URL"),
			accounts: [configVariable("SEPOLIA_PRIVATE_KEY")],
		},
	},
});
