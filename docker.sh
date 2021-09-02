echo  '{
  "log-driver":"json-file",
  "log-opts": {"max-size":"500m", "max-file":"3"}
}' > /etc/docker/daemon.json

systemctl daemon-reload
systemctl restart docker

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
