import re
from openai import OpenAI
from core.config import OPENAI_API_KEY

client = OpenAI(api_key=OPENAI_API_KEY)

async def get_ai_price_suggestion(item_name, base_price, demand_index, supply):
    """
    Gets a new price suggestion from the AI model.
    """
    prompt = (
        f"Given a base price of {base_price} for '{item_name}', a current supply of {supply}, "
        f"and a demand index of {demand_index} (from 0 to 10), what is the new fair market price? "
        f"Respond with only a single integer representing the price. Do not include any other text or symbols."
    )
    
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}]
        )
        answer = response.choices[0].message.content
        
        # Extract the first integer from the response
        match = re.search(r'\d+', answer)
        if match:
            price = int(match.group(0))
            print(f"AI suggested new price for {item_name}: {price}")
            return price
        else:
            print(f"Error: Could not parse price from AI response: {answer}")
            return None
            
    except Exception as e:
        print(f"Error getting AI price suggestion for {item_name}: {e}")
        return None
