
import json
from web3 import Web3
from core.config import RPC_URL, CONTRACT_ADDRESS, PRIVATE_KEY, OWNER_ADDRESS

# Connect to the blockchain
w3 = Web3(Web3.HTTPProvider(RPC_URL))

# Load contract ABI
with open("../abi/AITrader.json") as f:
    contract_abi = json.load(f)

# Create contract instance
contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=contract_abi)

def update_price(item_address, new_price):
    """
    Calls the updatePrice function on the smart contract.
    """
    try:
        # Build transaction
        nonce = w3.eth.get_transaction_count(OWNER_ADDRESS)
        tx = contract.functions.updatePrice(item_address, new_price).build_transaction({
            'from': OWNER_ADDRESS,
            'nonce': nonce,
            'gas': 2000000,
            'gasPrice': w3.eth.gas_price
        })

        # Sign transaction
        signed_tx = w3.eth.account.sign_transaction(tx, private_key=PRIVATE_KEY)

        # Send transaction
        tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
        receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
        
        print(f"Price update successful for {item_address}. Tx hash: {receipt.transactionHash.hex()}")
        return receipt
    except Exception as e:
        print(f"Error updating price for {item_address}: {e}")
        return None

def get_item_details(item_address):
    """
    Fetches item details (price and inventory) from the smart contract.
    """
    try:
        price = contract.functions.getPrice(item_address).call()
        inventory = contract.functions.getInventory(item_address).call()
        return {"price": price, "inventory": inventory}
    except Exception as e:
        print(f"Error fetching details for {item_address}: {e}")
        return None
