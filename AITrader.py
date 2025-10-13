import os
import json
import time
from dotenv import load_dotenv
from web3 import Web3
from web3.middleware.geth_poa import geth_poa_middleware

# Load environment variables
load_dotenv()
PRIVATE_KEY = os.getenv("PRIVATE_KEY")
RPC_URL = os.getenv("RPC_URL")
CONTRACT_ADDRESS = os.getenv("CONTRACT_ADDRESS")

# Connect to Somnia testnet
w3 = Web3(Web3.HTTPProvider(RPC_URL))
w3.middleware_onion.inject(geth_poa_middleware, layer=0)

account = w3.eth.account.from_key(PRIVATE_KEY)
print(f"Connected as AI wallet: {account.address}")

# Load ABI
with open("abi/AITrader.json") as f:
    abi = json.load(f)

contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=abi)

# Sample item addresses (replace with real ones)
ITEMS = {
    "itemA": "0x00000000000000000000000000000000000A11cE",
    "itemB": "0x0000000000000000000000000000000000000B0b"
}

# --- Price update logic ---
def update_price(item_address: str, new_price_wei: int):
    nonce = w3.eth.get_transaction_count(account.address)
    tx = contract.functions.updatePrice(item_address, new_price_wei).build_transaction({
        'from': account.address,
        'nonce': nonce,
        'gas': 200000,
        'gasPrice': w3.eth.gas_price
    })
    signed_tx = account.sign_transaction(tx)
    tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
    print(f"[TX] updatePrice({item_address}, {new_price_wei}) → {tx_hash.hex()}")
    return tx_hash

# --- Event listener ---
def listen_to_events(poll_interval=10):
    print("Listening for ItemBought and ItemSold events...")
    bought_filter = contract.events.ItemBought.create_filter(fromBlock='latest')
    sold_filter = contract.events.ItemSold.create_filter(fromBlock='latest')

    while True:
        for event in bought_filter.get_new_entries():
            print(f"[EVENT] ItemBought → buyer: {event['args']['buyer']}, item: {event['args']['item']}, qty: {event['args']['qty']}")

        for event in sold_filter.get_new_entries():
            print(f"[EVENT] ItemSold → seller: {event['args']['seller']}, item: {event['args']['item']}, qty: {event['args']['qty']}")

        time.sleep(poll_interval)

# --- Simulated AI pricing strategy ---
def simulate_ai_loop():
    print("Starting AI pricing loop...")
    while True:
        for name, item in ITEMS.items():
            try:
                current_price = contract.functions.getPrice(item).call()
                new_price = int(current_price * 1.05)  # simulate 5% increase
                print(f"[AI] {name} → current: {current_price}, new: {new_price}")
                update_price(item, new_price)
            except Exception as e:
                print(f"[ERROR] Failed to update price for {name}: {e}")
        time.sleep(60)  # wait 1 minute between updates

# --- Entry point ---
if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="AI Agent for AITrader")
    parser.add_argument("--mode", choices=["update", "listen", "loop"], default="loop", help="Mode: update once, listen for events, or loop pricing")
    args = parser.parse_args()

    if args.mode == "update":
        for name, item in ITEMS.items():
            current = contract.functions.getPrice(item).call()
            new_price = int(current * 1.05)
            update_price(item, new_price)

    elif args.mode == "listen":
        listen_to_events()

    elif args.mode == "loop":
        simulate_ai_loop()