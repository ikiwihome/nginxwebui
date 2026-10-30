FROM alpine:3.24.3
ENV LANG=zh_CN.UTF-8 \
    TZ=Asia/Shanghai \
    PS1="\u@\h:\w \$ "
ENV BOOT_OPTIONS="--server.port=8080"
ENV project.home="/data/nginxwebui/"
RUN apk add --update --no-cache \
    nginx \
    nginx-mod-stream \
    nginx-mod-stream-geoip \
    nginx-mod-stream-geoip2 \
    nginx-mod-stream-js \
    nginx-mod-stream-keyval \
    nginx-mod-http-headers-more \
    nginx-mod-http-js \
    nginx-mod-http-keyval \
    nginx-mod-http-lua \
    nginx-mod-http-brotli \
    nginx-mod-rtmp \
    nginx-mod-mail \
    nginx-mod-http-geoip \
    nginx-mod-http-geoip2 \
    nginx-mod-http-zip \
    nginx-mod-http-zstd \
    nginx-mod-http-perl \
    nginx-mod-http-upload \
    nginx-mod-http-upload-progress \
    nginx-mod-http-upstream-fair \
    nginx-mod-http-echo \
    nginx-mod-http-cache-purge \
    nginx-mod-dynamic-upstream \
    nginx-mod-dynamic-healthcheck \
    openjdk8-jre \
    net-tools \
    nano \
    curl \
    wget \
	vim \
    ttf-dejavu \
    fontconfig \
    tzdata \
    logrotate \
    tini \
    acme.sh \
    && fc-cache -f -v \
    && ln -sf /usr/share/zoneinfo/${TZ} /etc/localtime \
    && echo "${TZ}" > /etc/timezone \
	&& nginx -v \
	&& nginx -V \
    && rm -rf /var/cache/apk/* /tmp/*
COPY target/nginxwebui-*.jar /data/nginxwebui/nginxwebui.jar
COPY entrypoint.sh /entrypoint.sh
RUN ["chmod", "+x", "/entrypoint.sh"]
# VOLUME ["/home/nginxWebUI"]
ENTRYPOINT ["tini", "/entrypoint.sh"]
