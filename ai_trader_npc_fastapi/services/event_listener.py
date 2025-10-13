import asyncio
import json
from web3 import Web3

from core.config import WSS_RPC_URL, CONTRACT_ADDRESS
from services.ai_pricing import get_ai_price_suggestion
from services.web3_utils import update_price, get_item_details

# In-memory store for demand signals
# A more robust solution would use a database
demand_signals = {}


async def handle_event(event):
    """
    This function is called when a new ItemBought or ItemSold event is detected.
    """
    print(f"New event detected: {event['event']}")

    item_address = event['args']['item']
    event_type = event['event']

    # --- 1. Update Demand Signal ---
    if item_address not in demand_signals:
        demand_signals[item_address] = 5  # Start with a neutral demand index

    if event_type == 'ItemBought':
        demand_signals[item_address] += 1  # Increase demand
    elif event_type == 'ItemSold':
        demand_signals[item_address] -= 1  # Decrease demand

    # Clamp the demand signal between 0 and 10
    demand_signals[item_address] = max(0, min(10, demand_signals[item_address]))
    demand_index = demand_signals[item_address]

    # --- 2. Get Latest On-Chain Data ---
    item_details = get_item_details(item_address)
    if not item_details:
        return

    current_price = item_details['price']
    current_inventory = item_details['inventory']

    # --- 3. Get AI Price Suggestion ---
    # For simplicity, we use the current price as the base price for the AI
    new_price = await get_ai_price_suggestion(
        item_name=item_address,  # Ideally, we'd have a mapping from address to a human-readable name
        base_price=current_price,
        demand_index=demand_index,
        supply=current_inventory
    )

    # --- 4. Update Price On-Chain ---
    if new_price is not None and new_price != current_price:
        print(f"Attempting to update price for {item_address} from {current_price} to {new_price}")
        update_price(item_address, new_price)
    else:
        print(f"No price update needed for {item_address}. AI price: {new_price}, Current price: {current_price}")


async def log_loop(event_filter, poll_interval, handler):
    """
    Continuously polls for new events and calls the handler.
    """
    while True:
        for event in event_filter.get_new_entries():
            await handler(event)
        await asyncio.sleep(poll_interval)


async def start_event_listener():
    """
    Initializes the event listener and starts polling for events.
    """
    print("Starting event listener...")
    w3 = Web3(Web3.LegacyWebSocketProvider(WSS_RPC_URL))

    with open("../abi/AITrader.json") as f:
        contract_abi = json.load(f)
    contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=contract_abi)

    # Create filters for the events we are interested in
    item_bought_filter = contract.events.ItemBought.create_filter(from_block='latest')
    item_sold_filter = contract.events.ItemSold.create_filter(from_block='latest')

    #Start polling loops for each event
    await asyncio.gather(
        log_loop(item_bought_filter, 2, handle_event),
        log_loop(item_sold_filter, 2, handle_event)
    )