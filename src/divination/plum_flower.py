from fastapi import HTTPException
from src.models import DivinationBody
from .base import DivinationFactory

SYS_PROMPT = "I request you to act as a traditional Chinese Plum Blossom (Meihua Yishu) diviner. " \
    "I will give you two random numbers; the first number will be the upper trigram, and the second will be the lower trigram. " \
    "Please provide a detailed interpretation based on these numbers."


class PlumFlowerFactory(DivinationFactory):

    divination_type = "plum_flower"

    def build_prompt(self, divination_body: DivinationBody) -> tuple[str, str]:
        if not divination_body.plum_flower:
            raise HTTPException(status_code=400, detail="No plum_flower data provided")
        prompt = f"The numbers I have chosen are: {divination_body.plum_flower.num1} and {divination_body.plum_flower.num2}"
        return prompt, SYS_PROMPT
