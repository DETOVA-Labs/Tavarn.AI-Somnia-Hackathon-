import asyncio
import threading
from fastapi import FastAPI
from api.routes_products import router as products_router
from api.routes_ai import router as ai_router
from services.event_listener import start_event_listener

app = FastAPI(title="AI Trader NPC API", version="1.0")

def run_event_listener():
    """Helper function to run the asyncio event listener in a new loop."""
    asyncio.run(start_event_listener())

@app.on_event("startup")
async def startup_event():
    """
    On startup, run the event listener in a separate thread.
    """
    print("Starting background event listener thread...")
    thread = threading.Thread(target=run_event_listener, daemon=True)
    thread.start()

app.include_router(products_router, prefix="/api/items", tags=["Items"])
app.include_router(ai_router, prefix="/api/ai", tags=["AI"])

@app.get("/")
def root():
    return {"message": "AI Trader NPC Backend is running"}
