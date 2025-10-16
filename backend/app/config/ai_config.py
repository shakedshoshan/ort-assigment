from functools import lru_cache
import os
from dotenv import load_dotenv

load_dotenv()

class AIConfig:
    """Configuration for AI services."""
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    OPENAI_MODEL: str = os.getenv("OPENAI_MODEL", "gpt-3.5-turbo")
    OPENAI_TEMPERATURE: float = float(os.getenv("OPENAI_TEMPERATURE", "0.7"))
    OPENAI_MAX_TOKENS: int = int(os.getenv("OPENAI_MAX_TOKENS", "2000"))


@lru_cache()
def get_ai_config() -> AIConfig:
    """Get AI configuration singleton."""
    return AIConfig()
