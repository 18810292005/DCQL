#!/bin/sh
export CHROME_PATH=/dev/null
exec poetry run python manage.py runserver 0.0.0.0:8000