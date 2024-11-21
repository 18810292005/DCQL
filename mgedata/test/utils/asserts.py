def assert_dict_partial_equal(dict1, dict2, paths):
    def access(d, path):
        ret = d
        for step in path:
            ret = ret[step]
        return ret

    for path in paths:
        d1 = access(dict1, path)
        d2 = access(dict2, path)
        if d1 != d2:
            raise AssertionError('%s and %s are Not Equal', str(d1), str(d2))


def dict_contains_another(big, small):
    if isinstance(big, dict) and isinstance(small, dict):
        for field, value in small.items():
            if field not in big:
                return False
            if not dict_contains_another(big[field], small[field]):
                return False
    else:
        if big != small:
            return False
    return True
