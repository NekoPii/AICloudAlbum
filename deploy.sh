#!/bin/sh
apt-get update
apt-get upgrade
apt-get install -y sudo
apt-get install -y vim

sudo cp -f ./sources.list /etc/apt/sources.list
sudo apt install -y software-properties-common
sudo add-apt-repository ppa:deadsnakes/ppa
sudo apt-get update
sudo apt-get upgrade
sudo apt-get install -y python3.8
sudo apt-get install -y pip
sudo apt-get install -y wget
sudo apt-get install -y build-essential cmake
sudo apt-get install -y gcc-6 g++-6
sudo apt-get install -y libgtk-3-dev
sudo apt-get install -y libboost-all-dev
sudo apt-get install -y libopenblas-dev liblapack-dev libatlas-base-dev libblas-dev gfortran
sudo apt-get install -y libhdf5-serial-dev
sudo apt-get install -y openssl
sudo apt-get install -y ffmpeg

#mkdir ~/download
#cd ~/download
#wget https://mirrors.tuna.tsinghua.edu.cn/anaconda/archive/Anaconda3-2021.05-Linux-aarch64.sh
#sh -y Anaconda3-2021.05-Linux-aarch64.sh
#rm Ana*.sh

sudo pip install --upgrade pip
sudo pip install Cython
#sudo pip install --upgrade https://storage.googleapis.com/tensorflow/linux/cpu/tensorflow_cpu-2.6.0-cp38-cp38-manylinux2010_x86_64.whl
sudo pip install -r requirements.txt -i https://mirrors.aliyun.com/pypi/simple/

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
rm nginx-*.tar.gz
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