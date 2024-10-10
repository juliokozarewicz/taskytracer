FROM nginx:alpine

COPY nginx.conf.template /etc/nginx/nginx.conf.template

COPY errors /etc/nginx/html/errors

RUN apk add --no-cache gettext

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]