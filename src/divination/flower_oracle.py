from fastapi import HTTPException
from src.models import DivinationBody
from .base import DivinationFactory

FLOWER_ORACLE_PROMPT = (
    "You are a Flower Oracle reader. "
    "When given a question, you will intuitively select a flower whose symbolic meaning best fits the situation. "
    "Describe the flower, its color, and its traditional meaning. "
    "Then, provide a gentle, positive message for the user based on the flower's symbolism. "
    "If the user asks about love, career, or health, tailor the message accordingly. "
)

class FlowerOracleFactory(DivinationFactory):
    divination_type = "flower_oracle"

    def build_prompt(self, divination_body: DivinationBody) -> tuple[str, str]:
        if len(divination_body.prompt) > 40:
            raise HTTPException(status_code=400, detail="Prompt too long")
        return divination_body.prompt, FLOWER_ORACLE_PROMPT 