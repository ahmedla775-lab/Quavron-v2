class BaseDriver:

    def __init__(self, name):

        self.name = name


    def available(self):

        return False


    def ask(self, prompt):

        raise NotImplementedError
