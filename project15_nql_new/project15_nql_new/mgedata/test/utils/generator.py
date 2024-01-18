import random
from PIL import Image
from io import BytesIO


def generate_random_file(size=random.randint(5000, 10000)):
    ret = BytesIO()
    for _ in range(size):
        ret.write(random.randint(0, 255).to_bytes(1, byteorder='little'))
    ret.seek(0)
    return ret


def generate_random_picture(height=random.randint(100, 300), width=random.randint(100, 300)):
    image = Image.new("RGB", (height, width), (255, 255, 255))
    pixel = image.load()
    for x in range(height):
        for y in range(width):
            red = random.randrange(0, 255)
            blue = random.randrange(0, 255)
            green = random.randrange(0, 255)
            pixel[x, y] = (red, blue, green)
    ret = BytesIO()
    image.save(ret, format='PNG')
    ret.seek(0)
    return ret
