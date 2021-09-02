#!/bin/sh
python="python3.8"
pip_source="https://mirrors.aliyun.com/pypi/simple/"
nginx_Download="http://nginx.org/download/nginx-1.19.7.tar.gz"
nginx="nginx-1.19.7"

apt-get update
apt-get upgrade
apt-get install -y sudo vim
sudo cp -f ./sources.list /etc/apt/sources.list
sudo apt-get update
sudo apt-get upgrade -y

sudo apt-get install -y $python
sudo apt-get install -y python3-pip
sudo $python pip3 install --upgrade pip -i $pip_source
sudo $python pip install --upgrade pip -i $pip_source
sudo apt-get install -y build-essential cmake
sudo apt-get install -y libgtk-3-dev libboost-all-dev
sudo apt-get install -y libopenblas-dev liblapack-dev libatlas-base-dev libblas-dev gfortran
sudo apt-get install -y libhdf5-serial-dev openssl libssl-dev libpcre3 libpcre3-dev zlib1g-dev
sudo apt-get install -y ffmpeg wget

#sudo pip install --upgrade https://storage.googleapis.com/tensorflow/linux/cpu/tensorflow_cpu-2.6.0-cp38-cp38-manylinux2010_x86_64.whl
sudo $python -m pip install -r requirements.txt -i $pip_source

cd /
mkdir -p /AICloudAlbum
cp -r . /AICloudAlbum
cd /AICloudAlbum

rm -r static
yes yes | $python manage.py compress
mkdir -p collect_static
yes yes | $python manage.py collectstatic


# Build Nginx
cd /usr/local
mkdir nginx
cd /usr/local/nginx
rm nginx-*.tar.gz
wget $nginx_Download
tar -zxvf "$nginx".tar.gz
cd /usr/local/nginx/$nginx
./configure --prefix=/usr/local/nginx --with-http_ssl_module
make && make install
cd /usr/local/nginx/conf
mkdir -p cert
mv -f ./nginx/cert /usr/local/nginx/conf/cert/
mv -f ./nginx/nginx.conf /usr/local/nginx/conf/nginx.conf
cd /usr/local/nginx/sbin
./nginx
./nginx -s reload

# Build Supervisor
supervisord -c supervisord.conf
supervisorctl start daphne