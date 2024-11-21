from apps.storage.models.material import Category


def get_sub_classes(mat_class) -> list:
    """
    获取该分类的子分类
    :param mat_class:
    :return:
    """
    assert mat_class.leaf is False
    return Category.objects.filter(pid=mat_class.id)


def get_all_leaf_class() -> list:
    """
    获取所有叶子节点
    :return: 所有叶子节点的列表
    """
    return Category.objects.filter(leaf=True)


def get_sub_leaf_class_list(mat_class: Category) -> list:
    """
    获取指定分类的所有叶子分类
    :param mat_class: 父分类，不能是叶子节点
    :return: 所有叶子分类的列表
    """
    assert mat_class.leaf is False
    result = []
    for c in get_sub_classes(mat_class):
        result += [c] if c.leaf is True else get_sub_leaf_class_list(c)
    return result
