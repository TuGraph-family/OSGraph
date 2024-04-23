#!/bin/bash
echo "pre install maven >= 3.6.3"
echo "pre install npm"
#npm run build 和 dist
echo "build osgraph-service"
mkdir -p ~/.m2/repository/com/alipay/tumaker/
cp -r osgraph-service/libs/tumaker-serviceplugin-devops ~/.m2/repository/com/alipay/tumaker/
cp -r osgraph-service/libs/tumakertugraphdb-parent ~/.m2/repository/com/alipay/tumaker/
cd osgraph-service
mvn clean install -Dmaven.test.skip=true
cp -r target ../
cd ../
echo "build osgraph-web"
cd osgraph-web
npm run build
mv dist ../
cd ../
echo "please set mysql, es, tugraphdb in target/config/application.properties"
echo "start service, default port is 9000"

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


