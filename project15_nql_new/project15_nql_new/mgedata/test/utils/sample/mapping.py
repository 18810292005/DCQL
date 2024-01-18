es_content_mapping = [{
    'properties': {
        '基本性质': {
            'properties': {
                '一级分类111': {
                    'type': 'keyword',
                    'ignore_above': 512,
                    'fields': {
                        'text': {
                            'type': 'text'
                        },
                        'reverse': {
                            'type': 'text',
                            'analyzer': 'reverse_analyzer'
                        }
                    }
                },
                '二级分类': {
                    'type': 'keyword',
                    'ignore_above': 512,
                    'fields': {
                        'text': {
                            'type': 'text'
                        },
                        'reverse': {
                            'type': 'text',
                            'analyzer': 'reverse_analyzer'
                        }
                    }
                },
                '三级分类': {
                    'type': 'keyword',
                    'ignore_above': 512,
                    'fields': {
                        'text': {
                            'type': 'text'
                        },
                        'reverse': {
                            'type': 'text',
                            'analyzer': 'reverse_analyzer'
                        }
                    }
                },
                '专题一级分类': {
                    'type': 'keyword',
                    'ignore_above': 512,
                    'fields': {
                        'text': {
                            'type': 'text'
                        },
                        'reverse': {
                            'type': 'text',
                            'analyzer': 'reverse_analyzer'
                        }
                    }
                },
                '专题二分类': {
                    'type': 'keyword',
                    'ignore_above': 512,
                    'fields': {
                        'text': {
                            'type': 'text'
                        },
                        'reverse': {
                            'type': 'text',
                            'analyzer': 'reverse_analyzer'
                        }
                    }
                },
                '专题名称': {
                    'type': 'keyword',
                    'ignore_above': 512,
                    'fields': {
                        'text': {
                            'type': 'text'
                        },
                        'reverse': {
                            'type': 'text',
                            'analyzer': 'reverse_analyzer'
                        }
                    }
                },
                '牌号名称': {
                    'type': 'keyword',
                    'ignore_above': 512,
                    'fields': {
                        'text': {
                            'type': 'text'
                        },
                        'reverse': {
                            'type': 'text',
                            'analyzer': 'reverse_analyzer'
                        }
                    }
                },
                '材料名称': {
                    'type': 'keyword',
                    'ignore_above': 512,
                    'fields': {
                        'text': {
                            'type': 'text'
                        },
                        'reverse': {
                            'type': 'text',
                            'analyzer': 'reverse_analyzer'
                        }
                    }
                },
                '7777': {
                    'properties': {
                        '课程': {
                            'type': 'keyword',
                            'ignore_above': 512,
                            'fields': {
                                'text': {
                                    'type': 'text'
                                },
                                'reverse': {
                                    'type': 'text',
                                    'analyzer': 'reverse_analyzer'
                                }
                            }
                        },
                        '888': {
                            'properties': {
                                'lb': {
                                    'type': 'double'
                                },
                                'ub': {
                                    'type': 'double'
                                }
                            }
                        },
                        '温度': {
                            'type': 'double'
                        }
                    }
                }
            }
        },
        '成分与比例': {
            'type': 'nested',
            'properties': {
                '_idx': {
                    'type': 'long'
                },
                '成分名称': {
                    'type': 'keyword',
                    'ignore_above': 512,
                    'fields': {
                        'text': {
                            'type': 'text'
                        },
                        'reverse': {
                            'type': 'text',
                            'analyzer': 'reverse_analyzer'
                        }
                    }
                },
                '成分比例': {
                    'type': 'double'
                }
            }
        },
        '原材料信息': {
            'type': 'nested',
            'properties': {
                '_idx': {
                    'type': 'long'
                },
                '原材料名称': {
                    'type': 'keyword',
                    'ignore_above': 512,
                    'fields': {
                        'text': {
                            'type': 'text'
                        },
                        'reverse': {
                            'type': 'text',
                            'analyzer': 'reverse_analyzer'
                        }
                    }
                },
                '性能': {
                    'type': 'keyword',
                    'ignore_above': 512,
                    'fields': {
                        'text': {
                            'type': 'text'
                        },
                        'reverse': {
                            'type': 'text',
                            'analyzer': 'reverse_analyzer'
                        }
                    }
                },
                '性能值': {
                    'type': 'double'
                },
                '性能单位': {
                    'type': 'keyword',
                    'ignore_above': 512,
                    'fields': {
                        'text': {
                            'type': 'text'
                        },
                        'reverse': {
                            'type': 'text',
                            'analyzer': 'reverse_analyzer'
                        }
                    }
                },
                '生产方法': {
                    'type': 'keyword',
                    'ignore_above': 512,
                    'fields': {
                        'text': {
                            'type': 'text'
                        },
                        'reverse': {
                            'type': 'text',
                            'analyzer': 'reverse_analyzer'
                        }
                    }
                },
                '生产商': {
                    'type': 'keyword',
                    'ignore_above': 512,
                    'fields': {
                        'text': {
                            'type': 'text'
                        },
                        'reverse': {
                            'type': 'text',
                            'analyzer': 'reverse_analyzer'
                        }
                    }
                },
                '原材料备注': {
                    'type': 'keyword',
                    'ignore_above': 512,
                    'fields': {
                        'text': {
                            'type': 'text'
                        },
                        'reverse': {
                            'type': 'text',
                            'analyzer': 'reverse_analyzer'
                        }
                    }
                }
            }
        },
        '性能测试': {
            'type': 'nested',
            'properties': {
                '_idx': {
                    'type': 'long'
                },
                '性能类别': {
                    'type': 'keyword',
                    'ignore_above': 512,
                    'fields': {
                        'text': {
                            'type': 'text'
                        },
                        'reverse': {
                            'type': 'text',
                            'analyzer': 'reverse_analyzer'
                        }
                    }
                },
                '性能名称': {
                    'type': 'keyword',
                    'ignore_above': 512,
                    'fields': {
                        'text': {
                            'type': 'text'
                        },
                        'reverse': {
                            'type': 'text',
                            'analyzer': 'reverse_analyzer'
                        }
                    }
                },
                '性能值': {
                    'type': 'double'
                },
                '性能单位': {
                    'type': 'keyword',
                    'ignore_above': 512,
                    'fields': {
                        'text': {
                            'type': 'text'
                        },
                        'reverse': {
                            'type': 'text',
                            'analyzer': 'reverse_analyzer'
                        }
                    }
                },
                '测试设备与型号': {
                    'type': 'keyword',
                    'ignore_above': 512,
                    'fields': {
                        'text': {
                            'type': 'text'
                        },
                        'reverse': {
                            'type': 'text',
                            'analyzer': 'reverse_analyzer'
                        }
                    }
                },
                '检测机构名称': {
                    'type': 'keyword',
                    'ignore_above': 512,
                    'fields': {
                        'text': {
                            'type': 'text'
                        },
                        'reverse': {
                            'type': 'text',
                            'analyzer': 'reverse_analyzer'
                        }
                    }
                }
            }
        },
        '条件与参数': {
            'type': 'nested',
            'properties': {
                '_idx': {
                    'type': 'long'
                },
                '条件名称': {
                    'type': 'keyword',
                    'ignore_above': 512,
                    'fields': {
                        'text': {
                            'type': 'text'
                        },
                        'reverse': {
                            'type': 'text',
                            'analyzer': 'reverse_analyzer'
                        }
                    }
                },
                '参数名': {
                    'type': 'keyword',
                    'ignore_above': 512,
                    'fields': {
                        'text': {
                            'type': 'text'
                        },
                        'reverse': {
                            'type': 'text',
                            'analyzer': 'reverse_analyzer'
                        }
                    }
                },
                '参数值': {
                    'type': 'double'
                },
                '单位': {
                    'type': 'keyword',
                    'ignore_above': 512,
                    'fields': {
                        'text': {
                            'type': 'text'
                        },
                        'reverse': {
                            'type': 'text',
                            'analyzer': 'reverse_analyzer'
                        }
                    }
                }
            }
        },
        '性能相关图片': {
            'type': 'keyword'
        },
        '性能相关附件': {
            'type': 'keyword'
        },
        '数据来源': {
            'properties': {
                '数据来源方式': {
                    'type': 'keyword',
                    'ignore_above': 512,
                    'fields': {
                        'text': {
                            'type': 'text'
                        },
                        'reverse': {
                            'type': 'text',
                            'analyzer': 'reverse_analyzer'
                        }
                    }
                },
                '摘录出处': {
                    'type': 'keyword',
                    'ignore_above': 512,
                    'fields': {
                        'text': {
                            'type': 'text'
                        },
                        'reverse': {
                            'type': 'text',
                            'analyzer': 'reverse_analyzer'
                        }
                    }
                },
                '数据生产者': {
                    'type': 'keyword',
                    'ignore_above': 512,
                    'fields': {
                        'text': {
                            'type': 'text'
                        },
                        'reverse': {
                            'type': 'text',
                            'analyzer': 'reverse_analyzer'
                        }
                    }
                },
                '数据审核者': {
                    'type': 'keyword',
                    'ignore_above': 512,
                    'fields': {
                        'text': {
                            'type': 'text'
                        },
                        'reverse': {
                            'type': 'text',
                            'analyzer': 'reverse_analyzer'
                        }
                    }
                },
                '数据DOI': {
                    'type': 'keyword',
                    'ignore_above': 512,
                    'fields': {
                        'text': {
                            'type': 'text'
                        },
                        'reverse': {
                            'type': 'text',
                            'analyzer': 'reverse_analyzer'
                        }
                    }
                },
                '备注': {
                    'type': 'keyword',
                    'ignore_above': 512,
                    'fields': {
                        'text': {
                            'type': 'text'
                        },
                        'reverse': {
                            'type': 'text',
                            'analyzer': 'reverse_analyzer'
                        }
                    }
                },
                '数据采集时间': {
                    'type': 'keyword',
                    'ignore_above': 512,
                    'fields': {
                        'text': {
                            'type': 'text'
                        },
                        'reverse': {
                            'type': 'text',
                            'analyzer': 'reverse_analyzer'
                        }
                    }
                }
            }
        },
        '4444': {
            'type': 'keyword',
            'ignore_above': 512,
            'fields': {
                'text': {
                    'type': 'text'
                },
                'reverse': {
                    'type': 'text',
                    'analyzer': 'reverse_analyzer'
                }
            }
        },
        '55555': {
            'type': 'double'
        },
        '77': {
            'type': 'keyword',
            'ignore_above': 512,
            'fields': {
                'text': {
                    'type': 'text'
                },
                'reverse': {
                    'type': 'text',
                    'analyzer': 'reverse_analyzer'
                }
            }
        },
        '996': {
            'properties': {
                'lb': {
                    'type': 'double'
                },
                'ub': {
                    'type': 'double'
                }
            }
        },
        '765': {
            'type': 'keyword'
        },
        '选择一下': {
            'properties': {
                '55': {
                    'type': 'keyword',
                    'ignore_above': 512,
                    'fields': {
                        'text': {
                            'type': 'text'
                        },
                        'reverse': {
                            'type': 'text',
                            'analyzer': 'reverse_analyzer'
                        }
                    }
                },
                '555': {
                    'type': 'double'
                },
                '55555': {
                    'type': 'keyword'
                },
                '5566': {
                    'type': 'nested',
                    'properties': {
                        '_idx': {
                            'type': 'long'
                        },
                        '_value': {
                            'type': 'keyword',
                            'ignore_above': 512,
                            'fields': {
                                'text': {
                                    'type': 'text'
                                },
                                'reverse': {
                                    'type': 'text',
                                    'analyzer': 'reverse_analyzer'
                                }
                            }
                        }
                    }
                }
            }
        },
        '6666': {
            'type': 'keyword',
            'ignore_above': 512,
            'fields': {
                'text': {
                    'type': 'text'
                },
                'reverse': {
                    'type': 'text',
                    'analyzer': 'reverse_analyzer'
                }
            }
        },
        'yu': {
            'properties': {
                'ooo': {
                    'type': 'keyword',
                    'ignore_above': 512,
                    'fields': {
                        'text': {
                            'type': 'text'
                        },
                        'reverse': {
                            'type': 'text',
                            'analyzer': 'reverse_analyzer'
                        }
                    }
                },
                '温度单位': {
                    'type': 'keyword',
                    'ignore_above': 512,
                    'fields': {
                        'text': {
                            'type': 'text'
                        },
                        'reverse': {
                            'type': 'text',
                            'analyzer': 'reverse_analyzer'
                        }
                    }
                }
            }
        }
    }
}, {
    'properties': {
        '字符串': {
            'type': 'keyword',
            'ignore_above': 512,
            'fields': {
                'text': {
                    'type': 'text'
                },
                'reverse': {
                    'type': 'text',
                    'analyzer': 'reverse_analyzer'
                }
            }
        },
        '数值型': {
            'type': 'double'
        }
    }
}, {
    'properties': {
        '字符串': {
            'type': 'keyword',
            'ignore_above': 512,
            'fields': {
                'text': {
                    'type': 'text'
                },
                'reverse': {
                    'type': 'text',
                    'analyzer': 'reverse_analyzer'
                }
            }
        },
        '数值型': {
            'type': 'double'
        },
        '区间型': {
            'properties': {
                'lb': {
                    'type': 'double'
                },
                'ub': {
                    'type': 'double'
                }
            }
        },
        '误差型': {
            'properties': {
                'val': {
                    'type': 'double'
                },
                'err': {
                    'type': 'double'
                }
            }
        },
        '图片': {
            'type': 'keyword'
        },
        '文件': {
            'type': 'keyword'
        },
        '容器': {
            'properties': {
                '字符串': {
                    'type': 'keyword',
                    'ignore_above': 512,
                    'fields': {
                        'text': {
                            'type': 'text'
                        },
                        'reverse': {
                            'type': 'text',
                            'analyzer': 'reverse_analyzer'
                        }
                    }
                },
                '容器': {
                    'properties': {
                        '数值型': {
                            'type': 'double'
                        }
                    }
                }
            }
        },
        '生成器': {
            'properties': {
                '字符串': {
                    'type': 'keyword',
                    'ignore_above': 512,
                    'fields': {
                        'text': {
                            'type': 'text'
                        },
                        'reverse': {
                            'type': 'text',
                            'analyzer': 'reverse_analyzer'
                        }
                    }
                },
                '数值型': {
                    'type': 'double'
                }
            }
        },
        '字符数组': {
            'type': 'nested',
            'properties': {
                '_idx': {
                    'type': 'long'
                },
                '_value': {
                    'type': 'keyword',
                    'ignore_above': 512,
                    'fields': {
                        'text': {
                            'type': 'text'
                        },
                        'reverse': {
                            'type': 'text',
                            'analyzer': 'reverse_analyzer'
                        }
                    }
                }
            }
        },
        '区间数组': {
            'type': 'nested',
            'properties': {
                '_idx': {
                    'type': 'long'
                },
                '_value': {
                    'properties': {
                        'lb': {
                            'type': 'double'
                        },
                        'ub': {
                            'type': 'double'
                        }
                    }
                }
            }
        },
        '容器数组': {
            'type': 'nested',
            'properties': {
                '_idx': {
                    'type': 'long'
                },
                '_value': {
                    'properties': {
                        '字符串': {
                            'type': 'keyword',
                            'ignore_above': 512,
                            'fields': {
                                'text': {
                                    'type': 'text'
                                },
                                'reverse': {
                                    'type': 'text',
                                    'analyzer': 'reverse_analyzer'
                                }
                            }
                        },
                        '容器': {
                            'properties': {
                                '字符串': {
                                    'type': 'keyword',
                                    'ignore_above': 512,
                                    'fields': {
                                        'text': {
                                            'type': 'text'
                                        },
                                        'reverse': {
                                            'type': 'text',
                                            'analyzer': 'reverse_analyzer'
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        '生成器数组': {
            'type': 'nested',
            'properties': {
                '_idx': {
                    'type': 'long'
                },
                '_value': {
                    'properties': {
                        '字符串': {
                            'type': 'keyword',
                            'ignore_above': 512,
                            'fields': {
                                'text': {
                                    'type': 'text'
                                },
                                'reverse': {
                                    'type': 'text',
                                    'analyzer': 'reverse_analyzer'
                                }
                            }
                        },
                        '数值': {
                            'type': 'double'
                        },
                        '容器': {
                            'properties': {
                                '字符串': {
                                    'type': 'keyword',
                                    'ignore_above': 512,
                                    'fields': {
                                        'text': {
                                            'type': 'text'
                                        },
                                        'reverse': {
                                            'type': 'text',
                                            'analyzer': 'reverse_analyzer'
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}, {
    'properties': {
        '表格': {
            'type': 'nested',
            'properties': {
                '_idx': {
                    'type': 'long'
                },
                '字符串': {
                    'type': 'keyword',
                    'ignore_above': 512,
                    'fields': {
                        'text': {
                            'type': 'text'
                        },
                        'reverse': {
                            'type': 'text',
                            'analyzer': 'reverse_analyzer'
                        }
                    }
                },
                '数值': {
                    'type': 'double'
                },
                '范围': {
                    'properties': {
                        'lb': {
                            'type': 'double'
                        },
                        'ub': {
                            'type': 'double'
                        }
                    }
                },
                '候选': {
                    'type': 'keyword',
                    'ignore_above': 512,
                    'fields': {
                        'text': {
                            'type': 'text'
                        },
                        'reverse': {
                            'type': 'text',
                            'analyzer': 'reverse_analyzer'
                        }
                    }
                },
            }
        }
    }
}, {
    'properties': {
        '材料牌号': {
            'type': 'keyword',
            'ignore_above': 512,
            'fields': {
                'text': {
                    'type': 'text'
                },
                'reverse': {
                    'type': 'text',
                    'analyzer': 'reverse_analyzer'
                }
            }
        },
        '标准': {
            'type': 'keyword',
            'ignore_above': 512,
            'fields': {
                'text': {
                    'type': 'text'
                },
                'reverse': {
                    'type': 'text',
                    'analyzer': 'reverse_analyzer'
                }
            }
        },
        '备注': {
            'type': 'keyword',
            'ignore_above': 512,
            'fields': {
                'text': {
                    'type': 'text'
                },
                'reverse': {
                    'type': 'text',
                    'analyzer': 'reverse_analyzer'
                }
            }
        },
        '对应牌号': {
            'type': 'keyword',
            'ignore_above': 512,
            'fields': {
                'text': {
                    'type': 'text'
                },
                'reverse': {
                    'type': 'text',
                    'analyzer': 'reverse_analyzer'
                }
            }
        },
        '化学成分': {
            'type': 'nested',
            'properties': {
                '_idx': {
                    'type': 'long'
                },
                '成分': {
                    'type': 'keyword',
                    'ignore_above': 512,
                    'fields': {
                        'text': {
                            'type': 'text'
                        },
                        'reverse': {
                            'type': 'text',
                            'analyzer': 'reverse_analyzer'
                        }
                    }
                },
                '含量(wt%)': {
                    'type': 'keyword',
                    'ignore_above': 512,
                    'fields': {
                        'text': {
                            'type': 'text'
                        },
                        'reverse': {
                            'type': 'text',
                            'analyzer': 'reverse_analyzer'
                        }
                    }
                }
            }
        },
        '加工工艺': {
            'type': 'nested',
            'properties': {
                '_idx': {
                    'type': 'long'
                },
                '加工工艺代号': {
                    'type': 'keyword',
                    'ignore_above': 512,
                    'fields': {
                        'text': {
                            'type': 'text'
                        },
                        'reverse': {
                            'type': 'text',
                            'analyzer': 'reverse_analyzer'
                        }
                    }
                },
                '加工工艺名称': {
                    'type': 'keyword',
                    'ignore_above': 512,
                    'fields': {
                        'text': {
                            'type': 'text'
                        },
                        'reverse': {
                            'type': 'text',
                            'analyzer': 'reverse_analyzer'
                        }
                    }
                },
                '加工工艺说明': {
                    'type': 'keyword',
                    'ignore_above': 512,
                    'fields': {
                        'text': {
                            'type': 'text'
                        },
                        'reverse': {
                            'type': 'text',
                            'analyzer': 'reverse_analyzer'
                        }
                    }
                },
                '工艺标准': {
                    'type': 'keyword',
                    'ignore_above': 512,
                    'fields': {
                        'text': {
                            'type': 'text'
                        },
                        'reverse': {
                            'type': 'text',
                            'analyzer': 'reverse_analyzer'
                        }
                    }
                }
            }
        },
        '性能信息': {
            'type': 'nested',
            'properties': {
                '_idx': {
                    'type': 'long'
                },
                '性能类别': {
                    'type': 'keyword',
                    'ignore_above': 512,
                    'fields': {
                        'text': {
                            'type': 'text'
                        },
                        'reverse': {
                            'type': 'text',
                            'analyzer': 'reverse_analyzer'
                        }
                    }
                },
                '性能名称': {
                    'type': 'keyword',
                    'ignore_above': 512,
                    'fields': {
                        'text': {
                            'type': 'text'
                        },
                        'reverse': {
                            'type': 'text',
                            'analyzer': 'reverse_analyzer'
                        }
                    }
                },
                '技术标准': {
                    'type': 'keyword',
                    'ignore_above': 512,
                    'fields': {
                        'text': {
                            'type': 'text'
                        },
                        'reverse': {
                            'type': 'text',
                            'analyzer': 'reverse_analyzer'
                        }
                    }
                },
                '品种': {
                    'type': 'keyword',
                    'ignore_above': 512,
                    'fields': {
                        'text': {
                            'type': 'text'
                        },
                        'reverse': {
                            'type': 'text',
                            'analyzer': 'reverse_analyzer'
                        }
                    }
                },
                '取样方向': {
                    'type': 'keyword',
                    'ignore_above': 512,
                    'fields': {
                        'text': {
                            'type': 'text'
                        },
                        'reverse': {
                            'type': 'text',
                            'analyzer': 'reverse_analyzer'
                        }
                    }
                },
                '温度': {
                    'type': 'keyword',
                    'ignore_above': 512,
                    'fields': {
                        'text': {
                            'type': 'text'
                        },
                        'reverse': {
                            'type': 'text',
                            'analyzer': 'reverse_analyzer'
                        }
                    }
                },
                'δ或其他规格/mm': {
                    'type': 'keyword',
                    'ignore_above': 512,
                    'fields': {
                        'text': {
                            'type': 'text'
                        },
                        'reverse': {
                            'type': 'text',
                            'analyzer': 'reverse_analyzer'
                        }
                    }
                },
                'Kt': {
                    'type': 'keyword',
                    'ignore_above': 512,
                    'fields': {
                        'text': {
                            'type': 'text'
                        },
                        'reverse': {
                            'type': 'text',
                            'analyzer': 'reverse_analyzer'
                        }
                    }
                },
                '热暴露条件': {
                    'type': 'keyword',
                    'ignore_above': 512,
                    'fields': {
                        'text': {
                            'type': 'text'
                        },
                        'reverse': {
                            'type': 'text',
                            'analyzer': 'reverse_analyzer'
                        }
                    }
                },
                '性能值': {
                    'type': 'keyword',
                    'ignore_above': 512,
                    'fields': {
                        'text': {
                            'type': 'text'
                        },
                        'reverse': {
                            'type': 'text',
                            'analyzer': 'reverse_analyzer'
                        }
                    }
                },
                '单位': {
                    'type': 'keyword',
                    'ignore_above': 512,
                    'fields': {
                        'text': {
                            'type': 'text'
                        },
                        'reverse': {
                            'type': 'text',
                            'analyzer': 'reverse_analyzer'
                        }
                    }
                }
            }
        },
        '数据生产与审核': {
            'type': 'nested',
            'properties': {
                '_idx': {
                    'type': 'long'
                },
                '数据生产者': {
                    'type': 'keyword',
                    'ignore_above': 512,
                    'fields': {
                        'text': {
                            'type': 'text'
                        },
                        'reverse': {
                            'type': 'text',
                            'analyzer': 'reverse_analyzer'
                        }
                    }
                },
                '数据审核者': {
                    'type': 'keyword',
                    'ignore_above': 512,
                    'fields': {
                        'text': {
                            'type': 'text'
                        },
                        'reverse': {
                            'type': 'text',
                            'analyzer': 'reverse_analyzer'
                        }
                    }
                }
            }
        }
    }
}]

mapping = {
    'settings': {
        'index': {
            'analysis': {
                'filter': {
                    'last512': {
                        'length': '512',
                        'type': 'truncate'
                    }
                },
                'analyzer': {
                    'reverse_analyzer': {
                        'filter': ['reverse', 'last512'],
                        'type': 'custom',
                        'tokenizer': 'keyword'
                    }
                }
            },
            'mapping.total_fields.limit': 10000,
            'mapping.nested_fields.limit': 500,
            'mapping.depth.limit': 20,
            'max_result_window': 10000000
        }
    },
    'mappings': {
        'properties': {
            'title': {
                'type': 'keyword',
                'ignore_above': 512,
                'fields': {
                    'text': {
                        'type': 'text'
                    },
                    'reverse': {
                        'type': 'text',
                        'analyzer': 'reverse_analyzer'
                    }
                }
            },
            'doi': {
                'type': 'keyword',
                'ignore_above': 512,
                'fields': {
                    'text': {
                        'type': 'text'
                    },
                    'reverse': {
                        'type': 'text',
                        'analyzer': 'reverse_analyzer'
                    }
                }
            },
            'keywords': {
                'type': 'keyword',
                'ignore_above': 512,
                'fields': {
                    'text': {
                        'type': 'text'
                    },
                    'reverse': {
                        'type': 'text',
                        'analyzer': 'reverse_analyzer'
                    }
                }
            },
            'abstract': {
                'type': 'keyword',
                'ignore_above': 512,
                'fields': {
                    'text': {
                        'type': 'text'
                    },
                    'reverse': {
                        'type': 'text',
                        'analyzer': 'reverse_analyzer'
                    }
                }
            },
            'purpose': {
                'type': 'keyword',
                'ignore_above': 512,
                'fields': {
                    'text': {
                        'type': 'text'
                    },
                    'reverse': {
                        'type': 'text',
                        'analyzer': 'reverse_analyzer'
                    }
                }
            },
            'contributor': {
                'type': 'keyword',
                'ignore_above': 512,
                'fields': {
                    'text': {
                        'type': 'text'
                    },
                    'reverse': {
                        'type': 'text',
                        'analyzer': 'reverse_analyzer'
                    }
                }
            },
            'source': {
                'type': 'keyword',
                'ignore_above': 512,
                'fields': {
                    'text': {
                        'type': 'text'
                    },
                    'reverse': {
                        'type': 'text',
                        'analyzer': 'reverse_analyzer'
                    }
                }
            },
            'methods': {
                'type': 'keyword',
                'ignore_above': 512,
                'fields': {
                    'text': {
                        'type': 'text'
                    },
                    'reverse': {
                        'type': 'text',
                        'analyzer': 'reverse_analyzer'
                    }
                }
            },
            'reference': {
                'type': 'keyword',
                'ignore_above': 512,
                'fields': {
                    'text': {
                        'type': 'text'
                    },
                    'reverse': {
                        'type': 'text',
                        'analyzer': 'reverse_analyzer'
                    }
                }
            },
            'project': {
                'type': 'keyword',
                'ignore_above': 512,
                'fields': {
                    'text': {
                        'type': 'text'
                    },
                    'reverse': {
                        'type': 'text',
                        'analyzer': 'reverse_analyzer'
                    }
                }
            },
            'subject': {
                'type': 'keyword',
                'ignore_above': 512,
                'fields': {
                    'text': {
                        'type': 'text'
                    },
                    'reverse': {
                        'type': 'text',
                        'analyzer': 'reverse_analyzer'
                    }
                }
            },
            'id': {
                'type': 'long'
            },
            'category': {
                'type': 'long'
            },
            'category_name': {
                'type': 'keyword',
                'ignore_above': 512,
                'fields': {
                    'text': {
                        'type': 'text'
                    },
                    'reverse': {
                        'type': 'text',
                        'analyzer': 'reverse_analyzer'
                    }
                }
            },
            'template': {
                'type': 'long'
            },
            'template_name': {
                'type': 'keyword',
                'ignore_above': 512,
                'fields': {
                    'text': {
                        'type': 'text'
                    },
                    'reverse': {
                        'type': 'text',
                        'analyzer': 'reverse_analyzer'
                    }
                }
            },
            'user': {
                'type': 'keyword',
                'ignore_above': 512,
                'fields': {
                    'text': {
                        'type': 'text'
                    },
                    'reverse': {
                        'type': 'text',
                        'analyzer': 'reverse_analyzer'
                    }
                }
            },
            'realname': {
                'type': 'keyword',
                'ignore_above': 512,
                'fields': {
                    'text': {
                        'type': 'text'
                    },
                    'reverse': {
                        'type': 'text',
                        'analyzer': 'reverse_analyzer'
                    }
                }
            },
            'institution': {
                'type': 'keyword',
                'ignore_above': 512,
                'fields': {
                    'text': {
                        'type': 'text'
                    },
                    'reverse': {
                        'type': 'text',
                        'analyzer': 'reverse_analyzer'
                    }
                }
            },
            'importing': {
                'type': 'boolean'
            },
            'downloads': {
                'type': 'long'
            },
            'views': {
                'type': 'long'
            },
            'score': {
                'type': 'double'
            },
            'is_public': {
                'type': 'boolean'
            },
            'public_range': {
                'type': 'keyword'
            },
            'public_date': {
                'type': 'date'
            },
            'add_time': {
                'type': 'date'
            },
            'last_modified': {
                'type': 'date'
            },
            'reviewer': {
                'type': 'keyword'
            },
            'reviewer_realname': {
                'type': 'keyword',
                'ignore_above': 512,
                'fields': {
                    'text': {
                        'type': 'text'
                    },
                    'reverse': {
                        'type': 'text',
                        'analyzer': 'reverse_analyzer'
                    }
                }
            },
            'reviewer_institution': {
                'type': 'keyword',
                'ignore_above': 512,
                'fields': {
                    'text': {
                        'type': 'text'
                    },
                    'reverse': {
                        'type': 'text',
                        'analyzer': 'reverse_analyzer'
                    }
                }
            },
            'review_state': {
                'type': 'keyword',
                'ignore_above': 512,
                'fields': {
                    'text': {
                        'type': 'text'
                    },
                    'reverse': {
                        'type': 'text',
                        'analyzer': 'reverse_analyzer'
                    }
                }
            },
            'disapprove_reason': {
                'type': 'keyword',
                'ignore_above': 512,
                'fields': {
                    'text': {
                        'type': 'text'
                    },
                    'reverse': {
                        'type': 'text',
                        'analyzer': 'reverse_analyzer'
                    }
                }
            },
            'summary': {
                'type': 'keyword',
                'ignore_above': 512,
                'fields': {
                    'text': {
                        'type': 'text'
                    },
                    'reverse': {
                        'type': 'text',
                        'analyzer': 'reverse_analyzer'
                    }
                }
            },
            'external_link': {
                'type': 'keyword'
            },
            'content': {
                'properties': {}
            },
        }
    }
}
