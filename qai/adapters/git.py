import subprocess

from adapters.base import Adapter


class GitAdapter(Adapter):

    def __init__(self):

        super().__init__("git")


    def execute(self, task):

        task = task.lower()


        if task == "status":

            cmd = ["git", "status", "--short"]


        elif task == "branch":

            cmd = ["git", "branch"]


        elif task == "log":

            cmd = [

                "git",

                "log",

                "--oneline",

                "-5"

            ]


        else:

            return {

                "status": "error",

                "message": "Unsupported git task"

            }


        try:

            result = subprocess.check_output(

                cmd,

                text=True

            )

            return {

                "adapter": "git",

                "task": task,

                "status": "completed",

                "output": result

            }


        except Exception as e:

            return {

                "adapter": "git",

                "status": "failed",

                "error": str(e)

            }


adapter = GitAdapter()
