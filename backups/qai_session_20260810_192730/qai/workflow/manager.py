class WorkflowManager:

    def __init__(self):

        self.items = []


    def add(self, workflow):

        self.items.append(workflow)


    def all(self):

        return self.items


manager = WorkflowManager()
