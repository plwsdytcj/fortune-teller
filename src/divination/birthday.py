import datetime
from src.models import DivinationBody
from .base import DivinationFactory

BIRTHDAY_PROMPT = "I request you to act as a traditional Chinese Bazi (Eight Characters of Birth) fortune teller. " \
    "I will provide you with my birthday, and you should calculate my Bazi chart based on it, " \
    "analyzing aspects such as the five elements, fortune, wealth, marriage, health, and career."


class BirthdayFactory(DivinationFactory):

    divination_type = "birthday"

    def build_prompt(self, divination_body: DivinationBody) -> tuple[str, str]:
        return self.internal_build_prompt(divination_body.birthday)

    def internal_build_prompt(self, birthday: str) -> tuple[str, str]:
        birthday_dt = datetime.datetime.strptime(
            birthday, '%Y-%m-%d %H:%M:%S'
        )
        prompt = f"My birthday is {birthday_dt.year}-{birthday_dt.month}-{birthday_dt.day} {birthday_dt.hour}:{birthday_dt.minute}:{birthday_dt.second}"
        return prompt, BIRTHDAY_PROMPT
