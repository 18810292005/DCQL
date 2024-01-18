import pytz
from datetime import datetime

from django.utils import timezone

from mgedata.settings import TIME_ZONE
from mgedata.generic.data import Data, DataContent
from mgedata.generic.trans import TemplateContentToDataContent, DictToTemplateContent

from mgedata.test.utils.sample.template import templates


data = [
    [],
    [],
    [],
    [],
    [
        {
            "title": "钛合金数据",
            "category": 2,
            "source": "self-production",
            "methods": [],
            "template": 3,
            "keywords": [
                ""
            ],
            "doi": "",
            "score": 0.0,
            "downloads": 0,
            "views": 2,
            "abstract": "",
            "purpose": "",
            "user": "test",
            "add_time": pytz.timezone(TIME_ZONE).localize(datetime.strptime("2019-04-22 14:39:34",
                                                                            '%Y-%m-%d %H:%M:%S'), is_dst=None),
            "reference": "热等静压处理对超低温Ti-5Al-2.5SnELI合金铸造组织与性能的影响",
            "is_public": True,
            "importing": False,
            "contributor": "",
            "institution": "",
            "review_state": "pending",
            "content": {
                "材料牌号": "Ti-5Al-2.5SnELI",
                "化学成分": [
                    {
                        "成分": "Al",
                        "含量(wt%)": "5.33"
                    },
                    {
                        "成分": "Fe",
                        "含量(wt%)": "0.097"
                    },
                    {
                        "成分": "Si",
                        "含量(wt%)": "0.069"
                    },
                    {
                        "成分": "C",
                        "含量(wt%)": "0.015"
                    },
                    {
                        "成分": "H",
                        "含量(wt%)": "0.0031"
                    },
                    {
                        "成分": "O",
                        "含量(wt%)": "0.053"
                    },
                    {
                        "成分": "N",
                        "含量(wt%)": "0.011"
                    },
                    {
                        "成分": "Sn",
                        "含量(wt%)": "2.36"
                    }
                ],
                "加工工艺": [
                    {
                        "加工工艺代号": "2",
                        "加工工艺名称": "热等静压处理",
                        "加工工艺说明": "940 ℃±10 ℃，130~140 MPa保温2~4 h，随炉冷至300℃出炉",
                    }
                ],
                "性能信息": [
                    {
                        "性能类别": "力学性能",
                        "性能名称": "延伸率",
                        "性能值": "10/10.5",
                        "单位": "%"
                    }
                ],
                "数据生产与审核": [
                    {
                        "数据生产者": "崔丽娜 ",
                        "数据审核者": "王海涛"
                    }
                ]
            },
        }
    ],
]

t1 = TemplateContentToDataContent(DictToTemplateContent(templates[1]).to())

data_content_1 = t1.to()
data_content_1.create()
data_content_1['字符串'].create()
data_content_1['字符串'].set('字符串')
data_content_1['数值型'].create()
data_content_1['数值型'].set(10.0)

# template_2
data_content_dict_1 = {
    "字符串": "字符串",
    "数值型": 34,
    "区间型": {
        "lb": 1,
        "ub": 5
    },
    "误差型": {
        "val": 4,
        "err": 1
    },
    "容器": {
        "字符串": "字符串",
        "容器": {
            "数值型": 34
        }
    },
    "生成器": {
        "数值型": 3243
    },
    "字符数组": [
        "发",
        "发",
        "发",
        "发"
    ],
    "区间数组": [
        {
            "lb": 4,
            "ub": 5
        },
        {
            "lb": 3,
            "ub": 9
        },
        {
            "lb": 1,
            "ub": 4
        }
    ],
    "容器数组": [
        {
            "字符串": "字符串",
            "容器": {
                "字符串": "字符串"
            }
        },
        {
            "字符串": "字符串",
            "容器": {
                "字符串": "字符串"
            }
        }
    ],
    "生成器数组": [
        {
            "容器": {
                "字符串": "字符串"
            }
        },
        {
            "数值": 345
        },
        {
            "字符串": "字符串"
        }
    ]
}

# template_3
data_content_dict_2 = {"表格": [{"字符串": "字符串", "数值": 34, "范围": {"lb": 1, "ub": 5}, "候选": "B"}]}
