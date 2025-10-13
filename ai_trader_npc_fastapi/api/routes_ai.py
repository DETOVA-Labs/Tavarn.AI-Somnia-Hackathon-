from fastapi import APIRouter
from services.ai_pricing import get_ai_price_suggestion

router = APIRouter()

@router.post("/predict")
async def predict_price(data: dict):
    result = await get_ai_price_suggestion(
        data["item_name"], data["base_price"], data["demand_index"], data["supply"]
    )
    return result
