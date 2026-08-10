class TaskQueue:

    def __init__(self):

        self.queue = []


    def push(self, task):

        self.queue.append(task)


    def all(self):

        return self.queue


queue = TaskQueue()
