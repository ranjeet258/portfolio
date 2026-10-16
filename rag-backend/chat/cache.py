"""Small in-memory LRU cache of answers to standalone questions."""

import re
from collections import OrderedDict


class AnswerCache:
    """Recruiters tend to open with the same handful of questions; the profile
    is fixed per deploy, so a repeat can be answered without calling the model."""

    def __init__(self, max_size: int) -> None:
        self._max_size = max_size
        self._answers: OrderedDict[str, str] = OrderedDict()

    @staticmethod
    def _key(question: str) -> str:
        # Case, punctuation and spacing don't change what is being asked.
        return re.sub(r"[\W_]+", " ", question.casefold()).strip()

    def get(self, question: str) -> str | None:
        key = self._key(question)
        answer = self._answers.get(key)
        if answer is not None:
            self._answers.move_to_end(key)
        return answer

    def put(self, question: str, answer: str) -> None:
        key = self._key(question)
        if not key or not answer:
            return
        self._answers[key] = answer
        self._answers.move_to_end(key)
        while len(self._answers) > self._max_size:
            self._answers.popitem(last=False)
