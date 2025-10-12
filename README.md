# 🧠 AITrader Smart Contract — Somnia Testnet Deployment

## Overview
**AITrader** is a secure, modular smart contract designed for AI-driven item trading in a blockchain-based game or marketplace. It enables users to buy and sell virtual items using the SOMI token, with prices dynamically updated by an AI agent. The contract enforces access control, blacklist protection, and price safeguards to ensure fair and secure trading.

---

## 🔧 Features

- **ERC-20 Token Payments**: Uses SOMI token for all transactions.
- **AI-Controlled Pricing**: Only the designated AI wallet can update item prices.
- **Inventory Management**: Tracks item quantities and prices.
- **Blacklist Enforcement**: Blocks malicious users from trading.
- **Price Safeguards**:
  - Max price change per update (basis points)
  - Minimum time interval between updates
- **Owner Controls**:
  - Set AI wallet
  - Set payment token
  - Withdraw SOMI tokens
  - Manage blacklist
- **Event Logging**: Emits events for all major actions (`ItemBought`, `ItemSold`, `PriceUpdated`, etc.)

---

## 📁 Project Structure

```
NFT_TRADER/
├── src/
│   └── AI_Trader.sol              # Main contract
├── script/
│   └── DeployAI_Trader.s.sol       # Foundry deployment script
├── test/
│   └── AI_Trader.t.sol            # Foundry test suite
├── abi/
│   └── AITrader.json              # ABI (generated after deployment)
├── .env                           # Environment variables
└── README.md                      # This file
```

---

## 🚀 Deployment (Somnia Testnet)

### ✅ Prerequisites
- Foundry installed (`forge`, `cast`)
- `.env` file configured:
  ```env
  PRIVATE_KEY=0xYourRealTestnetPrivateKey
  AI_WALLET=0xYourAIWalletAddress
  SOMI_TOKEN=0x1B0F6590d21dc02B92ad3A7D00F8884dC4f1aed9
  SOMNIA_RPC_URL=https://rpc.somnia.network
  ```

### 🛠 Deploy Command
```bash
forge script script/DeployAITrader.s.sol:DeployAITrader \
  --rpc-url $SOMNIA_RPC_URL \
  --broadcast \
  --private-key $PRIVATE_KEY \
  -vvvv
```

### ✅ Output
- Contract deployed successfully
- SOMI token and AI wallet configured
- Logs saved to `broadcast/` folder

---

## 🧪 Testing

### Framework: Foundry

### Test Contract: `AI_Trader.t.sol`

### Coverage:
- ✅ `buyItem()` — token transfer, inventory reduction
- ✅ `sellItem()` — payout, inventory increase
- ✅ `updatePrice()` — AI-only access, rate limits, max change
- ✅ `setPaymentToken()`, `setAIWallet()`, `setSafeguards()`
- ✅ `addToBlacklist()`, `removeFromBlacklist()`
- ✅ `withdrawTokens()` — owner-only
- ✅ Edge cases: unpriced items, blacklisted users, missing approvals

### Result:
```
Ran 19 tests for AITraderTest
All tests passed ✅
```

---

## 🔌 Integration

### Frontend
- Use `getPrice()`, `getInventory()`, `isPriced()` for UI
- Trigger `buyItem()` and `sellItem()` with SOMI approvals

### AI Agent
- Load ABI and contract address
- Listen for `ItemBought`, `ItemSold` events
- Call `updatePrice()` based on market logic

---

## 📦 ABI Export
```bash
forge inspect AITrader abi > abi/AITrader.json
```

---


