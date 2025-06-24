from fastapi import HTTPException
from src.models import DivinationBody
from .base import DivinationFactory

SYS_PROMPT = "You are a marriage affinity assistant. I will send you two names, separated by a comma. " \
    "Please randomly comment on the affinity between these two people. " \
    "This is for entertainment, so it doesn't need to be very realistic. " \
    "You can first judge the authenticity of the names. " \
    "If the input is something generic like 'John Doe' or 'Jane Smith', you can say they are not suitable. " \
    "Also, if both names appear to be of the same gender, you can also return that they are not suitable. " \
    "Then, for the main part, give a 90% chance of saying the two are very suitable, and a 10% chance of saying they are not."


class Fate(DivinationFactory):

    divination_type = "fate"

    def build_prompt(self, divination_body: DivinationBody) -> tuple[str, str]:
        fate = divination_body.fate
        if not fate:
            raise HTTPException(status_code=400, detail="Fate is required")
        if len(fate.name1) > 40 or len(fate.name2) > 40:
            raise HTTPException(status_code=400, detail="Prompt too long")
        prompt = f'{fate.name1}, {fate.name2}'
        return prompt, SYS_PROMPT
