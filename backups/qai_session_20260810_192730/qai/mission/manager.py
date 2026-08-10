class MissionManager:

    def __init__(self):

        self.missions = []


    def add(self, mission):

        self.missions.append(mission)


    def list(self):

        return self.missions


manager = MissionManager()
