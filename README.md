# MantleOrbiter

![chainorbiter-banner](https://i.ibb.co/dsz8zZH5/Mantle-orbiter-3.png)

## Table of Contents

- [Overview](#overview)
- [Integrations](#integrations)
  - [Mantle Network](#mantle-network)
  - [INIT Capital](#init-capital)
  - [Lendle](#lendle)
  - [Agni Finance](#agni-finance)
- [Features](#features)
- [Run](#run)


## Overview
MantleOrbiter is a comprehensive DeFi management platform built specifically for the Mantle ecosystem. It provides a unified interface for interacting with major DeFi protocols on Mantle Network, DeFi interactions, enhanced market intelligence, and offers seamless integration for lending, borrowing, liquidity provision, and cross-chain bridging functionalities. 

MantleOrbiter empowers users to maximize their yield and efficiently manage their assets across the Mantle ecosystem without the complexity of navigating multiple dApps. With dedicated modules for each protocol integration, users can execute complex DeFi strategies with ease and confidence.

## Integrations

### Mantle Network
MantleOrbiter is built on top of the Mantle Network, providing a streamlined experience for users to interact with various DeFi protocols in the Mantle ecosystem. The application leverages Mantle's high throughput and low transaction costs to deliver a responsive and cost-effective user experience.

Key Mantle Network features in MantleOrbiter:
- **Network Configuration**: Seamless connection to Mantle Testnet (ChainID: 5001) and Mantle Sepolia
- **Cross-Chain Bridge**: Facilitates token transfers between Ethereum (L1) and Mantle Network (L2) using mantleSDK
- **Native MNT Support**: Full support for MNT and WMNT token operations
- **Token Transfers & Swaps**: Streamlined interface for token swaps and transfers within the Mantle ecosystem

Implementation details:

- [Mantle Network Integration](https://github.com/Abraham12611/MantleOrbiter/blob/main/client/src/services/mantle.ts)

- [Wallet Connection](https://github.com/Abraham12611/MantleOrbiter/blob/main/client/src/hooks/use-wallet.ts)

- [Bridge Interface](https://github.com/Abraham12611/MantleOrbiter/blob/main/client/src/components/bridge/Bridge.tsx)

- [Web3 Provider](https://github.com/Abraham12611/MantleOrbiter/blob/main/client/src/lib/web3.ts)

- [Mantle Network SDK](https://github.com/Abraham12611/MantleOrbiter/blob/main/client/src/services/mantle.ts)

### INIT Capital
MantleOrbiter integrates deeply with INIT Capital, a leading lending and borrowing protocol on Mantle. Users can create lending positions, manage collateral, borrow against their deposits, and track APY rates across different lending pools.

Key INIT Capital features:
- **Position Management**: Create and manage lending positions with various assets
- **Collateral Operations**: Add or remove collateral from existing positions
- **Borrowing & Repayment**: Borrow against collateral and repay loans
- **APY Tracking**: Monitor current APY rates across supported lending pools

Supported INIT Capital lending pools:
- USDC: 0x00A55649E597d463fD212fBE48a3B40f0E227d06
- WMNT: 0x44949636f778fAD2b139E665aee11a2dc84A2976
- WETH: 0x51AB74f8B03F0305d8dcE936B473AB587911AEC4
- USDT: 0xadA66a8722B5cdfe3bC504007A5d793e7100ad09

Implementation details:

- [INIT Capital Integration](https://github.com/Abraham12611/MantleOrbiter/blob/main/client/src/services/init-capital.ts)

- [Lending Position Management](https://github.com/Abraham12611/MantleOrbiter/blob/main/client/src/components/lending/LendingPosition.tsx)

- [Collateral Operations](https://github.com/Abraham12611/MantleOrbiter/blob/main/client/src/components/lending/Collateral.tsx)

### Lendle
MantleOrbiter provides a streamlined interface for interacting with Lendle, another prominent lending protocol in the Mantle ecosystem. Users can supply assets to earn interest, borrow against their deposits, and manage their lending positions through an intuitive dashboard.

Key Lendle features:
- **Asset Supply**: Deposit assets to earn yield
- **Asset Borrowing**: Borrow assets using existing deposits as collateral
- **Position Tracking**: Monitor borrowed and supplied amounts
- **Interest Rate Monitoring**: Track current interest rates for different assets

Supported Lendle assets:
- USDC
- MNT

Implementation details:

- [Lendle Integration](https://github.com/Abraham12611/MantleOrbiter/blob/main/client/src/services/lendle.ts)

- [Lending Position Management](https://github.com/Abraham12611/MantleOrbiter/blob/main/client/src/components/lending/LendingPosition.tsx)

- [Collateral Operations](https://github.com/Abraham12611/MantleOrbiter/blob/main/client/src/components/lending/Collateral.tsx)

### Agni Finance
MantleOrbiter integrates with Agni Finance, a decentralized exchange on Mantle that enables users to provide liquidity and earn fees. The application offers a simplified interface for adding and removing liquidity to Agni pools.

Key Agni Finance features:
- **Liquidity Provision**: Add liquidity to various token pairs
- **Liquidity Removal**: Remove liquidity and claim rewards
- **Pool APR Tracking**: Monitor current APR rates for different pools

Supported Agni Finance pools:
- MNT-USDC

Implementation details:

- [Agni Finance Integration](https://github.com/Abraham12611/MantleOrbiter/blob/main/client/src/services/agni.ts)

- [Liquidity Provisioning](https://github.com/Abraham12611/MantleOrbiter/blob/main/client/src/components/liquidity/Liquidity.tsx)


## Features

### Cross-Chain Bridge
MantleOrbiter includes a comprehensive bridge interface that enables seamless transfers between Ethereum (L1) and Mantle Network (L2). Users can deposit and withdraw both MNT and WMNT tokens with a simple and intuitive UI.

The bridge leverages Mantle's official SDK to ensure secure and reliable cross-chain transactions.

### Protocol Dashboard
The centralized dashboard provides a unified view of all supported protocols, organized into intuitive categories:
- **Yield Vaults**: Circuit Protocol vaults for optimized yield generation
- **Lending**: INIT Capital and Lendle lending services
- **Liquidity Pools**: Agni Finance liquidity provision

### Wallet Integration
MantleOrbiter features a non-custodial wallet integration that allows users to connect their existing wallets or create new ones within the application. The wallet interface provides:
- **Balance Tracking**: Monitor asset balances across all integrated protocols
- **Transaction History**: View past transactions and their status

### Asset Management
The asset management interface provides a comprehensive overview of:
- **Total Value Locked**: Track total value across all protocols
- **Lending Positions**: Monitor collateral and borrowed amounts
- **Yield Opportunities**: Compare APY/APR rates across different protocols

## Run

To run MantleOrbiter locally, you need the following environment variables:
```
# .env.local
NEXT_PUBLIC_INFURA_ID=
NEXT_PUBLIC_ALCHEMY_ID=
MANTLE_RPC_URL=https://rpc.testnet.mantle.xyz
ETHERSCAN_API_KEY=
MANTLESCAN_API_KEY=
```

### Setup Steps
```bash
# STEP 1: Install dependencies
npm install

# STEP 2: Run the development server
npm run dev

# STEP 3: Build for production
npm run build
npm start
```

### Required Configuration
- Ethereum provider (Infura or Alchemy)
- Mantle Network RPC endpoint
- Web3 wallet (MetaMask or similar)

For developers looking to extend MantleOrbiter, the modular structure makes it easy to add new protocol integrations or enhance existing ones.
