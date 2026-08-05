import json
import os
from datetime import datetime


class Memory:

    def __init__(self):

        self.file = "memory/storage/memory.json"

        if not os.path.exists(self.file):
            with open(self.file, "w") as f:
                json.dump([], f)


    def remember(self, user_input, response):

        with open(self.file, "r") as f:
            data = json.load(f)


        item = {

            "input": user_input,

            "response": response,

            "time": str(datetime.now())

        }


        data.append(item)


        with open(self.file, "w") as f:
            json.dump(data, f, indent=2)



        return item



    def history(self):

        with open(self.file, "r") as f:
            return json.load(f)



memory = Memory()
