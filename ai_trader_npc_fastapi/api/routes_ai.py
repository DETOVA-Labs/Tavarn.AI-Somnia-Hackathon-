from fastapi import APIRouter
# from services.ai_pricing import get_ai_price_suggestion

router = APIRouter()

@router.post("/predict")
async def predict_price(data: dict):

    return 1
