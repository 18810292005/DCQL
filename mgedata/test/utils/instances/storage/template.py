from apps.storage.models.template import *
from mgedata.test.utils.instances.instances import INSTANCES
from mgedata.test.utils.instances.account import user_create
from .material import materialCategory_create, materialMethod_create


def template_create():
    if "template" in INSTANCES:
        return INSTANCES[INSTANCES.index("template") + 1]
    materialCategory_child = materialCategory_create()
    user = user_create()
    template = Template(
        # id = 1
        title='title',
        category=materialCategory_child,
        user=user,
        abstract='abstract',
        # pub_date = models.DateField(auto_now=True)
        # published = models.BooleanField(default=False)
        # trashed = models.BooleanField(default=False)
        reviewer=user,
        # review_state = models.IntegerField(default=0)  # 0: 待审核   1: 审核通过 2: 审核不通过
        content={
            'content': 'content'
        },
        disapprove_reason='disapprove_reason'
    )
    template.save()
    INSTANCES.extend(["template", template])
    return template


def materialMethodTemplateRelation_create():
    if "materialMethodTemplateRelation" in INSTANCES:
        return INSTANCES[INSTANCES.index("materialMethodTemplateRelation") + 1]
    template = template_create()
    materialMethod = materialMethod_create()
    materialMethodTemplateRelation = MaterialMethodTemplateRelation(
        template=template,
        method=materialMethod,
    )
    materialMethodTemplateRelation.save()
    INSTANCES.extend(["materialMethodTemplateRelation", materialMethodTemplateRelation])
    return materialMethodTemplateRelation


def template_create_v2():
    if "template_v2" in INSTANCES:
        return INSTANCES[INSTANCES.index("template_v2") + 1]
    materialCategory_child = materialCategory_create()
    user = user_create()
    template_v2 = Template(
        id=1,
        title='title',
        category=materialCategory_child,
        user=user,
        abstract='abstract',
        # pub_date = models.DateField(auto_now=True)
        # published = models.BooleanField(default=False)
        # trashed = models.BooleanField(default=False)
        reviewer=user,
        # review_state = models.IntegerField(default=0)  # 0: 待审核   1: 审核通过 2: 审核不通过
        content={
            '_ord': ['材料牌号', '化学成分', '热处理', '性能'],
            '性能': {
                'r': False, 't': 8,
                'misc': {
                    '_head': ['性能名', '性能值'],
                    '性能值': {
                        'r': False, 't': 2,
                        'misc': {
                            'unit': ''
                        }
                    },
                    '性能名': {
                        'r': False,
                        't': 6,
                        'misc': {
                            'grp': [
                                {
                                    'name': '物理性能',
                                    'items': ['晶粒尺寸']
                                },
                                {'name': '力学性能',
                                 'items': ['屈服强度']
                                 }
                            ],
                            'opt': []
                        }
                    }
                }
            },
            '热处理': {
                'r': False,
                't': 9,
                'misc': {
                    '_ord': ['样品信息', '工艺'],
                    '工艺': {
                        'r': False,
                        't': 7,
                        'misc': {
                            'r': False,
                            't': 10,
                            'misc': {
                                '_opt': [
                                    '固溶处理',
                                    '时效处理'
                                ],
                                '固溶处理': {
                                    'r': False,
                                    't': 9,
                                    'misc': {
                                        '_ord': [
                                            '固溶温度',
                                            '固溶时间',
                                            '冷却方式',
                                        ],
                                        '冷却方式': {
                                            'r': False,
                                            't': 1,
                                            'misc': {}
                                        },
                                        '固溶时间': {
                                            'r': False,
                                            't': 1,
                                            'misc': {}
                                        },
                                        '固溶温度': {
                                            'r': False,
                                            't': 1,
                                            'misc': {}
                                        },
                                    }
                                },
                                '时效处理': {
                                    'r': False,
                                    't': 9,
                                    'misc': {
                                        '_ord': [
                                            '时效温度',
                                            '时效时间',
                                            '冷却方式'
                                        ],
                                        '冷却方式': {
                                            'r': False,
                                            't': 1,
                                            'misc': {}
                                        },
                                        '时效时间': {
                                            'r': False,
                                            't': 1,
                                            'misc': {}
                                        },
                                        '时效温度': {
                                            'r': False,
                                            't': 1,
                                            'misc': {}
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '样品信息': {
                        'r': False,
                        't': 9,
                        'misc': {
                            '_ord': ['样品形状', '样品尺寸'],
                            '样品尺寸': {
                                'r': False,
                                't': 1,
                                'misc': {}
                            },
                            '样品形状': {
                                'r': False, 't': 1,
                                'misc': {}
                            }
                        }
                    }
                }
            },
            '化学成分': {
                'r': False,
                't': 8,
                'misc': {
                    '_head': ['化学元素', '含量'],
                    '含量': {
                        'r': False,
                        't': 3,
                        'misc': {
                            'type': 0,
                            'unit': 'w.t.%'
                        }
                    },
                    '化学元素': {
                        'r': False,
                        't': 1,
                        'misc': {}
                    }
                }
            },
            '材料牌号': {
                'r': False,
                't': 1,
                'misc': {}
            }
        },
        disapprove_reason='disapprove_reason'
    )
    template_v2.save()
    INSTANCES.extend(["template_v2", template_v2])
    return template_v2
