from tasks.task import task


class TaskEngine:

    def execute(self, title):

        item = task.create(title)

        item["status"] = "running"

        return {

            "engine": "Task Engine",

            "task": item

        }


engine = TaskEngine()
