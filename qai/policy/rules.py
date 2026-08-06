class PolicyRules:

    def __init__(self):

        self.rules = {

            "read": "allow",

            "list": "allow",

            "status": "allow",

            "branch": "allow",

            "log": "allow",

            "write": "confirm",

            "delete": "deny",

            "terminal": "confirm"

        }


rules = PolicyRules()
