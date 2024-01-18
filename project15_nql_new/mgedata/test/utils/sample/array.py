template = {
    "_ord": [
        "数组类型",
        "字符串类型",
        "容器类型"
    ],
    "容器类型": {
        "r": False,
        "t": 9,
        "misc": {
            "_ord": [
                "数值类型"
            ],
            "数值类型": {
                "r": False,
                "t": 2,
                "misc": {
                    "unit": "r"
                }
            }
        }
    },
    "数组类型": {
        "r": False,
        "t": 7,
        "misc": {
            "r": False,
            "t": 9,
            "misc": {
                "_ord": [
                    "数组里面的字符串"
                ],
                "数组里面的字符串": {
                    "r": False,
                    "t": 7,
                    "misc": {
                        "r": False,
                        "t": 1,
                        "misc": {}
                    }
                }
            }
        }
    },
    "字符串类型": {
        "r": False,
        "t": 1,
        "misc": {}
    }
}

es_mapping = {
    "mapping": {
        "_doc": {
            "properties": {
                "数组类型": {
                    "type": "nested",
                    "properties": {
                        "_idx": {"type": "long"},
                        "_value": {
                            "properties": {
                                "数组里面的字符串": {
                                    "type": "nested",
                                    "properties": {
                                        "_idx": {"type": "long"},
                                        "_value": {
                                            "type": "keyword",
                                            "ignore_above": 512,
                                            "fields": {
                                                "text": {"type": "text"},
                                                "reverse": {
                                                    "type": "text",
                                                    "analyzer": "reverse_analyzer"
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                "字符串类型": {
                    "type": "keyword",
                    "ignore_above": 512,
                    "fields": {
                        "text": {"type": "text"},
                        "reverse": {
                            "type": "text",
                            "analyzer": "reverse_analyzer"
                        }
                    }
                },
                "容器类型": {
                    "properties": {
                        "数值类型": {"type": "double"}
                    }
                },
            }
        }
    }
}

dict_data = [
    {
        "meta": {
            "title": "Data Item 1",
            "abstract": "我是第一个 Data Item",
            "keywords": "good"
        },
        "content": {
            "数组类型": [
                {
                    "数组里面的字符串": [
                        "8",
                        "4"
                    ]
                }
            ],
            "字符串类型": "haha string type",
            "容器类型": {
                "数值类型": 10.6
            }
        }
    },
    {
        "meta": {
            "title": "Data Item 2",
            "abstract": "我是第一个 Data Item",
            "keywords": "good"
        },
        "content": {
            "数组类型": [
                {
                    "数组里面的字符串": [
                        "1",
                        "2"
                    ]
                },
                {
                    "数组里面的字符串": [
                        "4",
                        "5",
                        "6"
                    ]
                },
                {
                    "数组里面的字符串": [
                        "8"
                    ]
                }
            ],
            "字符串类型": "small string type",
            "容器类型": {
                "数值类型": 1.4
            }
        }
    },
    {
        "meta": {
            "title": "Data Item 3",
            "abstract": "我是第一个 Data Item",
            "keywords": "good",
        },
        "content": {
            "数组类型": [
                {
                    "数组里面的字符串": [
                        "1",
                        "2",
                        "3"
                    ]
                },
                {
                    "数组里面的字符串": [
                        "4",
                        "5",
                        "6"
                    ]
                }
            ],
            "字符串类型": "big string type",
            "容器类型": {
                "数值类型": 6.34
            }
        }
    }
]

es_data = [
    {
        "meta": {
            "title": "Data Item 1",
            "abstract": "我是第一个 Data Item",
            "keywords": "good"
        },
        "content": {
            "数组类型": [
                {
                    "_idx": 1,
                    "_value": {
                        "数组里面的字符串": [
                            {"_idx": 1, "_value": "8"},
                            {"_idx": 2, "_value": "4"}
                        ]
                    }
                }
            ],
            "字符串类型": "haha string type",
            "容器类型": {
                "数值类型": 10.6
            }
        }
    },
    {
        "meta": {
            "title": "Data Item 2",
            "abstract": "我是第一个 Data Item",
            "keywords": "good",
        },
        "content": {
            "数组类型": [
                {
                    "_idx": 1,
                    "_value": {
                        "数组里面的字符串": [
                            {"_idx": 1, "_value": "1"},
                            {"_idx": 2, "_value": "2"}
                        ]
                    }
                },
                {
                    "_idx": 2,
                    "_value": {
                        "数组里面的字符串": [
                            {"_idx": 1, "_value": "4"},
                            {"_idx": 2, "_value": "5"},
                            {"_idx": 3, "_value": "6"}
                        ]
                    }
                },
                {
                    "_idx": 3,
                    "_value": {
                        "数组里面的字符串": [
                            {"_idx": 1, "_value": "8"}
                        ]
                    }
                }
            ],
            "字符串类型": "small string type",
            "容器类型": {
                "数值类型": 1.4
            }
        }
    },
    {
        "meta": {
            "title": "Data Item 3",
            "abstract": "我是第一个 Data Item",
            "keywords": "good",
        },
        "content": {
            "数组类型": [
                {
                    "_idx": 1,
                    "_value": {
                        "数组里面的字符串": [
                            {"_idx": 1, "_value": "1"},
                            {"_idx": 2, "_value": "2"},
                            {"_idx": 3, "_value": "3"}
                        ]
                    }
                },
                {
                    "_idx": 2,
                    "_value": {
                        "数组里面的字符串": [
                            {"_idx": 1, "_value": "4"},
                            {"_idx": 2, "_value": "5"},
                            {"_idx": 3, "_value": "6"}
                        ]
                    }
                }
            ],
            "字符串类型": "big string type",
            "容器类型": {
                "数值类型": 6.34
            }
        }
    }
]

path_value_set = [
    {
        "meta": {
            "标题": "Data Item 1",
            "数据摘要": "我是第一个 Data Item",
            "关键词": "good"
        },
        "content": {
            "数组类型": {
                "0": {
                    "数组里面的字符串": {
                        "0": "8",
                        "1": "4"
                    },
                }
            },
            "字符串类型": "haha string type",
            "容器类型": {
                "数值类型": "10.6"
            }
        }
    },
    {
        "meta": {
            "标题": "Data Item 1",
            "数据摘要": "我是第一个 Data Item",
            "关键词": "good"
        },
        "content": {
            "数组类型": {
                "0": {
                    "数组里面的字符串": {
                        "0": "1",
                        "1": "2"
                    }
                },
                "1": {
                    "数组里面的字符串": {
                        "0": "4",
                        "1": "5",
                        "2": "6"
                    }
                },
                "2": {
                    "数组里面的字符串": {
                        "0": "8"
                    }
                }
            },
            "字符串类型": "small string type",
            "容器类型": {
                "数值类型": "1.4"
            }
        }
    },
    {
        "meta": {
            "标题": "Data Item 1",
            "数据摘要": "我是第一个 Data Item",
            "关键词": "good",
        },
        "content": {
            "数组类型": {
                "0": {
                    "数组里面的字符串": {
                        "0": "1",
                        "1": "2",
                        "2": "3"
                    }
                },
                "1": {
                    "数组里面的字符串": {
                        "0": "4",
                        "1": "5",
                        "2": "6"
                    }
                }
            },
            "字符串类型": "big string type",
            "容器类型": {
                "数值类型": "6.34"
            }
        }
    }
]

xlsx_dict = {
    'ord': ['工作表目录', '数据信息', '1', '2', '3'],
    'values': {
        '工作表目录': {
            'header': (1, '工作表名', '工作表内容'),
            'rows': [(2, '1', '=HYPERLINK("#1!A2","Root Data")'),
                     (3, '2', '=HYPERLINK("#2!A1","表格 \'数组类型\' 的数据")'),
                     (4, '3', '=HYPERLINK("#3!A1","表格 \'数组类型.9.数组里面的字符串\' 的数据")')]},
        '数据信息': {
            'header': (1, '数据 ID', '标题', 'DOI', '数据摘要', '关键词', '来源', '计算', '实验', '生产', '引用', '课题'),
            'rows': [(2, '1', 'Data Item 1', None, '我是第一个 Data Item', 'good', 'self-production', 'yes', 'no', 'no',
                      None, '材料基因工程专用数据库架构、标准规范与数据库(2016YFB0700503)'),
                     (3, '2', 'Data Item 2', None, '我是第一个 Data Item', 'good', 'self-production', 'yes', 'no', 'no',
                      None, '材料基因工程专用数据库架构、标准规范与数据库(2016YFB0700503)'),
                     (4, '3', 'Data Item 3', None, '我是第一个 Data Item', 'good', 'self-production', 'yes', 'no', 'no',
                      None, '材料基因工程专用数据库架构、标准规范与数据库(2016YFB0700503)')]
        },
        '1': {
            'header': (1, '数据 ID', '数组类型', '字符串类型', '容器类型.数值类型(r)'),
            'rows': [(2, '1', '=HYPERLINK("#2!A3","数组型")', 'haha string type', '10.6'),
                     (3, '2', '=HYPERLINK("#2!A4","数组型")', 'small string type', '1.4'),
                     (4, '3', '=HYPERLINK("#2!A7","数组型")', 'big string type', '6.34')]
        },
        '2': {
            'header': (1, '数据 ID', '数据项序号', '数组类型.数组里面的字符串'),
            'rows': [(2, '1', '1', '=HYPERLINK("#3!A2","数组型")'),
                     (3, '2', '1', '=HYPERLINK("#3!A4","数组型")'),
                     (4, '2', '2', '=HYPERLINK("#3!A6","数组型")'),
                     (5, '3', '=HYPERLINK("#3!A9","数组型")'),
                     (6, '1', '=HYPERLINK("#3!A10","数组型")'),
                     (7, '2', '=HYPERLINK("#3!A13","数组型")')]
        },
        '3': {
            'header': (1, '数据 ID', '数据项序号', '数据项'),
            'rows': [(2, '1', '1', '1'),
                     (3, '1', '1', '2'),
                     (4, '2', '1', '1'),
                     (5, '2', '1', '2'),
                     (6, '2', '2', '1'),
                     (7, '2', '2', '2'),
                     (8, '2', '2', '3'),
                     (9, '2', '3', '1'),
                     (10, '3', '1', '1'),
                     (11, '3', '1', '2'),
                     (12, '3', '1', '3'),
                     (13, '3', '2', '1'),
                     (14, '3', '2', '2'),
                     (15, '3', '2', '3')]
        }
    }
}
