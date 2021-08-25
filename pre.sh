#!/bin/sh
rm -r static
python manage.py compress
mkdir collect_static
yes yes | python manage.py collectstatic
pipreqs ./ --encoding=utf-8 --force
#pip install -r requirements.txt