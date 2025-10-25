import asyncio
import json
from web3 import AsyncWeb3
from web3.eth.async_eth import AsyncEth
from web3.providers.persistent import WebSocketProvider

from core.config import WSS_RPC_URL, CONTRACT_ADDRESS
from services.ai_pricing import get_hybrid_price_suggestion
from services.web3_utils import update_price, get_item_details

# In-memory demand tracker, we could improve this in the future to database
demand_signals = {}


async def handle_event(event):
    """
    Handle new ItemBought or ItemSold event.
    """
    print(f"🔔 New event: {event['event']}")
    item_address = event["args"]["item"]
    event_type = event["event"]

    demand_signals[item_address] = demand_signals.get(item_address, 5)
    if event_type == "ItemBought":
        demand_signals[item_address] += 1
    elif event_type == "ItemSold":
        demand_signals[item_address] -= 1

    demand_signals[item_address] = max(0, min(10, demand_signals[item_address]))
    demand_index = demand_signals[item_address]

    item_details = await get_item_details(item_address)
    if not item_details:
        return

    current_price = item_details["price"]
    current_inventory = item_details["inventory"]

    new_price = await get_hybrid_price_suggestion(
        item_name=item_address,
        base_price=current_price,
        demand_index=demand_index,
        supply=current_inventory,
    )

    if new_price and new_price != current_price:
        print(f"Updating price for {item_address}: {current_price} → {new_price}")
        await update_price(item_address, new_price)
    else:
        print(f"ℹ️ No price change for {item_address}")


async def start_event_listener():
    """
    Listen for ItemBought and ItemSold events using AsyncWeb3 + WebSocketProvider.
    Auto-reconnects on failure.
    """
    print("🚀 Starting event listener...")

    while True:
        try:
            #Create AsyncWeb3 instance with persistent WebSocket provider
            async for w3 in AsyncWeb3(WebSocketProvider(WSS_RPC_URL), modules={"eth": (AsyncEth,)}):
                print("Connected to WebSocket provider!")

                with open("../abi/AITrader.json") as f:
                    contract_abi = json.load(f)

                contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=contract_abi)
                bought_filter = await contract.events.ItemBought.create_filter(from_block="latest")
                sold_filter = await contract.events.ItemSold.create_filter(from_block="latest")
                print("Event filters created.")
                while True:
                    for event in await bought_filter.get_new_entries():
                        await handle_event(event)
                    for event in await sold_filter.get_new_entries():
                        await handle_event(event)
                    await asyncio.sleep(3)
        except Exception as e:
            print(f"WebSocket connection error: {e}. Retrying in 5s...")
            await asyncio.sleep(5)
