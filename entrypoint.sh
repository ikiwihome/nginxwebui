#!/bin/sh

cd /data/nginxwebui
exec java -jar -Dfile.encoding=UTF-8 -Xmx64m nginxwebui.jar ${BOOT_OPTIONS} > /dev/null
