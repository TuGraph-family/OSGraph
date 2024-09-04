#!/bin/bash
echo "please set mysql, es, tugraphdb in env"
echo "start service, default port is 8888, nginx port is 80"
workdir=`pwd`
echo "build osgraph-service"
mkdir -p ~/.m2/repository/com/alipay/tumaker/
rm -rf ~/.m2/repository/com/alipay/tumaker/*
cp -r osgraph-service/libs/tumaker-serviceplugin-core ~/.m2/repository/com/alipay/tumaker/
cp -r osgraph-service/libs/tumakertugraphdb-parent ~/.m2/repository/com/alipay/tumaker/
cp -r osgraph-service/libs/tumakertugraphdb-core ~/.m2/repository/com/alipay/tumaker/
cd osgraph-service
mvn clean install -Dmaven.test.skip=true
cp -r target /home/admin/release/run/
mkdir -p /home/admin/release/run/target/boot/tumaker-bootstrap-1.0.1-executable
rm -rf /home/admin/release/run/target/boot/tumaker-bootstrap-1.0.1-executable/*
cd /home/admin/release/run/target/boot
jar -xvf tumaker-bootstrap-1.0.1-executable.jar
mv BOOT-INF  META-INF  org tumaker-bootstrap-1.0.1-executable/
cd $workdir

echo "build osgraph-web"
cd osgraph-web
npm install -g typescript
npm install

npm run build
mkdir -p /home/admin/release/run/target/webroot/view
rm -rf /home/admin/release/run/target/webroot/view/dist
cp -r dist /home/admin/release/run/target/webroot/view/
cd ${workdir}
