#!/bin/sh

cd /data/nginxwebui
exec java -Xmx128m -jar -Dfile.encoding=UTF-8 nginxwebui.jar ${BOOT_OPTIONS} > /dev/null
