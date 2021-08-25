#!/bin/sh
python manage.py compress
mkdir collect_static
yes yes | python manage.py collectstatic
pip install -r requirements.txt