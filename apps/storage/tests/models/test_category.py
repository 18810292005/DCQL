from apps.storage.models.material import CategoryTree, Category
from apps.storage.models.template import Template
from mgedata.errors.models import MGEError
from mgedata.test.testcase import MGEBaseTestCase


class TestCategory(MGEBaseTestCase):
    maxDiff = None

    def test_get_empty_tree(self):
        self.assertEquals(0, CategoryTree.objects.count())
        _, tree = CategoryTree.get_tree()
        self.assertEquals([], tree)
        self.assertEquals(1, CategoryTree.objects.count())
        self.assertEquals([], CategoryTree.objects.first().tree_json['tree'])

    def test_add_and_move_category(self):
        old_v, _ = CategoryTree.get_tree()
        v, cat1 = CategoryTree.add_category(old_v, '测试分类1')
        tree_record: CategoryTree = CategoryTree.objects.first()
        self.assertEquals(1, CategoryTree.objects.count())
        self.assertEquals(1, Category.objects.count())
        self.assertEquals('测试分类1', cat1.name)
        # 版本号更新后之前的版本号会触发冲突
        with self.assert_mge_error(MGEError.CATEGORY_CONFLICT):
            CategoryTree.add_category(old_v, '测试分类1')
        tree_record.refresh_from_db()
        self.assertNotEquals(old_v, str(tree_record.version))
        v, cat2 = CategoryTree.add_category(v, '测试分类2')
        v, cat1_1 = CategoryTree.add_category(v, '测试分类1-1', cat1.id)
        self.assertEquals(3, Category.objects.count())
        self.assertEquals('测试分类2', cat2.name)
        self.assertEquals('测试分类1-1', cat1_1.name)
        v, tree = CategoryTree.get_tree()
        self.assertEquals(
            [
                {
                    'id': cat1.id,
                    'name': '测试分类1',
                    'children': [
                        {
                            'id': cat1_1.id,
                            'name': '测试分类1-1',
                            'children': [],
                        }
                    ],
                },
                {
                    'id': cat2.id,
                    'name': '测试分类2',
                    'children': [],
                }
            ],
            tree
        )
        # 移动分类，1-1从1移到2之下，然后1移到2之后

        CategoryTree.reconstruct(
            v,
            [
                {
                    'id': cat2.id,
                    'children': [
                        {
                            'id': cat1_1.id,
                            'children': [],
                        }
                    ],
                },
                {
                    'id': cat1.id,
                    'children': [],
                },
            ]
        )
        v, tree = CategoryTree.get_tree()
        self.assertEquals(
            [
                {
                    'id': cat2.id,
                    'name': '测试分类2',
                    'children': [
                        {
                            'id': cat1_1.id,
                            'name': '测试分类1-1',
                            'children': [],
                        }
                    ],
                },
                {
                    'id': cat1.id,
                    'name': '测试分类1',
                    'children': [],
                }
            ],
            tree
        )

    def test_add_category_complex(self):
        """
        测试3级分类
        """
        v, _ = CategoryTree.get_tree()
        v, cat1 = CategoryTree.add_category(v, '测试分类1')
        v, cat2 = CategoryTree.add_category(v, '测试分类2')
        v, cat1_1 = CategoryTree.add_category(v, '测试分类1-1', cat1.id)
        v, cat1_2 = CategoryTree.add_category(v, '测试分类1-2', cat1.id)
        v, cat2_1 = CategoryTree.add_category(v, '测试分类2-1', cat2.id)
        v, cat2_2 = CategoryTree.add_category(v, '测试分类2-2', cat2.id)
        v, cat1_1_1 = CategoryTree.add_category(v, '测试分类1-1-1', cat1_1.id)
        v, cat1_1_2 = CategoryTree.add_category(v, '测试分类1-1-2', cat1_1.id)
        v, cat1_2_1 = CategoryTree.add_category(v, '测试分类1-2-1', cat1_2.id)
        v, cat1_2_2 = CategoryTree.add_category(v, '测试分类1-2-2', cat1_2.id)
        v, cat2_1_1 = CategoryTree.add_category(v, '测试分类2-1-1', cat2_1.id)
        v, cat2_1_2 = CategoryTree.add_category(v, '测试分类2-1-2', cat2_1.id)
        v, cat2_2_1 = CategoryTree.add_category(v, '测试分类2-2-1', cat2_2.id)
        v, cat2_2_2 = CategoryTree.add_category(v, '测试分类2-2-2', cat2_2.id)
        v_final, tree = CategoryTree.get_tree()
        self.assertEquals(v, v_final)
        CategoryTree.pretty_print_tree()
        """
        原结构：
        
        所有分类
           ├──测试分类1
           │  ├──测试分类1-1
           │  │  ├──测试分类1-1-1
           │  │  └──测试分类1-1-2
           │  └──测试分类1-2
           │     ├──测试分类1-2-1
           │     └──测试分类1-2-2
           └──测试分类2
              ├──测试分类2-1
              │  ├──测试分类2-1-1
              │  └──测试分类2-1-2
              └──测试分类2-2
                 ├──测试分类2-2-1
                 └──测试分类2-2-2
        
        按如下规则移动分类：
        
        所有分类
           ├──测试分类1
           │  └──测试分类2-1
           ├──测试分类2
           │  └──测试分类1-1
           │     ├──测试分类1-1-1
           │     │  ├──测试分类1-2
           │     │  └──测试分类2-2
           │     └──测试分类1-1-2
           ├──测试分类1-2-1
           ├──测试分类1-2-2
           ├──测试分类2-1-1
           ├──测试分类2-1-2
           ├──测试分类2-2-1
           └──测试分类2-2-2
        """

        CategoryTree.reconstruct(
            v,
            [
                {
                    "id": cat1.id,
                    "children": [
                        {
                            "id": cat2_1.id,
                        }
                    ]
                },
                {
                    "id": cat2.id,
                    "children": [
                        {
                            "id": cat1_1.id,
                            "children": [
                                {
                                    "id": cat1_1_1.id,
                                    "children": [
                                        {
                                            "id": cat1_2.id,
                                        },
                                        {
                                            "id": cat2_2.id,
                                        }
                                    ]
                                },
                                {
                                    "id": cat1_1_2.id,
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": cat1_2_1.id,
                },
                {
                    "id": cat1_2_2.id,
                },
                {
                    "id": cat2_1_1.id,
                },
                {
                    "id": cat2_1_2.id,
                },
                {
                    "id": cat2_2_1.id,
                },
                {
                    "id": cat2_2_2.id,
                }
            ]
        )
        v_final, tree = CategoryTree.get_tree()
        self.assertNotEquals(v, v_final)
        self.assertEquals(
            [
                {
                    "id": cat1.id,
                    "name": "测试分类1",
                    "children": [
                        {
                            "id": cat2_1.id,
                            "name": "测试分类2-1",
                            "children": []
                        }
                    ]
                },
                {
                    "id": cat2.id,
                    "name": "测试分类2",
                    "children": [
                        {
                            "id": cat1_1.id,
                            "name": "测试分类1-1",
                            "children": [
                                {
                                    "id": cat1_1_1.id,
                                    "name": "测试分类1-1-1",
                                    "children": [
                                        {
                                            "id": cat1_2.id,
                                            "name": "测试分类1-2",
                                            "children": []
                                        },
                                        {
                                            "id": cat2_2.id,
                                            "name": "测试分类2-2",
                                            "children": []
                                        }
                                    ]
                                },
                                {
                                    "id": cat1_1_2.id,
                                    "name": "测试分类1-1-2",
                                    "children": []
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": cat1_2_1.id,
                    "name": "测试分类1-2-1",
                    "children": []
                },
                {
                    "id": cat1_2_2.id,
                    "name": "测试分类1-2-2",
                    "children": []
                },
                {
                    "id": cat2_1_1.id,
                    "name": "测试分类2-1-1",
                    "children": []
                },
                {
                    "id": cat2_1_2.id,
                    "name": "测试分类2-1-2",
                    "children": []
                },
                {
                    "id": cat2_2_1.id,
                    "name": "测试分类2-2-1",
                    "children": []
                },
                {
                    "id": cat2_2_2.id,
                    "name": "测试分类2-2-2",
                    "children": []
                }
            ],
            tree
        )

    def test_delete_category(self):
        v, _ = CategoryTree.get_tree()
        v, cat1 = CategoryTree.add_category(v, '测试分类1')
        v, cat2 = CategoryTree.add_category(v, '测试分类2')
        v, cat1_1 = CategoryTree.add_category(v, '测试分类1-1', cat1.id)
        v, cat1_2 = CategoryTree.add_category(v, '测试分类1-2', cat1.id)
        v, cat2_1 = CategoryTree.add_category(v, '测试分类2-1', cat2.id)
        v, cat2_2 = CategoryTree.add_category(v, '测试分类2-2', cat2.id)
        v, cat1_1_1 = CategoryTree.add_category(v, '测试分类1-1-1', cat1_1.id)
        v, cat1_1_2 = CategoryTree.add_category(v, '测试分类1-1-2', cat1_1.id)
        v, cat1_2_1 = CategoryTree.add_category(v, '测试分类1-2-1', cat1_2.id)
        v, cat1_2_2 = CategoryTree.add_category(v, '测试分类1-2-2', cat1_2.id)
        v, cat2_1_1 = CategoryTree.add_category(v, '测试分类2-1-1', cat2_1.id)
        v, cat2_1_2 = CategoryTree.add_category(v, '测试分类2-1-2', cat2_1.id)
        v, cat2_2_1 = CategoryTree.add_category(v, '测试分类2-2-1', cat2_2.id)
        v, cat2_2_2 = CategoryTree.add_category(v, '测试分类2-2-2', cat2_2.id)
        v, tree = CategoryTree.get_tree()
        """
        原结构：
        
        所有分类
           ├──测试分类1
           │  ├──测试分类1-1
           │  │  ├──测试分类1-1-1
           │  │  └──测试分类1-1-2
           │  └──测试分类1-2
           │     ├──测试分类1-2-1
           │     └──测试分类1-2-2
           └──测试分类2
              ├──测试分类2-1
              │  ├──测试分类2-1-1
              │  └──测试分类2-1-2
              └──测试分类2-2
                 ├──测试分类2-2-1
                 └──测试分类2-2-2
        """
        CategoryTree.delete_category(v, cat1_2.id)
        """
        删除1-2及其子分类后：
        
        所有分类
           ├──测试分类1
           │  ├──测试分类1-1
           │  │  ├──测试分类1-1-1
           │  │  └──测试分类1-1-2
           └──测试分类2
              ├──测试分类2-1
              │  ├──测试分类2-1-1
              │  └──测试分类2-1-2
              └──测试分类2-2
                 ├──测试分类2-2-1
                 └──测试分类2-2-2
        """
        v, tree = CategoryTree.get_tree()
        expected = [
            {
                "id": cat1.id,
                "name": "测试分类1",
                "children": [
                    {
                        "id": cat1_1.id,
                        "name": "测试分类1-1",
                        "children": [
                            {
                                "id": cat1_1_1.id,
                                "name": "测试分类1-1-1",
                                "children": []
                            },
                            {
                                "id": cat1_1_2.id,
                                "name": "测试分类1-1-2",
                                "children": []
                            }
                        ]
                    }
                ]
            },
            {
                "id": cat2.id,
                "name": "测试分类2",
                "children": [
                    {
                        "id": cat2_1.id,
                        "name": "测试分类2-1",
                        "children": [
                            {
                                "id": cat2_1_1.id,
                                "name": "测试分类2-1-1",
                                "children": []
                            },
                            {
                                "id": cat2_1_2.id,
                                "name": "测试分类2-1-2",
                                "children": []
                            }
                        ]
                    },
                    {
                        "id": cat2_2.id,
                        "name": "测试分类2-2",
                        "children": [
                            {
                                "id": cat2_2_1.id,
                                "name": "测试分类2-2-1",
                                "children": []
                            },
                            {
                                "id": cat2_2_2.id,
                                "name": "测试分类2-2-2",
                                "children": []
                            }
                        ]
                    }
                ]
            }
        ]
        self.assertEquals(expected, tree)

        CategoryTree.delete_category(v, cat1.id)
        """
        再删除“测试分类1”
        
        所有分类
          └──测试分类2
              ├──测试分类2-1
              │  ├──测试分类2-1-1
              │  └──测试分类2-1-2
              └──测试分类2-2
              ├──测试分类2-2-1
              └──测试分类2-2-2
        
        """
        v, tree = CategoryTree.get_tree()
        expected = [
            {
                "id": cat2.id,
                "name": "测试分类2",
                "children": [
                    {
                        "id": cat2_1.id,
                        "name": "测试分类2-1",
                        "children": [
                            {
                                "id": cat2_1_1.id,
                                "name": "测试分类2-1-1",
                                "children": []
                            },
                            {
                                "id": cat2_1_2.id,
                                "name": "测试分类2-1-2",
                                "children": []
                            }
                        ]
                    },
                    {
                        "id": cat2_2.id,
                        "name": "测试分类2-2",
                        "children": [
                            {
                                "id": cat2_2_1.id,
                                "name": "测试分类2-2-1",
                                "children": []
                            },
                            {
                                "id": cat2_2_2.id,
                                "name": "测试分类2-2-2",
                                "children": []
                            }
                        ]
                    }
                ]
            }
        ]
        self.assertEquals(expected, tree)
        # 所有被删除的分类，Category表中的记录也应该被删除
        self.assertEquals(0, Category.objects.filter(
            id__in=[
                cat1.id, cat1_1.id, cat1_1_1.id, cat1_1_2.id, cat1_2.id, cat1_2_1.id, cat1_2_2.id
            ]
        ).count())

        # 删除所有分类
        CategoryTree.delete_category(v, cat2.id)
        self.assertEquals(0, Category.objects.count())

        # 再次添加也没问题
        self.test_add_and_move_category()

    def test_delete_forbidden(self):
        v, _ = CategoryTree.get_tree()
        v, cat1 = CategoryTree.add_category(v, '测试分类1')
        v, cat2 = CategoryTree.add_category(v, '测试分类2')
        v, cat1_1 = CategoryTree.add_category(v, '测试分类1-1', cat1.id)
        v, cat1_2 = CategoryTree.add_category(v, '测试分类1-2', cat1.id)
        v, cat2_1 = CategoryTree.add_category(v, '测试分类2-1', cat2.id)
        v, cat2_2 = CategoryTree.add_category(v, '测试分类2-2', cat2.id)
        v, cat1_1_1 = CategoryTree.add_category(v, '测试分类1-1-1', cat1_1.id)
        v, cat1_1_2 = CategoryTree.add_category(v, '测试分类1-1-2', cat1_1.id)
        v, cat1_2_1 = CategoryTree.add_category(v, '测试分类1-2-1', cat1_2.id)
        v, cat1_2_2 = CategoryTree.add_category(v, '测试分类1-2-2', cat1_2.id)
        v, cat2_1_1 = CategoryTree.add_category(v, '测试分类2-1-1', cat2_1.id)
        v, cat2_1_2 = CategoryTree.add_category(v, '测试分类2-1-2', cat2_1.id)
        v, cat2_2_1 = CategoryTree.add_category(v, '测试分类2-2-1', cat2_2.id)
        v, cat2_2_2 = CategoryTree.add_category(v, '测试分类2-2-2', cat2_2.id)
        v, tree_before = CategoryTree.get_tree()
        # 在测试分类1-2、1-2-2下创建模板
        Template.objects.create(
            title='模板1-2',
            category=cat1_2,
            abstract='模板1-2',
            content={},
            constraints={},
        )
        Template.objects.create(
            title='模板1-2-2',
            category=cat1_2_2,
            abstract='模板1-2-2',
            content={},
            constraints={},
        )
        # 尝试删除分类1-2
        with self.assert_mge_error(
                MGEError.DELETE_FORBIDDEN,
                "以下分类已经拥有模板：测试分类1-2, 测试分类1-2-2。请先删除模板再删除分类。"
        ):
            CategoryTree.delete_category(v, cat1_2.id)

        # tree不变
        v, tree_after = CategoryTree.get_tree()
        self.assertEquals(tree_before, tree_after)

    def test_exceptions(self):
        v, _ = CategoryTree.get_tree()
        v, cat1 = CategoryTree.add_category(v, '测试分类1')
        v, cat2 = CategoryTree.add_category(v, '测试分类2')
        v, cat1_1 = CategoryTree.add_category(v, '测试分类1-1', cat1.id)
        # 尝试把1-1同时分配到1和2下
        update = [
            {
                'id': cat1.id,
                'children': [{'id': cat1_1.id, 'children': [], 'name': '测试分类1-1'}],
                'name': '测试分类1'
            },
            {
                'id': cat2.id,
                'children': [{'id': cat1_1.id, 'children': [], 'name': '测试分类1-1'}],
                'name': '测试分类2'
            }
        ]
        with self.assert_mge_error(
                MGEError.MALFORMED_CATEGORY_TREE,
                '分类"测试分类1-1"拥有多个父分类（每个分类只能有一个父分类）'
        ):
            CategoryTree.reconstruct(v, update)

        # 不存在的分类
        update[0]['id'] = 9999
        with self.assert_mge_error(
                MGEError.NOT_FOUND,
                '分类不存在（ID=9999）'
        ):
            CategoryTree.reconstruct(v, update)
        with self.assert_mge_error(
                MGEError.NOT_FOUND,
                '父分类不存在（ID=9999）'
        ):
            CategoryTree.add_category(v, 'abc', 9999)

    def test_conflict(self):
        v, _ = CategoryTree.get_tree()
        v1, cat1 = CategoryTree.add_category(v, '测试分类1')
        CategoryTree.add_category(v1, '测试分类2')
        with self.assert_mge_error(
                MGEError.CATEGORY_CONFLICT,
                '刷新'
        ):
            CategoryTree.add_category(v, '测试分类3')
        with self.assert_mge_error(
                MGEError.CATEGORY_CONFLICT,
                '刷新'
        ):
            CategoryTree.delete_category(v, cat1.id)
