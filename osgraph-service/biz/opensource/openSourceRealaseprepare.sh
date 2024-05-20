#!/bin/bash
#去除target
targetList="app/common/dal/dal-core/target
app/bootstrap/target
app/common/facade/target
app/common/util/target
app/core/model/target
app/core/service/target
app/spi/agent/agent-all/target
app/spi/agent/agent-core/target
app/spi/agent/agent-ssh/target
dalgen/mybatis-plus-gen/target
app/web/home/target
app/spi/spi-core/target
app/common/dal/dal-jdbc/target
app/biz/shared/target"
for line in ${targetList}
do
  echo $line
  rm -rf $line
done
#移动配置
mv conf/build-osgraph.sh ../bin/
mv conf/start-osgraph.sh ../bin/

#去除开源的脚本
rm -rf biz/opensource
