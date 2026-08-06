class ExecutionHistory:

    def __init__(self):

        self.records = []


    def add(self, result):

        self.records.append(result)


    def all(self):

        return self.records


history = ExecutionHistory()
