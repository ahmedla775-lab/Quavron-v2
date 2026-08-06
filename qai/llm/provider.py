class Provider:

    def __init__(self, name):

        self.name = name


    def generate(self, prompt):

        raise NotImplementedError
