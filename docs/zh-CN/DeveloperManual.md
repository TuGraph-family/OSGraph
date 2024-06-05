## 1.拉取准备的编译容器
    docker pull registry.cn-chengdu.aliyuncs.com/nextgraph/webbuild:202405.2
## 2.启动容器
    docker run --name=build -p 80:80 -itd registry.cn-chengdu.aliyuncs.com/nextgraph/webbuild:202405.2
## 3.获取osgraph代码
    docker exec -it build bash
    cd /home/admin/app
    git clone https://github.com/TuGraph-family/OSGraph.git
## 4.开发代码

## 5.编译代码
    cd OSGraph/
    bash bin/build-osgraph.sh
    exit
## 5.配置依赖参数
### 5.1 拉取数据库镜像
    docker pull mariadb:latest
### 5.2 启动数据库镜像
    docker run --name=mysql -p 3306:3306  -e MARIADB_USER=mysql -e MARIADB_PASSWORD='tuMaker0520@' -e MARIADB_ROOT_PASSWORD='tuMaker0520@' -itd mariadb:latest

    #获取mysql 容器的ip
    docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' mysql 
### 5.3 配置依赖的环境变量
 
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

### 5.3 环境变量生效
    # 保证tumaker-env文件里的注释清理掉，没有空格
    source bin/tumaker-env
## 6.启动服务验证
    cd OSGraph/
    bash bin/startup-osgraph.sh
## 7.浏览器验证

     http://127.0.0.1

