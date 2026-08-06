from execution.executor import executor


class ExecutionEngine:

    def run(self, mission):

        result = executor.execute(mission)

        return {

            "engine": "Execution Engine",

            "result": result

        }


engine = ExecutionEngine()
