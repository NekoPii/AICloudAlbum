echo  '{
  "log-driver":"json-file",
  "log-opts": {"max-size":"500m", "max-file":"3"}
}' > /etc/docker/daemon.json

systemctl daemon-reload
systemctl restart docker

# Docker 必须映射端口才能访问
docker run -it -p 80:80 -p 443:443 -p 9194:9194 ubuntu:18.04 /bin/bash

apt-get update
apt-get install -y git

cd /
rm -r AICloudAlbum
git clone https://github.com/NeKoSaNnn/AICloudAlbum.git
until(($? == 0))
do
  rm -r AICloudAlbum
  git clone https://github.com/NeKoSaNnn/AICloudAlbum.git
  if [ $? -eq 0 ];then
    break
  fi
done
cd AICloudAlbum
git checkout mjx
sh deploy.sh