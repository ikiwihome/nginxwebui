# Build the application inside Docker so a prebuilt target/ jar is not required.
FROM maven:3.9.9-eclipse-temurin-11 AS build
WORKDIR /build
COPY pom.xml docker-maven-settings.xml ./
COPY src/ src/
RUN mvn -B -s docker-maven-settings.xml -DskipTests package

# Docker Hub mirrors can be configured on the builder (Tencent's mirror requires its VPC).
FROM alpine:latest
ENV LANG=zh_CN.UTF-8 \
    TZ=Asia/Shanghai \
    PS1="\u@\h:\w \$ "
ENV BOOT_OPTIONS="--server.port=8080"
ENV project.home="/data/nginxwebui/"

# Change if required, for example, to use a different mirror or to add additional packages.
RUN sed -i 's|dl-cdn.alpinelinux.org|mirrors.cloud.tencent.com|g' /etc/apk/repositories \
    && apk add --update --no-cache \
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
COPY --from=build /build/target/nginxwebui-*.jar /data/nginxwebui/nginxwebui.jar
COPY entrypoint.sh /entrypoint.sh
RUN ["chmod", "+x", "/entrypoint.sh"]
# VOLUME ["/home/nginxWebUI"]
ENTRYPOINT ["tini", "/entrypoint.sh"]
