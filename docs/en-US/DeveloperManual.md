## 1.Pull the prepared compilation container
    docker pull registry.cn-chengdu.aliyuncs.com/nextgraph/webbuild:202405.2
## 2.Starter container
    docker run --name=build -p 80:80 -itd registry.cn-chengdu.aliyuncs.com/nextgraph/webbuild:202405.2
## 3.Get the OSGraph code
    docker exec -it build bash
    cd /home/admin/app
    git clone https://github.com/TuGraph-family/OSGraph.git
## 4.Development code

## 5.Compiled code
    cd OSGraph/
    bash bin/build-osgraph.sh
    exit
## 5.Configuration parameter

### 5.1 Pull  database image
    docker pull mariadb:latest
### 5.2 Start database mirroring
    docker run --name=mysql -p 3306:3306  -e MARIADB_USER=mysql -e MARIADB_PASSWORD='tuMaker0520@' -e MARIADB_ROOT_PASSWORD='tuMaker0520@' -itd mariadb:latest

    #get the IP address of a MySQL container
    docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' mysql 
### 5.3 Configure dependent environment variables

    docker exec -it build bash
    #obtain the addresses of the pre-prepared Elasticsearch cluster and Tugraph-DB cluster
    #configure environment variables
    cd OSGraph/
    vi bin/tumaker-env

    export LANG=zh_CN.UTF-8
    #configure mysql
    export TUMAKER_DB_HOST=172.17.0.1 #Database IP obtained after executing the query in version 5.2
    export TUMAKER_DB_PORT=3306
    export TUMAKER_DB_USER=root
    export TUMAKER_DB_PASSWORD=tuMaker0520@
    #configure es
    export ES_HOST=1.1.1.1 #pre-prepared Elasticsearch cluster
    export ES_PORT=9200
    export ES_USERNAME=elastic 
    export ES_PASSWORD=elastic 
    #configure TuGraph-DB
    export TUGRAPHDB_HOST=1.1.1.1 #pre-prepared TuGraph-DB address
    export TUGRAPHDB_PORT=7687 #pre-prepared TuGraph-DB BOLT port
    export TUGRAPHDB_USER=tugraph 
    export TUGRAPHDB_PASSWORD=tuGraph 
    export TUGRAPHDB_NAME=default #TuGraph-DB Graph Database Table Name

### 5.3 Environment variables take effect
    Ensure that the tumaker-env file has comments removed and there are no trailing spaces.
    source bin/tumaker-env
## 6.Start service verification
    cd OSGraph/
    bash bin/startup-osgraph.sh
## 7.Browser verification
    http://127.0.0.1

