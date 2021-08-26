#!/bin/sh
sudo apt-get update
sudo apt-get -y install python3.8
sudo apt-get -y install nginx
sudo apt-get -y install build-essential cmake
sudo apt-get -y install libgtk-3-dev
sudo apt-get -y install libboost-all-dev
sudo apt-get -y install ffmpeg

pip install --upgrade pip
pip install -r requirements.txt -i https://mirrors.aliyun.com/pypi/simple/

mkdir ~/AICloudAlbum
cp -r . ~/AICloudAlbum
cd ~/AICloudAlbum

rm -r static
yes yes | python3.8 manage.py compress
mkdir collect_static
yes yes | python3.8 manage.py collectstatic

supervisord
supervisorctl start daphne
mkdir /etc/nginx/conf/cert
mv -f ./nginx/cert /etc/nginx/conf/cert/
mv -f ./nginx/nginx.conf /etc/nginx/conf/nginx.conf

cd /etc/nginx/sbin
./nginx -s reload