class PathValueSet:

    def __init__(self):
        self.data = dict()

    def insert(self, path, value):
        cur = self.data
        for step in path[:-1]:
            if step not in cur:
                cur[step] = dict()
            cur = cur[step]
        cur[path[-1]] = value

    def get(self, path):
        cur = self.data
        for step in path:
            if step in cur:
                cur = cur[step]
            else:
                return None
        return cur
