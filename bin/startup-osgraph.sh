#!/bin/bash
set -x
workdir=`pwd`
#初始化数据库
mkdir -p /conf/db/tumaker
cp -r osgraph-service/biz/database/tumaker/* /conf/db/tumaker/
bash /conf/db/tumaker/tumaker_create_table.sh
bash /conf/db/tumaker/tumaker_update_table.sh
cd ${workdir}

#!/bin/bash
echo "please set mysql, es, tugraphdb in target/config/application.properties"
echo "start service, default port is 8888, nginx port is 80"

#start nginx
dir=/home/admin/release/run
/usr/sbin/nginx -c ${dir}/target/config/nginx-conf/nginx.conf
#start java
java -Xms3800m -Xmx3800m -Xmn1500m -Xss512k -XX:PermSize=512m -XX:MaxPermSize=512m   -Dzmode=false -Dspring.config.additional-location=${dir}/target/config/ -Dspring.profiles.active=prod -classpath ${dir}/target/boot/tumaker-bootstrap-1.0.1-executable org.springframework.boot.loader.JarLauncher
