from pathlib import Path

from adapters.base import Adapter


class FilesystemAdapter(Adapter):

    def __init__(self):

        super().__init__("filesystem")


    def execute(self, task):

        action = task.get("action")

        path = Path(task.get("path",""))


        try:

            if action == "read":

                return {

                    "status":"completed",

                    "content": path.read_text()

                }


            if action == "write":

                path.write_text(task.get("content",""))

                return {

                    "status":"completed"

                }


            if action == "exists":

                return {

                    "status":"completed",

                    "exists": path.exists()

                }


            if action == "list":

                return {

                    "status":"completed",

                    "files":[

                        p.name

                        for p in path.iterdir()

                    ]

                }


            return {

                "status":"error",

                "message":"Unsupported action"

            }


        except Exception as e:

            return {

                "status":"failed",

                "error":str(e)

            }


adapter = FilesystemAdapter()
