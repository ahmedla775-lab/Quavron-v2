from workflow.workflow import workflow


class WorkflowEngine:

    def start(self, name):

        flow = workflow.create(name)

        flow["status"] = "running"

        return {

            "engine": "Workflow Engine",

            "workflow": flow

        }


engine = WorkflowEngine()
