#!/bin/sh
apt-get update
apt-get install -y sudo

sudo apt-get update
sudo apt-get install -y wget
sudo apt-get install -y python3.8
sudo apt-get install -y pip
sudo apt-get install -y build-essential cmake
sudo apt-get install -y libgtk-3-dev
sudo apt-get install -y libboost-all-dev
sudo apt-get install -y gfortran
sudo apt-get install -y libopenblas-dev liblapack-dev libatlas-base-dev libblas-dev
sudo apt-get install -y openssl
sudo apt-get install -y ffmpeg

pip install --upgrade pip
pip install Cython
pip install -r requirements.txt -i https://mirrors.aliyun.com/pypi/simple/

mkdir ~/AICloudAlbum
cp -r . ~/AICloudAlbum
cd ~/AICloudAlbum

rm -r static
yes yes | python3.8 manage.py compress
mkdir collect_static
yes yes | python3.8 manage.py collectstatic

cd /usr/local
mkdir nginx
cd /usr/local/nginx
wget http://nginx.org/download/nginx-1.19.7.tar.gz
tar -zxvf nginx-1.19.7.tar.gz
cd /usr/local/nginx/nginx-1.19.7
./configure --prefix=/usr/local/nginx --with-http_ssl_module
make install
cd /usr/local/nginx/conf
mkdir cert
mv -f ./nginx/cert /usr/local/nginx/conf/cert/
mv -f ./nginx/nginx.conf /usr/local/nginx/conf/nginx.conf
cd /usr/local/nginx/sbin
./nginx -s reload

supervisord
supervisorctl start daphne