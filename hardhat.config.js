import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from 'dotenv';

dotenv.config();

const config: HardhatUserConfig = {
    solidity: "0.8.19",
    defaultNetwork: "mantleSepolia",
    networks: {
        mantle: {
            url: "https://rpc.mantle.xyz",
            accounts: [process.env.ACCOUNT_PRIVATE_KEY ?? ""],
        },
        mantleSepolia: {
            url: "https://rpc.sepolia.mantle.xyz",
            accounts: [process.env.ACCOUNT_PRIVATE_KEY ?? ""],
        },
    },
};

export default config;
