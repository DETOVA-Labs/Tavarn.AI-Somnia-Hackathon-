import os
from dotenv import load_dotenv

load_dotenv()

RPC_URL = os.getenv("RPC_URL")
WSS_RPC_URL = os.getenv("WSS_RPC_URL")
CONTRACT_ADDRESS = os.getenv("CONTRACT_ADDRESS")
AI_PRIVATE_KEY = os.getenv("AI_PRIVATE_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
OWNER_ADDRESS = os.getenv("AI_WALLET")