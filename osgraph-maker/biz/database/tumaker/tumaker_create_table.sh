#!/bin/bash
create_database_sql=tumaker_create_db.sql
src_sql=tumaker_ddl.sql
dml_sql=tumaker_init_dml.sql
database_name=tumaker
#暂时用antgraph库
mysql_host=${TUMAKER_DB_HOST}
password=${TUMAKER_DB_PASSWORD}
sql_dir=/conf/db/tumaker/
grep "DEFAULT CHARSET = utf8mb4  COMMENT =" ${sql_dir}$src_sql
if [ $? != 0 ]; then
    sed -i "s/AUTO_INCREMENT =/ENGINE=InnoDB ROW_FORMAT=dynamic AUTO_INCREMENT =/g" ${sql_dir}$src_sql
    sed -i "s/COMPRESSION = 'lz4_1.0' REPLICA_NUM = 3 BLOCK_SIZE = 16384 USE_BLOOM_FILTER = FALSE TABLET_SIZE = 134217728 PCTFREE = 10//g" ${sql_dir}$src_sql
    sed -i "s/BLOCK_SIZE 16384//g" ${sql_dir}$src_sql
    sed -i "s/varchar(40000)/varchar(4000)/g" ${sql_dir}$src_sql
    #clome_num=$(cat ${sql_dir}$src_sql |grep -n 'PRIMARY KEY (`instance_name`, `record_name`)' |awk -F ":" '{print $1}')
    #echo $clome_num
    #echo "============="
    #sed "$clome_num i PRIMARY KEY (`id`)," $src_sql
    #sed -i '/PRIMARY KEY (`instance_name`, `record_name`)/i\\  PRIMARY KEY (`id`),' ${sql_dir}$src_sql
    #sed -i 's/PRIMARY KEY (`instance_name`, `record_name`)/UNIQUE KEY (`instance_name`, `record_name`)/g' ${sql_dir}$src_sql
fi
sed -i 's/ROW_FORMAT=COMPACT/ROW_FORMAT=DYNAMIC/g' ${sql_dir}$src_sql
#mysql -h $mysql_host -u root -p${password} -se "drop database if exists $database_name"
mysql -h $mysql_host -u root -p${password} < ${sql_dir}$create_database_sql
mysql -h $mysql_host -u root -p${password} -D$database_name < ${sql_dir}$src_sql
mysql -h $mysql_host -u root -p${password} -D$database_name < ${sql_dir}$dml_sql
