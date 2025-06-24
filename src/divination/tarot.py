from fastapi import HTTPException
from src.models import DivinationBody
from .base import DivinationFactory

TAROT_PROMPT = "I request you to act as a Tarot reader. " \
    "You will receive my questions and use virtual Tarot cards for a reading. " \
    "Do not forget to shuffle the deck and introduce the deck you are using for this reading. " \
    "Please draw 3 random cards for me. " \
    "After drawing the cards, please explain their meanings in detail, " \
    "clarify which card belongs to the future, present, or past, and interpret them in the context of my question."


class TarotFactory(DivinationFactory):

    divination_type = "tarot"

    def build_prompt(self, divination_body: DivinationBody) -> tuple[str, str]:
        if len(divination_body.prompt) > 40:
            raise HTTPException(status_code=400, detail="Prompt too long")
        return divination_body.prompt, TAROT_PROMPT
