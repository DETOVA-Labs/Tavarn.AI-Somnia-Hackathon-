# Tavarn.AI - An AI-Powered Gaming Marketplace

Tavarn.AI is a proof-of-concept decentralized application (dApp) that demonstrates an AI-powered marketplace for in-game assets. The project integrates a Next.js frontend, a FastAPI backend for the AI agent, and Solidity smart contracts to create a dynamic and autonomous trading environment on the blockchain.

## Overview

This project showcases a futuristic game asset marketplace where prices are not static. They evolve based on real-time supply and demand, with an AI agent analyzing market activity and adjusting prices accordingly. This creates a living economy where players can trade assets in a fair and transparent manner.

## Architecture

The project is a monorepo composed of three main components:

### 1. Frontend (`/client`)

A modern, responsive web application built with Next.js and styled with Tailwind CSS. It provides the user interface for players to browse assets, view their dynamic prices, and execute buy/sell orders on the blockchain.

- **Framework:** Next.js 15 (with App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, Radix UI
- **Blockchain Interaction:** wagmi, viem, RainbowKit

### 2. AI Backend (`/ai_trader_npc_fastapi`)

A Python-based backend powered by FastAPI that acts as the "brain" of the marketplace. It listens to on-chain events (like `ItemBought` and `ItemSold`), analyzes market trends, and uses an AI model to suggest new prices.

- **Framework:** FastAPI
- **Language:** Python
- **AI:** Gemini
- **Blockchain Interaction:** Web3.py

### 3. Smart Contracts (`/src`, `/script`, `/test`)

The on-chain logic of the marketplace, built with Solidity and the Foundry framework. The `AITrader.sol` contract governs the inventory, executes trades, and ensures that only the designated AI agent can update prices.

- **Language:** Solidity
- **Framework:** Foundry
- **Key Features:** Secure asset trading, dynamic pricing control, blacklist functionality.

## ✨ Features

- **Dynamic Pricing:** The AI agent analyzes trade volumes to adjust asset prices, reflecting true market value.
- **Decentralized Trading:** All trades are executed on-chain via smart contracts for maximum transparency and security.
- **Real-time Market Insights:** The frontend visualizes price history and market trends.
- **AI-Powered NPC:** The backend simulates a Non-Player Character (NPC) that manages the marketplace autonomously.
- **Secure and Robust:** The smart contract includes safeguards against price manipulation and malicious actors.

## 📁 Project Structure

```
/
├── ai_trader_npc_fastapi/ # Python FastAPI AI Agent
├── client/                # Next.js Frontend Application
├── src/                   # Solidity Smart Contracts
├── script/                # Deployment Scripts for Contracts
├── test/                  # Tests for Smart Contracts
├── abi/                   # Smart Contract ABIs
└── README.md              # This file
```

##  Getting Started

### Prerequisites

- **Node.js** (v20.x or later)
- **Bun** (or `npm`/`yarn`) for the frontend
- **Python** (v3.9 or later) and `pip`
- **Foundry** for smart contract development and deployment

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd Tavarn.AI-Somnia-Hackathon-
    ```

2.  **Install Frontend Dependencies:**
    ```bash
    cd client
    bun install
    cd ..
    ```

3.  **Install Backend Dependencies:**
    ```bash
    cd ai_trader_npc_fastapi
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    pip install -r requirements.txt
    cd ..
    ```

4.  **Install Smart Contract Dependencies:**
    ```bash
    forge install
    ```

##  Running the Application

### 1. Deploy the Smart Contract

You will need a blockchain node (e.g., a local Anvil instance or a public testnet RPC URL) and a funded private key.

1.  Set up your environment variables in a `.env` file in the root directory. See `smartcontract.md` for required variables.
2.  Run the deployment script:
    ```bash
    forge script script/DeployAI_Trader.s.sol:DeployAITrader --rpc-url <your-rpc-url> --broadcast --private-key <your-private-key> -vvvv
    ```
3.  After deployment, copy the contract address and ABI into the frontend and backend configuration.

### 2. Start the AI Backend

1.  Navigate to the backend directory:
    ```bash
    cd ai_trader_npc_fastapi
    ```
2.  Set up the required environment variables for the backend (e.g., `RPC_URL`, `AI_WALLET_PRIVATE_KEY`, `OPENAI_API_KEY`).
3.  Start the FastAPI server:
    ```bash
    uvicorn main:app --reload --port 8000
    ```

### 3. Start the Frontend

1.  Navigate to the frontend directory:
    ```bash
    cd client
    ```
2.  Set up the required environment variables for the frontend (e.g., `NEXT_PUBLIC_CONTRACT_ADDRESS`).
3.  Start the development server:
    ```bash
    npm run dev
    ```
4.  Open your browser and navigate to `http://localhost:3000`.

##  License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
