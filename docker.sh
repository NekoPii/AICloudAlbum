echo  '{
  "log-driver":"json-file",
  "log-opts": {"max-size":"500m", "max-file":"3"}
}' > /etc/docker/daemon.json

systemctl daemon-reload
systemctl restart docker