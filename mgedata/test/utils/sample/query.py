API_queries = [
    {
        "q": {
            "meta": None,
            "data": {
                "and": [{
                    "field": "条件与参数",
                    "op": "all",
                    "val": {
                        "and": [{
                            "field": "条件与参数.条件名称",
                            "op": "eq",
                            "val": "1"
                        }, {
                            "field": "条件与参数.参数值",
                            "op": "gte",
                            "val": 10
                        }]
                    }
                }, {
                    "field": "996.lb",
                    "op": "gt",
                    "val": 10
                }]
            }
        },
        "tid": 397
    },
    {
        "q": {
            "meta": None,
            "data": {
                "and": [{
                    "field": "字符串",
                    "op": "none"
                }, {
                    "field": "数值型",
                    "op": "eq",
                    "val": 10000
                }]
            }
        },
        "tid": 398
    },
    {
        "q": {
            "meta": None,
            "data": {
                "and": [{
                    "field": "生成器",
                    "op": "any"
                }, {
                    "field": "字符数组",
                    "op": "all",
                    "val": {
                        "field": "字符数组.1",
                        "op": "eq",
                        "val": "123"
                    }
                }]
            }
        },
        "tid": 399
    },
    {
        "q": {
            "meta": None,
            "data": {
                "and": [{
                    "field": "表格",
                    "op": "exists",
                    "val": {
                        "field": "表格.候选",
                        "op": "eq",
                        "val": "B"
                    }
                }, {
                    "field": "表格",
                    "op": "nexists",
                    "val": {
                        "field": "表格.数值",
                        "op": "gt",
                        "val": 10
                    }
                }]
            }
        },
        "tid": 400
    },
    {
        "q": {
            "meta": {
                "and": [{
                    "field": "title",
                    "op": "contains",
                    "val": "钛合金"
                }, {
                    "or": [{
                        "field": "title",
                        "op": "endswith",
                        "val": "3"
                    }]
                }, {
                    "field": "abstract",
                    "op": "contains",
                    "val": "钛合金"
                }]
            },
            "data": {
                "and": [{
                    "field": "材料牌号",
                    "op": "eq",
                    "val": "材料牌号"
                }, {
                    "field": "加工工艺",
                    "op": "exists",
                    "val": {
                        "field": "加工工艺.工艺标准",
                        "op": "eq",
                        "val": "工艺标准"
                    }
                }, {
                    "field": "化学成分",
                    "op": "all",
                    "val": {
                        "field": "化学成分.成分",
                        "op": "eq",
                        "val": "成分"
                    }
                }]
            }
        },
        "tid": 264
    }
]

ES_DSL = [
    {
        'query': {
            'bool': {'must': [
                {'bool': {'must': [
                    {'bool': {'must_not': [
                        {'nested': {
                            'path': 'content.条件与参数',
                            'query': {'bool': {'should': [
                                {'bool': {'must_not': [
                                    {'term': {'content.条件与参数.条件名称': '1'}},
                                ]}},
                                {'range': {'content.条件与参数.参数值': {'lt': 10}}}
                            ]}}
                        }},
                    ]}},
                    {'range': {'content.996.lb': {'gt': 10}}}
                ]}}
            ]}
        }
    },
    {
        'query': {
            'bool': {'must': [
                {'bool': {'must': [
                    {'bool': {'must_not': [
                        {'exists': {'field': 'content.字符串'}},
                    ]}},
                    {'term': {'content.数值型': 10000}}
                ]}}
            ]}
        }
    },
    {
        'query': {
            'bool': {'must': [
                {'bool': {'must': [
                    {'exists': {'field': 'content.生成器'}},
                    {'bool': {'must_not': [
                        {'nested': {
                            'path': 'content.字符数组',
                            'query': {'bool': {'must_not': [
                                {'term': {'content.字符数组.1': '123'}}
                            ]}}
                        }}
                    ]}}
                ]}}
            ]}
        }
    },
    {
        'query': {
            'bool': {'must': [
                {'bool': {'must': [
                    {'nested': {
                        'path': 'content.表格',
                        'query': {'term': {'content.表格.候选': 'B'}}
                    }},
                    {'bool': {'must_not': [
                        {'nested': {
                            'path': 'content.表格',
                            'query': {'range': {'content.表格.数值': {'gt': 10}}}
                        }},
                    ]}}
                ]}}
            ]}
        }
    },
    {
        'query': {
            'bool': {'must': [
                {'bool': {'must': [
                    {"match_phrase": {"title.text": "钛合金"}},
                    {"bool": {"should": [{"prefix": {"title.reverse": "3"}}]}},
                    {"match_phrase": {"abstract.text": "钛合金"}},
                ]}},
                {'bool': {'must': [
                    {'term': {'content.材料牌号': '材料牌号'}},
                    {'nested': {
                        'path': 'content.加工工艺',
                        'query': {'term': {'content.加工工艺.工艺标准': '工艺标准'}}
                    }},
                    {'bool': {'must_not': [
                        {'nested': {
                            'path': 'content.化学成分',
                            'query': {'bool': {'must_not': [
                                {'term': {'content.化学成分.成分': '成分'}}
                            ]}}
                        }},
                    ]}}
                ]}}
            ]}
        }
    }
]
