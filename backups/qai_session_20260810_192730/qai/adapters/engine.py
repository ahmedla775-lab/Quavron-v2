from adapters.registry import registry


class AdapterEngine:

    def run(self, adapter_name, task):

        adapter = registry.get(adapter_name)

        if adapter is None:

            return {

                "status": "error",

                "message": "Adapter not found"

            }

        return adapter.execute(task)


engine = AdapterEngine()
