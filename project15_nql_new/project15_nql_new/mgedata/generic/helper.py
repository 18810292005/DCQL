def is_type_all(l, t):
    if not isinstance(l, list):
        return False
    return all(map(lambda x: isinstance(x, t), l))
