class _CONST(object):
    __slots__ = ()
    META_BLANK_STRING = '在这里填写'
    BLANK_STRING = ['在这里填写', '从下拉列表中选择', '在下方填写', '此处填写']
    SUPPORT_IMAGE_EXT = ['.BMP', '.JPG', '.PNG', '.TIF', '.GIF', '.PCX', '.TGA', '.EXIF', '.FPX', '.SVG', '.PSD',
                         '.CDR', '.PCD', '.DXF', '.UFO', '.EPS', '.AI', '.RAW', '.WMF', '.WEBP', '.AVIF']
    

    def is_blank_string(self, raw_value: str):
        for c in self.BLANK_STRING:
            if c in raw_value:
                return True
        return False


CONST = _CONST()
