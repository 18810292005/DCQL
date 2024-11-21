import os
from pathlib import Path


def load_settings():
    if os.environ.get("DJANGO_SETTINGS_MODULE") is None:
        candidates = (
            'local_settings_dev.py',
            'local_settings.py',
            'prod_settings.py'
        )
        basedir = Path(__file__).parent
        for candidate in candidates:
            file = basedir / candidate
            if file.exists():
                settings_path = 'mgedata.' + candidate[:-3]
                break
        else:
            print(f"Cannot find {', '.join(candidates)}. Using settings.py")
            settings_path = 'mgedata.settings'

        os.environ["DJANGO_SETTINGS_MODULE"] = settings_path
