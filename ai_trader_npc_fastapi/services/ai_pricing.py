import json
import google.generativeai as genai
from core.config import GEMINI_API_KEY

genai.configure(api_key=GEMINI_API_KEY)

def calculate_price_deterministically(base_price, demand_factor, supply_factor):
    """
    Calculates a new price using a deterministic formula based on market factors.
    This function is fast, predictable, and controllable.
    """
    # --- Tunable Weights ---
    demand_weight = 0.05
    supply_weight = 0.04

    demand_adjustment = 1.0 + (demand_factor * demand_weight)
    # We use a negative supply_factor to represent supply pressure
    supply_adjustment = 1.0 - (supply_factor * supply_weight)
    new_price = base_price * demand_adjustment * supply_adjustment
    return max(1, int(new_price))


async def get_ai_market_factors(item_name, demand_index, supply):
    """
    the LLM to analyze market conditions and return structured factors.
    """
    model = genai.GenerativeModel('models/gemini-flash-latest')

    system_prompt = (
        "You are a master trader in a fantasy world. Your goal is to analyze market data "
        "and provide key factors for a pricing model. Respond only with a valid JSON object."
    )
    
    user_prompt = (
        f"Analyze the market for '{item_name}'. "
        f"The current raw demand index is {demand_index} (from 0 to 10, where 10 is max demand). "
        f"The current supply (inventory) is {supply}. "
        f"Based on this, provide a JSON object with two keys: "
        f"1. 'demand_factor': Your expert assessment of demand, as an integer from 0 to 10. "
        f"2. 'supply_factor': Your expert assessment of supply pressure, as an integer from 0 to 10 (where 10 means high supply pressure, driving prices down)."
    )

    try:
        response = await model.generate_content_async(
            [system_prompt, user_prompt],
            generation_config={"response_mime_type": "application/json"}
        )
        factors = json.loads(response.text)
        print(f"AI market analysis for {item_name}: {factors}")
        return factors
        
    except Exception as e:
        print(f"Error getting AI market factors for {item_name}: {e}")
        return None


async def get_hybrid_price_suggestion(item_name, base_price, demand_index, supply):
    """
    Orchestrates our hybrid pricing model.
    1. Gets market factors from the AI.
    2. Calculates the final price using a deterministic formula.
    """
    factors = await get_ai_market_factors(item_name, demand_index, supply)
    if not factors or 'demand_factor' not in factors or 'supply_factor' not in factors:
        print("Could not retrieve valid market factors from AI. Aborting price change.")
        return None

    new_price = calculate_price_deterministically(
        base_price=base_price,
        demand_factor=factors['demand_factor'],
        supply_factor=factors['supply_factor']
    )
    
    print(f"Hybrid model suggested new price for {item_name}: {new_price}")
    return new_price
