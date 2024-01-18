import base64
from io import BytesIO

import qrcode
from PIL import Image


def make_qr_code(text: str):
    with open('apps/certificate/stamp.png', 'rb') as fp:
        stamp = Image.open(fp)

        qr = qrcode.QRCode(border=0)
        qr.add_data(text)
        img = qr.make_image(fill_color="#c78242", back_color="transparent")
        shadow = qr.make_image(fill_color="#000000", back_color="transparent")
        img = img.resize((int(stamp.size[0] / 1.8), int(stamp.size[1] // 1.8)))
        shadow = shadow.resize(img.size)
        pos = int((stamp.size[0] - img.size[0]) / 2), int((stamp.size[1] - img.size[1]) / 2)
        stamp.paste(shadow, (pos[0] + 3, pos[1] + 3), shadow)
        stamp.paste(img, pos, img)
        buffer = BytesIO()
        stamp.save(buffer, format="PNG")
        return base64.b64encode(buffer.getvalue()).decode()
