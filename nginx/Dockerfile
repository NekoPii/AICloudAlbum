FROM nginx:latest
EXPOSE 443 80 9191
RUN rm /etc/nginx/conf.d/default.conf \
    && mkdir -p /AICloudAlbum_log \
    && mkdir -p /usr/share/nginx/html/static \
    && mkdir -p /usr/share/nginx/ssl
ADD ./nginx/nginx.conf  /etc/nginx/conf.d/
#ADD ./nginx/cert/ /etc/nginx