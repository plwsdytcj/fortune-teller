from fastapi import HTTPException
from src.models import DivinationBody
from .base import DivinationFactory

NAME_PROMPT = "I request you to act as a traditional Chinese Name Wuge (Five Grids) fortune teller. " \
    "I will give you my name, and you will calculate and analyze it based on the Wuge system, " \
    "including the heavenly, earthly, and personal grids."


class NameFactory(DivinationFactory):

    divination_type = "name"

    def build_prompt(self, divination_body: DivinationBody) -> tuple[str, str]:
        if len(divination_body.prompt) > 10 or len(divination_body.prompt) < 1:
            raise HTTPException(status_code=400, detail="Incorrect name length")
        prompt = f"My name is {divination_body.prompt}"
        return prompt, NAME_PROMPT
