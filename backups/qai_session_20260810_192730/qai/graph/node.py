class Node:

    def __init__(self, node_id, label):

        self.id = node_id
        self.label = label

    def to_dict(self):

        return {

            "id": self.id,

            "label": self.label

        }
