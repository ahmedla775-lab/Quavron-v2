class KnowledgeGraph:

    def __init__(self):

        self.nodes = {}
        self.edges = []


    def add_node(self, node):

        self.nodes[node.id] = node


    def add_edge(self, edge):

        self.edges.append(edge)


    def export(self):

        return {

            "nodes": [

                n.to_dict()

                for n in self.nodes.values()

            ],

            "edges": [

                e.to_dict()

                for e in self.edges

            ]

        }


graph = KnowledgeGraph()
