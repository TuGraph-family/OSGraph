#!/bin/bash
#set -x
src_gql=tumaker_ddl.sql
database_name=tumaker
dml_sql=tumaker_init_dml.sql
mysql_host=${TUMAKER_DB_HOST}
password=${TUMAKER_DB_PASSWORD}
sql_dir=/conf/db/tumaker/
grep "DEFAULT CHARSET = utf8mb4  COMMENT =" -r ${sql_dir}${src_gql}
if [ $? != 0 ]; then
    sed -i "s/AUTO_INCREMENT =/ENGINE=InnoDB ROW_FORMAT=dynamic AUTO_INCREMENT =/g" ${sql_dir}${src_gql}
    sed -i "s/COMPRESSION = 'lz4_1.0' REPLICA_NUM = 3 BLOCK_SIZE = 16384 USE_BLOOM_FILTER = FALSE TABLET_SIZE = 134217728 PCTFREE = 10//g" ${sql_dir}${src_gql}
    sed -i "s/BLOCK_SIZE 16384//g" ${sql_dir}${src_gql}
    sed -i "s/TABLEGROUP = 'tg_tumaker'//g" ${sql_dir}${src_gql}
    sed -i "s/varchar(40000)/varchar(4000)/g" ${sql_dir}${src_gql}
    #clome_num=$(cat ${sql_dir}${src_gql} |grep -n 'PRIMARY KEY (`instance_name`, `record_name`)' |awk -F ":" '{print $1}')
    #echo ${clome_num}
    #echo "============="
    #sed -i '/PRIMARY KEY (`instance_name`, `record_name`)/i\\  PRIMARY KEY (`id`),' ${sql_dir}${src_gql}
    #sed -i 's/PRIMARY KEY (`instance_name`, `record_name`)/UNIQUE KEY (`instance_name`, `record_name`)/g' ${sql_dir}${src_gql}
fi
careteTableExist=`grep "IF NOT EXISTS" ${sql_dir}${src_gql}`
if [ -z $careteTableExist ]; then
  sed -i "s/CREATE TABLE/CREATE TABLE IF NOT EXISTS/g" ${sql_dir}${src_gql}
fi
sed -i 's/ROW_FORMAT=COMPACT/ROW_FORMAT=DYNAMIC/g' ${sql_dir}${src_sql}

# 同步表
mysql -h $mysql_host -u root -p$password -D$database_name < ${sql_dir}${src_gql}
#cat ${sql_dir}${src_gql} |grep "CREATE TABLE" |awk -F '`' '{print $2}'

#同步表结构
cat ${sql_dir}${src_gql} | while read rows
do
  if [[ ${rows} =~ "CREATE TABLE" ]]; then
    table=$(echo ${rows} |awk -F '`' '{print $2}')
    echo ${table}
  fi
  if [[ ${rows} =~ "COMMENT '" ]]; then
    row=$(echo ${rows} |awk -F ',' '{print $1}')
    mysql -h ${mysql_host} -u root -p${password} -D${database_name} -se "ALTER TABLE \`${table}\` ADD COLUMN ${row};"
    echo $?
  fi
done
#同步初始化数据
mysql -h $mysql_host -u root -p$password -D$database_name < ${sql_dir}$dml_sql
