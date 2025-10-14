from fastapi import APIRouter

router = APIRouter()

fake_items = [
    {"id": 1, "name": "Mythic Sword", "symbol": "MSWD", "base_price": 100, "current_price": 125, "rarity": "legendary", "supply": 10}
]

@router.get("/")
async def get_items():
    return fake_items

@router.post("/")
async def add_item(item: dict):
    item["id"] = len(fake_items) + 1
    fake_items.append(item)
    return {"message": "Item added successfully.", "id": item["id"]}
