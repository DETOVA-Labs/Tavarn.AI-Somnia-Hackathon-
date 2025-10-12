// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import {AITrader} from "../src/AI_Trader.sol";

contract DeployAITrader is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        address aiWallet = vm.envAddress("AI_WALLET");

        // Deploy contract
        AITrader trader = new AITrader(aiWallet);

        address somiToken = vm.envAddress("SOMI_TOKEN");
        trader.setPaymentToken(somiToken);

        vm.stopBroadcast();

        console2.log("AITrader deployed at:", address(trader));
        console2.log("AI Wallet:", aiWallet);
        console2.log("SOMI Token:", somiToken);
    }
}