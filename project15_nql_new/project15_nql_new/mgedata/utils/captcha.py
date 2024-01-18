import os
import random
from io import BytesIO as StringIO

from PIL import Image, ImageDraw, ImageFont
from django.conf import settings


def noise_arcs(draw, image):
    size = image.size
    draw.arc([-20, -20, size[0], 20], 0, 295, fill=Settings.CAPTCHA_FOREGROUND_COLOR)
    draw.line([-20, 20, size[0] + 20, size[1] - 20], fill=Settings.CAPTCHA_FOREGROUND_COLOR)
    draw.line([-20, 0, size[0] + 20, size[1]], fill=Settings.CAPTCHA_FOREGROUND_COLOR)
    return draw


def noise_dots(draw, image):
    size = image.size
    for p in range(int(size[0] * size[1] * 0.1)):
        draw.point((random.randint(0, size[0]), random.randint(0, size[1])),
                   fill=Settings.CAPTCHA_FOREGROUND_COLOR)
    return draw


def post_smooth(image):
    try:
        import ImageFilter
    except ImportError:
        from PIL import ImageFilter
    return image.filter(ImageFilter.SMOOTH)


class Settings:
    CAPTCHA_FONT_PATH = os.path.normpath(os.path.join(settings.BASE_DIR, 'static/font/Vera.ttf'))
    CAPTCHA_FONT_SIZE = 22
    CAPTCHA_LETTER_ROTATION = (-20, 20)
    CAPTCHA_BACKGROUND_COLOR = '#ffffff'
    CAPTCHA_FOREGROUND_COLOR = '#001100'
    CAPTCHA_NOISE_FUNCTIONS = (noise_arcs, noise_dots,)
    CAPTCHA_FILTER_FUNCTIONS = (post_smooth,)
    CAPTCHA_LENGTH = 4
    CAPTCHA_IMAGE_SIZE = (80, 32)


def getsize(font, text):
    if hasattr(font, 'getoffset'):
        return tuple([x + y for x, y in zip(font.getsize(text), font.getoffset(text))])
    else:
        return font.getsize(text)


def makeimg(size):
    if Settings.CAPTCHA_BACKGROUND_COLOR == "transparent":
        image = Image.new('RGBA', size)
    else:
        image = Image.new('RGB', size, Settings.CAPTCHA_BACKGROUND_COLOR)
    return image


def generate_challenge():
    chars, ret = 'abcdefghijklmnopqrstuvwxyz', ''
    for i in range(Settings.CAPTCHA_LENGTH):
        ret += random.choice(chars)
    return ret.upper()


def captcha_image(challenge, scale=1):
    # Distance of the drawn text from the top of the captcha image
    from_top = 4
    assert len(challenge) > 0
    text = challenge

    fontpath = Settings.CAPTCHA_FONT_PATH

    if fontpath.lower().strip().endswith('ttf'):
        font = ImageFont.truetype(fontpath, Settings.CAPTCHA_FONT_SIZE * scale)
    else:
        font = ImageFont.load(fontpath)

    if Settings.CAPTCHA_IMAGE_SIZE:
        size = Settings.CAPTCHA_IMAGE_SIZE
    else:
        size = getsize(font, text)
        size = (size[0] * 2, int(size[1] * 1.4))

    image = makeimg(size)

    xpos = 2

    for char in text:
        fgimage = Image.new('RGB', size, Settings.CAPTCHA_FOREGROUND_COLOR)
        charimage = Image.new('L', getsize(font, ' %s ' % char), '#000000')
        chardraw = ImageDraw.Draw(charimage)
        chardraw.text((0, 0), ' %s ' % char, font=font, fill='#ffffff')
        if Settings.CAPTCHA_LETTER_ROTATION:
            charimage = charimage.rotate(random.randrange(*Settings.CAPTCHA_LETTER_ROTATION), expand=0,
                                         resample=Image.BICUBIC)
        charimage = charimage.crop(charimage.getbbox())
        maskimage = Image.new('L', size)

        maskimage.paste(charimage, (xpos, from_top, xpos + charimage.size[0], from_top + charimage.size[1]))
        size = maskimage.size
        image = Image.composite(fgimage, image, maskimage)
        xpos = xpos + 2 + charimage.size[0]

    if Settings.CAPTCHA_IMAGE_SIZE:
        # centering captcha on the image
        tmpimg = makeimg(size)
        tmpimg.paste(image, (int((size[0] - xpos) / 2), int((size[1] - charimage.size[1]) / 2 - from_top)))
        image = tmpimg.crop((0, 0, size[0], size[1]))
    else:
        image = image.crop((0, 0, xpos + 1, size[1]))
    draw = ImageDraw.Draw(image)

    for f in Settings.CAPTCHA_NOISE_FUNCTIONS:
        draw = f(draw, image)
    for f in Settings.CAPTCHA_FILTER_FUNCTIONS:
        image = f(image)

    out = StringIO()
    image.save(out, "PNG")
    out.seek(0)
    return out
