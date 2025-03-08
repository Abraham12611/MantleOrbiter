.PHONY: deploy-mantle-sepolia

# Deploy to Mantle Sepolia testnet
deploy-mantle-sepolia:
	forge script script/DeployMantleSwap.s.sol:DeployMantleSwap \
		--rpc-url https://rpc.sepolia.mantle.xyz \
		--broadcast \
		--verify \
		-vvvv
