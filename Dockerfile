FROM python:3.8
MAINTAINER nekoMJX
ENV PYTHONUNBUFFERED 1
RUN apt-get update && apt-get install -y gettext python3-dev libpq-dev && \
    apt-get install -y build-essential cmake libgtk-3-dev \
    libboost-all-dev libopenblas-dev liblapack-dev libatlas-base-dev libblas-dev \
    gfortran libhdf5-serial-dev openssl ffmpeg wget
RUN mkdir -p /AICloudAlbum
WORKDIR /AICloudAlbum
ADD . /AICloudAlbum
RUN pip install --upgrade pip
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
EXPOSE 80 8000 9192