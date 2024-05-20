#!/bin/bash
workdir=`pwd`
echo "build osgraph-service"
mkdir -p ~/.m2/repository/com/alipay/tumaker/
cp -r osgraph-service/libs/tumaker-serviceplugin-devops ~/.m2/repository/com/alipay/tumaker/
cp -r osgraph-service/libs/tumakertugraphdb-parent ~/.m2/repository/com/alipay/tumaker/
cd osgraph-service
mvn clean install -Dmaven.test.skip=true
cd ../
cp -r target /home/admin/release/run/
mkdir -p /home/admin/release/run/target/boot/tumaker-bootstrap-1.0.1-executable
rm -rf /home/admin/release/run/target/boot/tumaker-bootstrap-1.0.1-executable/*
cd /home/admin/release/run/target/boot
jar -xvf tumaker-bootstrap-1.0.1-executable.jar
cd $workdir

echo "build osgraph-web"
cd osgraph-web
npm install -g typescript
npm install

npm run build
mkdir -p /home/admin/release/run/target/webroot/view
cd ../
mv dist /home/admin/release/run/target/webroot/view

