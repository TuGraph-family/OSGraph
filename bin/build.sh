#!/bin/bash
echo "please set mysql, es, tugraphdb in env"
echo "start service, default port is 8888, nginx port is 80"
set -x
#!/bin/bash
workdir=`pwd`
echo "build osgraph-service"
mkdir -p ~/.m2/repository/com/alipay/tumaker/
cp -r osgraph-service/libs/tumaker-serviceplugin-core ~/.m2/repository/com/alipay/tumaker/
cp -r osgraph-service/libs/tumakertugraphdb-parent ~/.m2/repository/com/alipay/tumaker/
#cp -r osgraph-service/libs/tumakertugraphdb-core ~/.m2/repository/com/alipay/tumaker/
cd osgraph-service
mvn install:install-file -DgroupId=com.alipay.tumaker -DartifactId=tumaker-serviceplugin-core -Dversion=1.0.1 -Dpackaging=jar -Dfile=./libs/tumaker-serviceplugin-core/1.0.1/tumaker-serviceplugin-core-1.0.1.jar
mvn install:install-file -DgroupId=com.alipay.tumaker -DartifactId=tumakertugraphdb-core -Dversion=1.0.1-SNAPSHOT -Dpackaging=jar -Dfile=./libs/tumakertugraphdb-core/1.0.1-SNAPSHOT/tumakertugraphdb-core-1.0.1-SNAPSHOT.jar
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
