import logging
from openai_service import call_openai
from groq_service import call_groq

logger = logging.getLogger(__name__)

async def route_model_request(prompt: str, model_tier: str = "premium") -> dict:
    """
    Routes the LLM generation request based on the selected tier.
    Automatically falls back to Groq if OpenAI premium fails.
    """
    if model_tier.lower() == "premium":
        try:
            logger.info("Attempting generation using Premium model (OpenAI GPT-4o)...")
            return await call_openai(prompt)
        except Exception as e:
            logger.error(f"OpenAI Premium model failed: {str(e)}. Falling back to Free model (Groq).")
            # Fallback
            return await call_groq(prompt)
            
    elif model_tier.lower() == "free":
        try:
            logger.info("Generating using Free model (Groq Mixtral)...")
            return await call_groq(prompt)
        except Exception as e:
            logger.error(f"Groq Free model failed: {str(e)}.")
            raise e
    else:
        raise ValueError("Invalid model_tier. Select either 'premium' or 'free'.")
