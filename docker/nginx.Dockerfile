FROM nginx:latest
COPY ./mge-nginx.conf /etc/nginx/conf.d/default.conf
COPY ./proxy_params /etc/nginx/proxy_params