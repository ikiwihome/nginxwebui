FROM alpine:latest
ENV LANG=zh_CN.UTF-8 \
    TZ=Asia/Shanghai \
    PS1="\u@\h:\w \$ "
ENV BOOT_OPTIONS="--server.port=8080"
ENV project.home="/data/nginxwebui/"
ENV spring.database.type=mysql
ENV spring.datasource.url=jdbc:mysql://172.17.0.1:63306/nginxwebui
ENV spring.datasource.username=admin
ENV spring.datasource.password=
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.cloud.tencent.com/g' /etc/apk/repositories
RUN apk update
RUN apk add --update --no-cache \
       nginx \
       nginx-mod-stream \
       nginx-mod-http-headers-more \
       openjdk8-jre \
       net-tools \
       nano \
       curl \
       wget \
       ttf-dejavu \
       fontconfig \
       tzdata \
       tini \
       acme.sh \
    && fc-cache -f -v \
    && ln -sf /usr/share/zoneinfo/${TZ} /etc/localtime \
    && echo "${TZ}" > /etc/timezone \
    && rm -rf /var/cache/apk/* /tmp/*
COPY target/nginxwebui-*.jar /data/nginxwebui/nginxwebui.jar
COPY entrypoint.sh /entrypoint.sh
RUN ["chmod", "+x", "/entrypoint.sh"]
ENTRYPOINT ["tini", "entrypoint.sh"]