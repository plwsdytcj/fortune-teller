import datetime
from fastapi import HTTPException
from src.models import DivinationBody
from .base import DivinationFactory

NEW_NAME_PROMPT = (
    "I request you to act as a traditional Chinese naming master. "
    "I will provide a surname, gender, and date of birth. "
    "Based on this information, please generate a suitable full name, "
    "considering traditional elements like Bazi and Wuge. "
    "Also, provide an explanation for why the name is suitable."
)


class NewNameFactory(DivinationFactory):

    divination_type = "new_name"

    def build_prompt(self, divination_body: DivinationBody) -> tuple[str, str]:
        if (not divination_body.new_name or not all([
            divination_body.new_name.surname,
            divination_body.new_name.birthday,
            divination_body.new_name.sex,
        ]) or len(divination_body.new_name.new_name_prompt) > 20):
            raise HTTPException(status_code=400, detail="Invalid parameters for name generation")

        birthday = datetime.datetime.strptime(
            divination_body.birthday, '%Y-%m-%d %H:%M:%S'
        )
        prompt = (
            f"The surname is {divination_body.new_name.surname}, "
            f"gender is {divination_body.new_name.sex}, "
            f"and the date of birth is {birthday.year}-{birthday.month}-{birthday.day} {birthday.hour}:{birthday.minute}:{birthday.second}"
        )
        if divination_body.new_name.new_name_prompt:
            prompt += f", my additional request is: {divination_body.new_name.new_name_prompt}"
        return prompt, NEW_NAME_PROMPT
