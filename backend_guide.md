# AI Trader Backend Guide

This document provides a complete guide to understanding, configuring, and running the AI Trader backend service.

## Overview

The backend is an AI-powered agent that listens to on-chain trading events and dynamically adjusts item prices based on market activity. It's built using Python with the FastAPI framework and interacts with the blockchain via Web3.py.

## Architecture: A Hybrid Model

The backend consists of two main components:
1.  **FastAPI Web Server:** A lightweight server that provides REST API endpoints for a frontend or admin to interact with.
2.  **Background Event Listener:** A service that runs continuously, listening for `ItemBought` and `ItemSold` events from the `AITrader` smart contract.

### The Hybrid AI Pricing Model

A key architectural feature is the **Hybrid AI Pricing Model**. The goal is to combine the nuanced analysis of an LLM with the speed and predictability of deterministic code.

1.  **AI as an Analyst**: The LLM (`gpt-4o-mini`) is NOT used to directly calculate the price. Its role is to interpret market data (`demand_index`, `supply`) and return a structured JSON object of "market factors" (`demand_factor`, `supply_factor`).
2.  **Deterministic Calculation**: A pure Python function takes these factors and the `base_price` to calculate the final price using a controllable, testable formula.

This separation is critical. The AI provides analysis, and the Python code provides reliable execution.

## How It Works: The Pricing Loop

The core of the backend is an autonomous loop:
1.  **Event Detection:** The event listener detects an `ItemBought` or `ItemSold` event on the blockchain.
2.  **Data Gathering:** It gathers the latest on-chain data for the traded item (current price, inventory) and updates an internal demand signal.
3.  **AI Analysis:** This data is fed to the AI model, which returns its analysis of the market factors.
4.  **Price Calculation:** The deterministic function calculates a new price based on the AI's factors.
5.  **On-Chain Update:** If the price has changed, the backend signs and sends a transaction to the `updatePrice()` function on the smart contract, putting the new AI-generated price on-chain.

## Project Structure

```
ai_trader_npc_fastapi/
├── api/         # Handles incoming HTTP requests (API routes).
├── core/        # Core application logic, including configuration.
├── models/      # Data models (currently unused).
└── services/    # Contains all the business logic.
    ├── ai_pricing.py       # Implements the Hybrid AI model and interacts with OpenAI.
    ├── event_listener.py   # Listens for and handles blockchain events.
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

# AI agent's wallet (used for sending updatePrice transactions)
PRIVATE_KEY="YOUR_AI_AGENT_PRIVATE_KEY"

# OpenAI API
OPENAI_API_KEY="YOUR_OPENAI_API_KEY"

# --- For Testing Only ---
# A separate wallet for simulating buy/sell transactions
USER_PRIVATE_KEY="A_DIFFERENT_PRIVATE_KEY_FOR_TESTING" 
# The address of an item to test with (e.g., a mock ERC20)
TEST_ITEM_ADDRESS="ADDRESS_OF_ITEM_TO_TEST_BUYING"
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
- **Note:** This currently returns a static, hardcoded list.

#### Add a New Item
- **POST** `/api/items/`
- **Description:** Adds a new item to the in-memory list of items. This is for demonstration and does not persist.
- **Body:**
  ```json
  {
    "name": "Magic Staff",
    "symbol": "MSTF",
    "base_price": 200,
    "current_price": 200,
    "rarity": "rare",
    "supply": 25
  }
  ```

#### Get AI Price Prediction (Placeholder)
- **POST** `/api/ai/predict`
- **Description:** **[Placeholder]** This endpoint is intended to test the AI pricing model but is not currently functional. It returns a dummy value.
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

To test the entire system, you need to simulate a trade on your local blockchain. This will trigger the event listener in your running backend.

### Option 1: Using the Test Script (Recommended)

The project includes a script specifically for this purpose.

1.  **Configure your `.env` file:** Make sure `RPC_URL`, `CONTRACT_ADDRESS`, `USER_PRIVATE_KEY`, and `TEST_ITEM_ADDRESS` are set correctly.
2.  **Run the script:** From the `ai_trader_npc_fastapi` directory, run:
    ```bash
    python test_buy_event.py
    ```
This will send a `buyItem` transaction to the contract. Watch the terminal where your FastAPI app is running to see the event being processed, the AI analysis, and the final price update.

### Option 2: Using Foundry's `cast`

If you prefer to use Foundry directly, you can use `cast send`.

**Example: Simulate a `buyItem` event**
```bash
cast send YOUR_CONTRACT_ADDRESS "buyItem(address,uint256)" "YOUR_ITEM_ADDRESS" 1 --rpc-url http://127.0.0.1:8545 --private-key YOUR_TEST_WALLET_PRIVATE_KEY
```