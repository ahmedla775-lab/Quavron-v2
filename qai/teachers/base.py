from abc import ABC, abstractmethod


class BaseTeacher(ABC):

    name = "unknown"

    @abstractmethod
    def teach(self, question, context=""):
        pass
