from enum import IntEnum


class OpenApiAuthState(IntEnum):
    PENDING = 0
    APPROVE = 1
    REJECT = 2

    @property
    def description(self):
        return ("处理中", "已通过", "已拒绝")[self.value]

    @staticmethod
    def choices():
        return ((x.value, x.description) for x in OpenApiAuthState)
