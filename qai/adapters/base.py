class Adapter:

    def __init__(self, name):

        self.name = name


    def execute(self, task):

        raise NotImplementedError
