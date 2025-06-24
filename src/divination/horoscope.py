from fastapi import HTTPException
from src.models import DivinationBody
from .base import DivinationFactory

HOROSCOPE_PROMPT = "I request you to act as an astrologer. " \
    "I will provide you with a zodiac sign, and you will provide today's horoscope for that sign, " \
    "covering aspects like love, career, and health."

class HoroscopeFactory(DivinationFactory):
    divination_type = "horoscope"

    def build_prompt(self, divination_body: DivinationBody) -> tuple[str, str]:
        if not divination_body.prompt or len(divination_body.prompt) > 20:
            raise HTTPException(status_code=400, detail="Please provide a valid zodiac sign.")
        
        prompt = f"The zodiac sign is: {divination_body.prompt}"
        return prompt, HOROSCOPE_PROMPT 