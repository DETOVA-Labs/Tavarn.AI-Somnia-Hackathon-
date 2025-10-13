import os
from dotenv import load_dotenv
from eth_account import Account

load_dotenv()

RPC_URL = os.getenv("RPC_URL")
WSS_RPC_URL = os.getenv("WSS_RPC_URL") # For event listening
CONTRACT_ADDRESS = os.getenv("CONTRACT_ADDRESS")
PRIVATE_KEY = os.getenv("PRIVATE_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Derive owner address from private key
if PRIVATE_KEY:
    OWNER_ADDRESS = Account.from_key(PRIVATE_KEY).address
else:
    OWNER_ADDRESS = None
