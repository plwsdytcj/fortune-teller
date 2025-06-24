from fastapi import HTTPException
from src.models import DivinationBody
from .base import DivinationFactory

DREAM_PROMPT = "I request you to act as a traditional Chinese Zhougong (Duke of Zhou) dream interpreter. " \
    "I will tell you about my dream, and you will interpret its meaning."


class DreamFactory(DivinationFactory):

    divination_type = "dream"

    def build_prompt(self, divination_body: DivinationBody) -> tuple[str, str]:
        if len(divination_body.prompt) > 40:
            raise HTTPException(status_code=400, detail="Prompt too long")
        prompt = f"My dream is: {divination_body.prompt}"
        return prompt, DREAM_PROMPT
