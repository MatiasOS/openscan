import { network } from "hardhat";
import { parseEther, formatEther, encodeFunctionData } from "viem";

/**
 * This script deploys all contracts and generates mainnet-like transactions:
 * - ERC20 transfers, approvals, mints, burns
 * - NFT mints and transfers
 * - DEX swaps with liquidity
 * - Vault deposits/withdrawals
 * - Failed transactions (insufficient balance, reverts, etc.)
 */

async function main() {
	console.log("🚀 Starting mainnet-like transaction generator...\n");

	const { viem } = await network.connect();
	const [deployer, user1, user2, user3, user4] = await viem.getWalletClients();
	const publicClient = await viem.getPublicClient();

	console.log("📍 Accounts:");
	console.log(`  Deployer: ${deployer.account.address}`);
	console.log(`  User1: ${user1.account.address}`);
	console.log(`  User2: ${user2.account.address}`);
	console.log(`  User3: ${user3.account.address}`);
	console.log(`  User4: ${user4.account.address}\n`);

	// ========== DEPLOY CONTRACTS ==========
	console.log("📦 Deploying contracts...\n");

	// Deploy Token A
	const tokenA = await viem.deployContract("TestToken", [
		"Token Alpha",
		"ALPHA",
		parseEther("1000000"),
	]);
	console.log(`  ✅ Token A (ALPHA): ${tokenA.address}`);

	// Deploy Token B
	const tokenB = await viem.deployContract("TestToken", [
		"Token Beta",
		"BETA",
		parseEther("1000000"),
	]);
	console.log(`  ✅ Token B (BETA): ${tokenB.address}`);

	// Deploy Stable Token
	const stableToken = await viem.deployContract("TestToken", [
		"USD Tether",
		"USDT",
		parseEther("10000000"),
	]);
	console.log(`  ✅ Stable Token (USDT): ${stableToken.address}`);

	// Deploy NFT
	const testNFT = await viem.deployContract("TestNFT", [
		"CryptoPunks Clone",
		"PUNK",
		"https://api.punks.example/metadata/",
	]);
	console.log(`  ✅ NFT (PUNK): ${testNFT.address}`);

	// Deploy SimpleSwap
	const simpleSwap = await viem.deployContract("SimpleSwap", [
		tokenA.address,
		tokenB.address,
	]);
	console.log(`  ✅ SimpleSwap: ${simpleSwap.address}`);

	// Deploy Vault
	const vault = await viem.deployContract("Vault", [
		stableToken.address,
		parseEther("100"), // minDeposit
		parseEther("10000"), // maxDeposit
		50n, // 0.5% fee
		0n, // no lock for testing
	]);
	console.log(`  ✅ Vault: ${vault.address}`);

	// Deploy Multicall
	const multicall = await viem.deployContract("Multicall", []);
	console.log(`  ✅ Multicall: ${multicall.address}`);

	// Deploy Counter
	const counter = await viem.deployContract("Counter", []);
	console.log(`  ✅ Counter: ${counter.address}`);

	console.log("\n========================================\n");

	// ========== ERC20 TRANSACTIONS ==========
	console.log("💰 Generating ERC20 transactions...\n");

	// Distribute tokens to users
	console.log("  Distributing tokens to users...");
	await tokenA.write.transfer([user1.account.address, parseEther("50000")]);
	await tokenA.write.transfer([user2.account.address, parseEther("30000")]);
	await tokenA.write.transfer([user3.account.address, parseEther("20000")]);

	await tokenB.write.transfer([user1.account.address, parseEther("40000")]);
	await tokenB.write.transfer([user2.account.address, parseEther("35000")]);
	await tokenB.write.transfer([user4.account.address, parseEther("25000")]);

	await stableToken.write.transfer([
		user1.account.address,
		parseEther("100000"),
	]);
	await stableToken.write.transfer([
		user2.account.address,
		parseEther("80000"),
	]);
	await stableToken.write.transfer([
		user3.account.address,
		parseEther("60000"),
	]);
	await stableToken.write.transfer([
		user4.account.address,
		parseEther("40000"),
	]);

	// User transfers
	console.log("  User-to-user transfers...");
	const tokenAUser1 = await viem.getContractAt("TestToken", tokenA.address, {
		client: { wallet: user1 },
	});
	const tokenAUser2 = await viem.getContractAt("TestToken", tokenA.address, {
		client: { wallet: user2 },
	});
	const tokenBUser1 = await viem.getContractAt("TestToken", tokenB.address, {
		client: { wallet: user1 },
	});

	await tokenAUser1.write.transfer([user2.account.address, parseEther("5000")]);
	await tokenAUser2.write.transfer([user3.account.address, parseEther("2500")]);
	await tokenBUser1.write.transfer([user3.account.address, parseEther("1000")]);

	// Approvals
	console.log("  Setting approvals...");
	await tokenAUser1.write.approve([simpleSwap.address, parseEther("100000")]);
	await tokenAUser2.write.approve([simpleSwap.address, parseEther("100000")]);
	await tokenBUser1.write.approve([simpleSwap.address, parseEther("100000")]);

	const stableUser1 = await viem.getContractAt(
		"TestToken",
		stableToken.address,
		{ client: { wallet: user1 } },
	);
	const stableUser2 = await viem.getContractAt(
		"TestToken",
		stableToken.address,
		{ client: { wallet: user2 } },
	);
	await stableUser1.write.approve([vault.address, parseEther("1000000")]);
	await stableUser2.write.approve([vault.address, parseEther("1000000")]);

	// Mint more tokens
	console.log("  Minting additional tokens...");
	await tokenA.write.mint([user4.account.address, parseEther("15000")]);
	await tokenB.write.mint([user4.account.address, parseEther("12000")]);

	// Burn tokens
	console.log("  Burning tokens...");
	const tokenAUser3 = await viem.getContractAt("TestToken", tokenA.address, {
		client: { wallet: user3 },
	});
	await tokenAUser3.write.burn([parseEther("500")]);

	console.log("  ✅ ERC20 transactions complete\n");

	// ========== NFT TRANSACTIONS ==========
	console.log("🖼️  Generating NFT transactions...\n");

	// Mint NFTs to different users
	console.log("  Minting NFTs...");
	await testNFT.write.mint([deployer.account.address]); // Token 0
	await testNFT.write.mint([user1.account.address]); // Token 1
	await testNFT.write.mint([user1.account.address]); // Token 2
	await testNFT.write.mint([user2.account.address]); // Token 3
	await testNFT.write.mintWithURI([
		user3.account.address,
		"ipfs://QmSpecialNFT",
	]); // Token 4

	// Batch mint
	console.log("  Batch minting NFTs...");
	await testNFT.write.batchMint([user4.account.address, 5n]); // Tokens 5-9

	// NFT transfers
	console.log("  Transferring NFTs...");
	const nftUser1 = await viem.getContractAt("TestNFT", testNFT.address, {
		client: { wallet: user1 },
	});
	await nftUser1.write.transferFrom([
		user1.account.address,
		user2.account.address,
		1n,
	]);

	// NFT approvals
	console.log("  Setting NFT approvals...");
	await nftUser1.write.approve([user3.account.address, 2n]);
	await nftUser1.write.setApprovalForAll([user4.account.address, true]);

	// Burn NFT
	console.log("  Burning NFT...");
	const nftUser4 = await viem.getContractAt("TestNFT", testNFT.address, {
		client: { wallet: user4 },
	});
	await nftUser4.write.burn([9n]);

	console.log("  ✅ NFT transactions complete\n");

	// ========== DEX TRANSACTIONS ==========
	console.log("🔄 Generating DEX transactions...\n");

	// Add liquidity (deployer)
	console.log("  Adding initial liquidity...");
	await tokenA.write.approve([simpleSwap.address, parseEther("100000")]);
	await tokenB.write.approve([simpleSwap.address, parseEther("100000")]);
	await simpleSwap.write.addLiquidity([
		parseEther("50000"),
		parseEther("50000"),
	]);

	// Swaps
	console.log("  Executing swaps...");
	const swapUser1 = await viem.getContractAt("SimpleSwap", simpleSwap.address, {
		client: { wallet: user1 },
	});
	const swapUser2 = await viem.getContractAt("SimpleSwap", simpleSwap.address, {
		client: { wallet: user2 },
	});

	// User1 swaps A for B
	await swapUser1.write.swapAForB([parseEther("1000"), parseEther("900")]);

	// User2 swaps A for B
	await swapUser2.write.swapAForB([parseEther("500"), parseEther("400")]);

	// User1 swaps B for A
	const tokenBUser1Again = await viem.getContractAt(
		"TestToken",
		tokenB.address,
		{ client: { wallet: user1 } },
	);
	await tokenBUser1Again.write.approve([
		simpleSwap.address,
		parseEther("100000"),
	]);
	await swapUser1.write.swapBForA([parseEther("2000"), parseEther("1800")]);

	// More liquidity
	console.log("  Adding more liquidity...");
	const tokenAUser1Again = await viem.getContractAt(
		"TestToken",
		tokenA.address,
		{ client: { wallet: user1 } },
	);
	const tokenBUser2 = await viem.getContractAt("TestToken", tokenB.address, {
		client: { wallet: user2 },
	});
	await tokenAUser1Again.write.approve([
		simpleSwap.address,
		parseEther("100000"),
	]);
	await tokenBUser1Again.write.approve([
		simpleSwap.address,
		parseEther("100000"),
	]);
	await swapUser1.write.addLiquidity([
		parseEther("10000"),
		parseEther("10000"),
	]);

	console.log("  ✅ DEX transactions complete\n");

	// ========== VAULT TRANSACTIONS ==========
	console.log("🏦 Generating Vault transactions...\n");

	// Deposits
	console.log("  Making deposits...");
	const vaultUser1 = await viem.getContractAt("Vault", vault.address, {
		client: { wallet: user1 },
	});
	const vaultUser2 = await viem.getContractAt("Vault", vault.address, {
		client: { wallet: user2 },
	});

	await vaultUser1.write.deposit([parseEther("5000")]);
	await vaultUser2.write.deposit([parseEther("3000")]);
	await vaultUser1.write.deposit([parseEther("2000")]); // Additional deposit

	// Withdrawals
	console.log("  Making withdrawals...");
	await vaultUser1.write.withdraw([parseEther("1000")]);
	await vaultUser2.write.withdrawAll();

	// Admin actions
	console.log("  Admin actions...");
	await vault.write.collectFees([deployer.account.address]);

	console.log("  ✅ Vault transactions complete\n");

	// ========== COUNTER TRANSACTIONS ==========
	console.log("🔢 Generating Counter transactions...\n");

	await counter.write.inc();
	await counter.write.inc();
	await counter.write.incBy([5n]);
	await counter.write.incBy([10n]);

	console.log("  ✅ Counter transactions complete\n");

	// ========== MULTICALL TRANSACTIONS ==========
	console.log("📦 Generating Multicall transactions...\n");

	// Batch read calls
	const calls = [
		{
			target: tokenA.address,
			callData: encodeFunctionData({
				abi: tokenA.abi,
				functionName: "balanceOf",
				args: [user1.account.address],
			}),
		},
		{
			target: tokenB.address,
			callData: encodeFunctionData({
				abi: tokenB.abi,
				functionName: "balanceOf",
				args: [user1.account.address],
			}),
		},
		{
			target: counter.address,
			callData: encodeFunctionData({
				abi: counter.abi,
				functionName: "x",
				args: [],
			}),
		},
	];

	await multicall.write.aggregate([calls]);

	console.log("  ✅ Multicall transactions complete\n");

	// ========== FAILED TRANSACTIONS ==========
	console.log("❌ Generating failed transactions...\n");

	// Insufficient balance transfer
	console.log("  Attempting insufficient balance transfer...");
	try {
		const tokenAUser4 = await viem.getContractAt("TestToken", tokenA.address, {
			client: { wallet: user4 },
		});
		await tokenAUser4.write.transfer([
			user1.account.address,
			parseEther("999999999"),
		]);
	} catch (e: any) {
		console.log(`    ✅ Failed as expected: insufficient balance`);
	}

	// Transfer to zero address
	console.log("  Attempting transfer to zero address...");
	try {
		await tokenAUser1.write.transfer([
			"0x0000000000000000000000000000000000000000",
			parseEther("100"),
		]);
	} catch (e: any) {
		console.log(`    ✅ Failed as expected: zero address`);
	}

	// Vault deposit below minimum
	console.log("  Attempting vault deposit below minimum...");
	try {
		const stableUser3 = await viem.getContractAt(
			"TestToken",
			stableToken.address,
			{ client: { wallet: user3 } },
		);
		await stableUser3.write.approve([vault.address, parseEther("1000000")]);
		const vaultUser3 = await viem.getContractAt("Vault", vault.address, {
			client: { wallet: user3 },
		});
		await vaultUser3.write.deposit([parseEther("10")]); // Below 100 minimum
	} catch (e: any) {
		console.log(`    ✅ Failed as expected: below minimum deposit`);
	}

	// Vault deposit above maximum
	console.log("  Attempting vault deposit above maximum...");
	try {
		await vaultUser1.write.deposit([parseEther("50000")]); // Above 10000 maximum
	} catch (e: any) {
		console.log(`    ✅ Failed as expected: above maximum deposit`);
	}

	// Swap with high slippage (minAmountOut too high)
	console.log("  Attempting swap with high slippage requirement...");
	try {
		await swapUser1.write.swapAForB([parseEther("100"), parseEther("9999")]); // Impossible output
	} catch (e: any) {
		console.log(`    ✅ Failed as expected: insufficient output amount`);
	}

	// Counter incBy with zero
	console.log("  Attempting counter incBy with zero...");
	try {
		await counter.write.incBy([0n]);
	} catch (e: any) {
		console.log(`    ✅ Failed as expected: increment should be positive`);
	}

	// Withdraw more than deposited
	console.log("  Attempting to withdraw more than deposited...");
	try {
		await vaultUser1.write.withdraw([parseEther("999999")]);
	} catch (e: any) {
		console.log(`    ✅ Failed as expected: insufficient balance`);
	}

	// NFT transfer of non-owned token
	console.log("  Attempting NFT transfer of non-owned token...");
	try {
		await nftUser1.write.transferFrom([
			user1.account.address,
			user2.account.address,
			0n,
		]); // Token 0 is owned by deployer
	} catch (e: any) {
		console.log(`    ✅ Failed as expected: not owner nor approved`);
	}

	console.log("\n  ✅ Failed transaction tests complete\n");

	// ========== ETH TRANSFERS ==========
	console.log("💸 Generating ETH transfers...\n");

	// Send ETH between accounts
	await deployer.sendTransaction({
		to: user1.account.address,
		value: parseEther("10"),
	});

	await user1.sendTransaction({
		to: user2.account.address,
		value: parseEther("2"),
	});

	await user2.sendTransaction({
		to: user3.account.address,
		value: parseEther("0.5"),
	});

	// Send ETH to contracts
	await deployer.sendTransaction({
		to: multicall.address,
		value: parseEther("1"),
	});

	console.log("  ✅ ETH transfers complete\n");

	// ========== SUMMARY ==========
	console.log("========================================");
	console.log("📊 DEPLOYMENT SUMMARY");
	console.log("========================================\n");

	console.log("Contracts deployed:");
	console.log(`  Token A (ALPHA):  ${tokenA.address}`);
	console.log(`  Token B (BETA):   ${tokenB.address}`);
	console.log(`  Stable (USDT):    ${stableToken.address}`);
	console.log(`  NFT (PUNK):       ${testNFT.address}`);
	console.log(`  SimpleSwap:       ${simpleSwap.address}`);
	console.log(`  Vault:            ${vault.address}`);
	console.log(`  Multicall:        ${multicall.address}`);
	console.log(`  Counter:          ${counter.address}`);

	const blockNumber = await publicClient.getBlockNumber();
	console.log(`\n📦 Current block number: ${blockNumber}`);

	// Get some stats
	const counterValue = await counter.read.x();
	const nftSupply = await testNFT.read.totalSupply();
	const [reserveA, reserveB] = await simpleSwap.read.getReserves();
	const vaultDeposits = await vault.read.totalDeposits();

	console.log(`\n📈 Contract states:`);
	console.log(`  Counter value: ${counterValue}`);
	console.log(`  NFT total supply: ${nftSupply}`);
	console.log(
		`  SimpleSwap reserves: ${formatEther(reserveA)} ALPHA / ${formatEther(reserveB)} BETA`,
	);
	console.log(`  Vault total deposits: ${formatEther(vaultDeposits)} USDT`);

	console.log("\n✨ All transactions generated successfully!");
	console.log("You can now explore these transactions in OpenScan.\n");
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
