# add a user named live
sudo sh -c "echo -n 'live:' >> /etc/nginx/.htpasswd"
sudo sh -c "openssl passwd -apr1 >> /etc/nginx/.htpasswd"

