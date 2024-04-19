#!/bin/bash

yum install -y nginx

#增加一个组
groupadd admin
#增加用户
useradd -g admin -m  admin
echo "export LANG=zh_CN.UTF-8" >> cat /etc/profile
#目录

cd /home/admin/release/run

tar -zxf target.tar.gz
cd /home/admin/release/run/target/boot && jar -xvf tumaker-bootstrap-1.0.1-executable.jar && mkdir -p tumaker-bootstrap-1.0.1-executable && mv BOOT-INF META-INF org tumaker-bootstrap-1.0.1-executable/


mkdir -p /home/admin/release/run/target/webroot/view
#移动前端资源
#cp -r /home/admin/static-assets /home/admin/release/run/target/webroot/view/
chown -R admin:admin /home/admin
# 设置日志滚动
cp /conf/config/tumaker_logrotate_conf /etc/logrotate.d/tumaker
chown root:root /etc/logrotate.d/tumaker
chmod 644 /etc/logrotate.d/tumaker
#清理
rm -rf /home/admin/release/run/target.tar.gz
#rm -rf /home/admin/static-assets*
