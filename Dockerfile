FROM python:3.8
MAINTAINER nekoMJX
ENV PYTHONUNBUFFERED 1
RUN mkdir -p /AICloudAlbum
WORKDIR /AICloudAlbum
ADD . /AICloudAlbum
RUN cp /AICloudAlbum/sources.list /etc/apt/sources.list
RUN apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 40976EAF437D05B5 && \
    apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 3B4FE6ACC0B21F32
RUN apt-get update && \
    apt-get install -y build-essential libboost-all-dev cmake libx11-dev libgtk-3-dev pkg-config libboost-python-dev \
    libopenblas-dev liblapack-dev libatlas-base-dev libblas-dev gfortran \
    libhdf5-serial-dev openssl libssl-dev libpcre3 libpcre3-dev zlib1g-dev \
    gettext libpq-dev \
    libcrypto++-dev python-setuptools python3-setuptools \
    gfortran libhdf5-serial-dev openssl ffmpeg wget

RUN pip install --upgrade pip -i https://mirrors.aliyun.com/pypi/simple/
RUN pip install supervisor daphne pymysql django-simple-captcha django-compressor matplotlib opencv-python -i https://mirrors.aliyun.com/pypi/simple/
##RUN if [ ! -f "tensorflow-2.4.0-cp37-none-linux_aarch64.whl" ];  \
##    then wget https://github.com/lhelontra/tensorflow-on-arm/releases/download/v2.4.0/tensorflow-2.4.0-cp37-none-linux_aarch64.whl; \
##    fi
#RUN pip install tensorflow-2.4.0-cp37-none-linux_aarch64.whl
RUN pip install -r /AICloudAlbum/requirements.txt -i https://mirrors.aliyun.com/pypi/simple/
RUN rm -r static
RUN yes yes | python manage.py compress
RUN mkdir -p collect_static
RUN yes yes | python manage.py collectstatic
RUN echo_supervisord_conf > /etc/supervisord.conf
RUN supervisord -c /AICloudAlbum/supervisord.conf
RUN supervisorctl start daphne
EXPOSE 80 8000 9194