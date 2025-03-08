// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../contracts/MantleSwap.sol";

contract DeployMantleSwap is Script {
    function run() external {
        // Retrieve the private key from environment
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);

        // Deploy MantleSwap contract
        MantleSwap mantleSwap = new MantleSwap();
        
        // End broadcasting transactions
        vm.stopBroadcast();

        // Log the deployed contract address
        console.log("MantleSwap deployed to:", address(mantleSwap));
    }
}
