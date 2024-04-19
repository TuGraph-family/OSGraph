#初始化数据库
bash /conf/db/tumaker/tumaker_create_table.sh
bash /conf/db/tumaker/tumaker_update_table.sh

#start nginx
/usr/sbin/nginx -c /home/admin/release/run/target/config/nginx-conf/nginx.conf
#start java
java -Xms3800m -Xmx3800m -Xmn1500m -Xss512k -XX:PermSize=512m -XX:MaxPermSize=512m -Duser.timezone=Asia/Shanghai -Ddbmode=stable  -Dzmode=false -Dspring.config.additional-location=/home/admin/release/run/target/bin/../config/ -Dspring.profiles.active=prod -classpath /home/admin/release/run/target/bin/../boot/tumaker-bootstrap-1.0.1-executable org.springframework.boot.loader.JarLauncher

