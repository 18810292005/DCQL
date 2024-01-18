class Platforms:
    DISCRETE_DATA = 0
    Big_SCIENTIFIC = 1
    DATABASE_TOOL = 2
    HIGH_THROUGHPUT_COMPUTING = 3

    PLATFORM_CHOICE = [(DISCRETE_DATA, '离散数据汇交平台'), (Big_SCIENTIFIC, '大科学装置汇交平台'), (DATABASE_TOOL, '数据库汇交工具'),
                       (HIGH_THROUGHPUT_COMPUTING, '高通量计算汇交平台')]

    @classmethod
    def get_platform_code_list(cls):
        return [x[0] for x in cls.PLATFORM_CHOICE]

    @classmethod
    def verify_platform_code(cls, code: int):
        assert isinstance(code, int)
        ls = cls.get_platform_code_list()
        return code in ls

    @classmethod
    def get_platform_name(cls, platform_code):
        for choice in cls.PLATFORM_CHOICE:
            if platform_code == choice[0]:
                return choice[1]
        return ''
