import asyncio
import threading
from fastapi import FastAPI
from services.event_listener import start_event_listener

app = FastAPI(title="AI Trader NPC API", version="1.0")

def run_event_listener():
    asyncio.run(start_event_listener())

@app.on_event("startup")
async def startup_event():
    print("Starting background event listener thread...")
    thread = threading.Thread(target=run_event_listener, daemon=True)
    thread.start()

@app.get("/")
def root():
    return {"message": "AI Trader NPC Backend is running"}
