#!/bin/bash
echo "please set mysql, es, tugraphdb in target/config/application.properties"
echo "start service, default port is 8888, nginx port is 80"

#start nginx
dir=`pwd`
/usr/sbin/nginx -c ${dir}/osgraph-service/conf/nginx.conf
#start java
cd target/boot/
jar -xvf tumaker-bootstrap-1.0.1-executable.jar
mkdir -p tumaker-bootstrap-1.0.1-executable
mv BOOT-INF META-INF org tumaker-bootstrap-1.0.1-executable/
cd ${dir}
java -Xms3800m -Xmx3800m -Xmn1500m -Xss512k -XX:PermSize=512m -XX:MaxPermSize=512m   -Dzmode=false -Dspring.config.additional-location=${dir}/target/config/ -Dspring.profiles.active=prod -classpath ${dir}/target/boot/tumaker-bootstrap-1.0.1-executable org.springframework.boot.loader.JarLauncher
