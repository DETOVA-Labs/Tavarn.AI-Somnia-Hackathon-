
import os
import json
from web3 import Web3
from dotenv import load_dotenv

# --- IMPORTANT: Configuration ---
# Before running, replace this with the actual address of the item you want to buy.
# ITEM_ADDRESS_TO_BUY = ''
# --- End of Configuration ---


def trigger_buy_event():
    """
    Connects to the blockchain and sends a transaction to buy an item,
    triggering the ItemBought event for the API to detect.
    """
    # Load environment variables from .env, overriding any existing ones
    load_dotenv(override=True)
    RPC_URL = os.getenv('RPC_URL')
    print(f"Using RPC_URL: {RPC_URL}")
    CONTRACT_ADDRESS = os.getenv('CONTRACT_ADDRESS')
    USER_PRIVATE_KEY = os.getenv('PRIVATE_KEY')
    ITEM_ADDRESS_TO_BUY = os.getenv('NFT_ADDRESS')

    if not all([RPC_URL, CONTRACT_ADDRESS, USER_PRIVATE_KEY, ITEM_ADDRESS_TO_BUY]):
        print('Error: Please ensure RPC_URL, CONTRACT_ADDRESS, USER_PRIVATE_KEY, and TEST_ITEM_ADDRESS are set in your .env file.')
        return

    if ITEM_ADDRESS_TO_BUY == '0xYourItemAddressHere':
        print("Error: Please edit this script and set the 'ITEM_ADDRESS_TO_BUY' variable.")
        return

    # Convert to checksum addresses to avoid errors
    try:
        CONTRACT_ADDRESS = Web3.to_checksum_address(CONTRACT_ADDRESS)
        ITEM_ADDRESS_TO_BUY = Web3.to_checksum_address(ITEM_ADDRESS_TO_BUY)
    except ValueError:
        print("Error: An invalid address was provided in the .env file (either CONTRACT_ADDRESS or TEST_ITEM_ADDRESS). Please check them.")
        return

    w3 = Web3(Web3.HTTPProvider(RPC_URL))
    user_account = w3.eth.account.from_key(USER_PRIVATE_KEY)

    # Load contract ABI
    try:
        with open('abi/AITrader.json') as f:
            contract_abi = json.load(f)
    except FileNotFoundError:
        print("Error: Could not find 'abi/AITrader.json'. Make sure you are running this script from the project root directory.")
        return
        
    contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=contract_abi)

    print(f'Attempting to buy item {ITEM_ADDRESS_TO_BUY} as user {user_account.address}...')

    try:
        # This script assumes the contract has a payable function like `buyItem(address itemAddress, uint256 qty)`.
        # It also assumes it needs the item's price sent as the transaction value.
        item_price = contract.functions.getPrice(ITEM_ADDRESS_TO_BUY).call()
        buy_quantity = 1
        
        tx = contract.functions.buyItem(ITEM_ADDRESS_TO_BUY, buy_quantity).build_transaction({
            'from': user_account.address,
            'nonce': w3.eth.get_transaction_count(user_account.address),
            'gas': 2000000,
            'gasPrice': w3.eth.gas_price,
            'value': 0
        })

        signed_tx = w3.eth.account.sign_transaction(tx, private_key=USER_PRIVATE_KEY)
        tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)
        
        print("Transaction sent. Waiting for receipt...")
        receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
        
        print(f'\nSuccessfully bought item! Transaction hash: {receipt.transactionHash.hex()}')
        print('Check the terminal where your FastAPI app is running. You should see the event handler firing.')

    except Exception as e:
        print(f'An error occurred: {e}')

if __name__ == "__main__":
    trigger_buy_event()
