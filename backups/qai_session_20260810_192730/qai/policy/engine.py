from policy.rules import rules


class PolicyEngine:

    def check(self, action):

        decision = rules.rules.get(action, "deny")

        return {

            "action": action,

            "decision": decision

        }


engine = PolicyEngine()
