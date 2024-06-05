
## 1.环境准备
### 1.1TuGraph-DB环境准备
当前TuGraph-DB为OSGraph定制化开发了一个版本，请拉取镜像获取响应版本，镜像内置了部分样例数据。未来会基于标准版本实现OSGraph全链路。

    #拉取TuGraph-DB for OSGraph镜像
    docker pull tugraph/tugraph-db-osgraph:4.3.0
    #启动db镜像服务
    docker run -dt --privileged -p 7070:7070 -p 7687:7687 --name osgraph_db_server tugraph/tugraph-db-osgraph:4.3.0 lgraph_server
    #登录验证TuGraph-DB服务正常启动
    http://127.0.0.1:7070

### 1.2ES环境准备
当前OSGraph需要ElasticSearch实现Repo和User的检索，版本要求为8.9.0。未来计划支持mysql全文索引，降低开发环境的资源成本。
如下提供ES官方镜像的部署以及样例数据导入的示例：

    #拉取es官方镜像，版本要求8.9.0
    docker pull elasticsearch:8.9.0
    #启动es镜像
    docker run -d --name elasticsearch -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" elasticsearch:8.9.0
    #进到镜像里
    docker exec -it elasticsearch /bin/bash
    #执行数据生成脚本
    echo '{"index":{"_index":"github_repo","_id":"528766495"}}
    {"id":528766495,"name":"TuGraph-family/tugraph-db","star":1026}
    {"index":{"_index":"github_repo","_id":"81810486"}}
    {"id":81810486,"name":"antvis/G6","star":10748}
    {"index":{"_index":"github_user","_id":"827205"}}
    {"id":827205,"name":"DanielRuf"}
    {"index":{"_index":"github_user","_id":"2311313"}}
    {"id":2311313,"name":"fanzhidongyzby"}
    {"index":{"_index":"github_user","_id":"1132769"}}
    {"id":1132769,"name":"hjk41"}' > /usr/share/elasticsearch/data/data.json
    #执行命令将数据导入ES
    curl -H "Content-Type: application/json" -XPOST "localhost:9200/_bulk" --data-binary @/usr/share/elasticsearch/data/data.json
    #注意：执行curl命令导入可能需要设置xpack.security.enabled为false，xpack.security设置为true时可能需要执行带身份认证的命令。具体数据导入操作请参考ES官网文档
    #备注：ES的初始化密码会打印在启动日志中，如忘记记录，可执行如下命令重置密码
    docker exec -it elasticsearch /usr/share/elasticsearch/bin/elasticsearch-setup-passwords auto -b
    #登录验证ES服务正常启动
    http://127.0.0.1:9200/

## 2.拉取准备的编译容器
    docker pull registry.cn-chengdu.aliyuncs.com/nextgraph/webbuild:202405.2
## 3.启动容器
    docker run --name=build -p 80:80 -itd registry.cn-chengdu.aliyuncs.com/nextgraph/webbuild:202405.2
## 4.获取osgraph代码
    docker exec -it build bash
    cd /home/admin/app
    git clone https://github.com/TuGraph-family/OSGraph.git
## 5.开发代码

## 6.编译代码
    cd OSGraph/
    bash bin/build-osgraph.sh
    exit
## 7.配置依赖参数
### 7.1 拉取数据库镜像
    docker pull mariadb:latest
### 7.2 启动数据库镜像
    docker run --name=mysql -p 3306:3306  -e MARIADB_USER=mysql -e MARIADB_PASSWORD='tuMaker0520@' -e MARIADB_ROOT_PASSWORD='tuMaker0520@' -itd mariadb:latest

    #获取mysql 容器的ip
    docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' mysql 
### 7.3 配置依赖的环境变量
 
    docker exec -it build bash
    #将提前准备的es集群，tugraph-db集群的地址 获取到
    #配置环境变量
    cd OSGraph/
    vi bin/tumaker-env

    export LANG=zh_CN.UTF-8
    #mysql配置
    export TUMAKER_DB_HOST=172.17.0.1 #数据库 5.2执行出来的ip
    export TUMAKER_DB_PORT=3306
    export TUMAKER_DB_USER=root
    export TUMAKER_DB_PASSWORD=tuMaker0520@
    #es集群配置
    export ES_HOST=127.0.0.1 #提前准备的es 集群
    export ES_PORT=9200
    export ES_USERNAME=elastic #es的配置的用户
    export ES_PASSWORD=elastic #es的配置的密码
    #TuGraph-DB配置
    export TUGRAPHDB_HOST=127.0.0.1 #提前准备的TuGraph-DB 地址
    export TUGRAPHDB_PORT=7687 #提前准备的TuGraph-DB BOLT 端口
    export TUGRAPHDB_USER=tugraph #提前准备的TuGraph-DB 用户
    export TUGRAPHDB_PASSWORD=tuGraph #提前准备的TuGraph-DB 密码
    export TUGRAPHDB_NAME=default #TuGraph-DB 图数据库表名

### 7.4 环境变量生效
    # 保证tumaker-env文件里的注释清理掉，没有空格
    source bin/tumaker-env
## 8.启动服务验证
    cd OSGraph/
    bash bin/startup-osgraph.sh
## 9.浏览器验证

     http://127.0.0.1

