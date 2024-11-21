#!/bin/sh
export CHROME_PATH=/dev/null
poetry run python manage.py collectstatic --noinput
poetry run python manage.py migrate
exec poetry run python manage.py runserver 0.0.0.0:8000