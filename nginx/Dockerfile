FROM nginx:latest
EXPOSE 443 80 9194
RUN rm /etc/nginx/conf.d/default.conf \
    && mkdir -p /AICloudAlbum_log \
    && mkdir -p /usr/share/nginx/html/static \
    && mkdir -p /usr/share/nginx/cert
ADD ./nginx.conf  /etc/nginx/conf.d/
COPY ./cert/* /usr/share/nginx/cert/
CMD ["nginx", "-g", "daemon off;"]
#ADD ./nginx/cert/ /etc/nginx