from pathlib import Path

class KnowledgeIndexer:

    def __init__(self):
        self.files = []

    def scan(self, path):

        self.files = []

        root = Path(path)

        for file in root.rglob("*"):

            if file.is_file():

                self.files.append(str(file))

        return self.files

indexer = KnowledgeIndexer()
