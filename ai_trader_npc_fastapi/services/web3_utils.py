import json
from web3 import AsyncWeb3
from web3.eth.async_eth import AsyncEth
from core.config import RPC_URL, CONTRACT_ADDRESS, AI_PRIVATE_KEY, OWNER_ADDRESS

#  AsyncWeb3 instance
w3 = AsyncWeb3(
    AsyncWeb3.AsyncHTTPProvider(RPC_URL),
    modules={"eth": (AsyncEth,)}
)

with open("../abi/AITrader.json") as f:
    CONTRACT_ABI = json.load(f)
async def update_price(item_address, new_price):
    """
    Asynchronously calls updatePrice() on the smart contract.
    """
    try:
        contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=CONTRACT_ABI)
        nonce = await w3.eth.get_transaction_count(OWNER_ADDRESS)

        tx = await contract.functions.updatePrice(item_address, new_price).build_transaction({
            "from": OWNER_ADDRESS,
            "nonce": nonce,
            "gas": 2000000,
            "gasPrice": await w3.eth.gas_price,
        })

        signed_tx = w3.eth.account.sign_transaction(tx, private_key=AI_PRIVATE_KEY)
        tx_hash = await w3.eth.send_raw_transaction(signed_tx.raw_transaction)
        receipt = await w3.eth.wait_for_transaction_receipt(tx_hash)
        details = await get_item_details(item_address)

        print(f"✅ Price updated for {item_address} — Tx: {receipt.transactionHash.hex()}")
        print(f"✅ Item Details :{ details } ")


        return receipt

    except Exception as e:
        print(f"❌ Error updating price for {item_address}: {e}")
        return None


async def get_item_details(item_address):
    """
    Asynchronously fetches item details (price + inventory).
    """
    try:
        contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=CONTRACT_ABI)
        price = await contract.functions.getPrice(item_address).call()
        inventory = await contract.functions.getInventory(item_address).call()
        return {"price": price, "inventory": inventory}
    except Exception as e:
        print(f"❌ Error fetching details for {item_address}: {e}")
        return None
