# AI Trader Backend Guide

This document provides a complete guide to understanding, configuring, and running the AI Trader backend service.

## Overview

The backend is an AI-powered agent that listens to on-chain trading events and dynamically adjusts item prices based on market activity. It's built using Python with the FastAPI framework and interacts with the blockchain via Web3.py.

## Architecture

The backend consists of two main components:
1.  **FastAPI Web Server:** A lightweight server that provides REST API endpoints for a frontend or admin to interact with (e.g., to get a list of items).
2.  **Background Event Listener:** A service that runs continuously in the background, listening for `ItemBought` and `ItemSold` events from the `AITrader` smart contract.

## How It Works: The Pricing Loop

The core of the backend is an autonomous loop:
1.  **Event Detection:** The event listener detects a `buyItem` or `sellItem` transaction on the blockchain.
2.  **Data Gathering:** It gathers the latest on-chain data for the traded item (current price, inventory) and updates an internal demand signal.
3.  **AI Decision:** This data is fed to an AI model (GPT-4o-mini), which suggests a new, fair market price.
4.  **On-Chain Update:** The backend signs and sends a transaction to the `updatePrice()` function on the smart contract, putting the new AI-generated price on-chain.

## Project Structure

```
ai_trader_npc_fastapi/
├── api/         # Handles incoming HTTP requests (API routes).
├── core/        # Core application logic, including configuration.
├── models/      # Data models (currently unused, for future database integration).
└── services/    # Contains all the business logic.
    ├── ai_pricing.py       # Interacts with the OpenAI API.
    ├── event_listener.py   # Listens for blockchain events.
    └── web3_utils.py       # Interacts with the smart contract.
```

## Configuration

Before running the server, you must create a `.env` file in the root of the project.

```
# .env file

# Blockchain connection
RPC_URL="YOUR_HTTP_RPC_URL"
WSS_RPC_URL="YOUR_WEBSOCKET_RPC_URL"
CONTRACT_ADDRESS="YOUR_AITRADER_CONTRACT_ADDRESS"

# AI agent's wallet
PRIVATE_KEY="YOUR_AI_AGENT_PRIVATE_KEY"

# OpenAI API
OPENAI_API_KEY="YOUR_OPENAI_API_KEY"
```
*For local testing with Anvil, your RPC URLs will be `http://127.0.0.1:8545` and `ws://127.0.0.1:8545`.*

## How to Run

1.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
    *(Ensure `fastapi`, `uvicorn`, `web3`, `python-dotenv`, `openai`, and `eth-account` are in the file).*

2.  **Start the server:**
    Navigate to the `ai_trader_npc_fastapi` directory and run:
    ```bash
    cd ai_trader_npc_fastapi
    uvicorn main:app --reload
    ```
    The server will start, and the event listener will begin running in the background.

## API Endpoints

The backend provides the following endpoints:

#### Get All Items
- **GET** `/api/items/`
- **Description:** Returns a list of all items available in the market.
- **Note:** This currently returns a static list. For production, it should be modified to fetch data directly from the smart contract.

#### Get AI Price Prediction
- **POST** `/api/ai/predict`
- **Description:** Allows you to test the AI pricing model by providing hypothetical market data.
- **Body:**
  ```json
  {
      "item_name": "Test Item",
      "base_price": 100,
      "demand_index": 7,
      "supply": 50
  }
  ```

## Testing the Event Loop

To test the entire system, you can simulate a trade on your local blockchain using Foundry's `cast` tool. This will trigger the event listener in your running backend.

**Example: Simulate a `buyItem` event**
```bash
cast send YOUR_CONTRACT_ADDRESS "buyItem(address,uint256)" "YOUR_ITEM_ADDRESS" 1 --rpc-url http://127.0.0.1:8545 --private-key YOUR_TEST_WALLET_PRIVATE_KEY
```
Watch the terminal where your FastAPI app is running to see the event being processed.
