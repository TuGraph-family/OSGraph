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
echo "start service, default port is 9000"
