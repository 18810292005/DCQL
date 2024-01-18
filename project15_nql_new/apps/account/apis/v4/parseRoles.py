# 把roles解析为多个role
def parseRoles(roles: int):
    """
    :param roles:角色编号
    :return:解析角色编号为角色编号list
    """
    binRoles = str(bin(roles)).split('b')[-1]
    length = len(binRoles)
    muti = 0
    for b in binRoles:
        if b == '1':
            muti += 1
    if muti == 1:  # 只有一个角色
        return [roles]
    else:  # 多种角色
        pos = length - 1
        roles_list = []
        for b in binRoles:
            if b == '1':
                roles_list.append(pow(2, pos - 1))
            pos -= 1
    return roles_list
