## 1.Environment setup
### 1.1TuGraph-DB Environment setup
Currently, a customized version of TuGraph-DB has been developed specifically for OSGraph. Please pull the corresponding image to obtain this version, which includes内置 sample data. In the future, full integration with OSGraph will be achieved based on the standard version.

    #Pull the TuGraph-DB image for OSGraph.
    docker pull tugraph/tugraph-db-osgraph:4.3.0
    #Start the database image service.
    docker run -dt --privileged -p 7070:7070 -p 7687:7687 --name osgraph_db_server tugraph/tugraph-db-osgraph:4.3.0 lgraph_server
    #Authenticate and verify the normal startup of the TuGraph-DB service.
    http://127.0.0.1:7070

### 1.2Prepare the Elasticsearch (ES) environment.
Currently, OSGraph requires Elasticsearch (ES) for repository and user search functionalities, with the specified version being 8.9.0. Plans are underway to support MySQL full-text indexing in the future, aimed at reducing the resource overhead for development environments.
Below is an example of deploying the official Elasticsearch (ES) image and importing sample data：

    #Pull the official Elasticsearch (ES) image with the version requirement of 8.9.0.
    docker pull elasticsearch:8.9.0
    #Start the Elasticsearch (ES) image.
    docker run -d --name elasticsearch -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" elasticsearch:8.9.0
    #Enter into the container.
    docker exec -it elasticsearch /bin/bash
    #Execute the data generation script.
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
    #Execute the command to import data into Elasticsearch (ES).
    curl -H "Content-Type: application/json" -XPOST "localhost:9200/_bulk" --data-binary @/usr/share/elasticsearch/data/data.json
    #Note: When executing the curl command to import data, it may be necessary to set xpack.security.enabled to false. If xpack.security is set to true, commands requiring authentication may need to be executed. For detailed instructions on data import operations, please refer to the official Elasticsearch (ES) documentation.


    #Remark: The initial password for ES will be printed in the startup logs. If you forget to record it, you can execute the following command to reset the password.
    docker exec -it elasticsearch /usr/share/elasticsearch/bin/elasticsearch-setup-passwords auto -b
    #Log in and verify that the ES service has started normally.
    http://127.0.0.1:9200/
## 2.Pull the prepared compilation container
    docker pull registry.cn-chengdu.aliyuncs.com/nextgraph/webbuild:202405.2
## 3.Starter container
    docker run --name=build -p 80:80 -itd registry.cn-chengdu.aliyuncs.com/nextgraph/webbuild:202405.2
## 4.Get the OSGraph code
    docker exec -it build bash
    cd /home/admin/app
    git clone https://github.com/TuGraph-family/OSGraph.git
## 5.Development code

## 6.Compiled code
    cd OSGraph/
    bash bin/build-osgraph.sh
    exit
## 7.Configuration parameter

### 7.1 Pull  database image
    docker pull mariadb:latest
### 7.2 Start database mirroring
    docker run --name=mysql -p 3306:3306  -e MARIADB_USER=mysql -e MARIADB_PASSWORD='tuMaker0520@' -e MARIADB_ROOT_PASSWORD='tuMaker0520@' -itd mariadb:latest

    #get the IP address of a MySQL container
    docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' mysql 
### 7.3 Configure dependent environment variables

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

### 7.4 Environment variables take effect
    Ensure that the tumaker-env file has comments removed and there are no trailing spaces.
    source bin/tumaker-env
## 8.Start service verification
    cd OSGraph/
    bash bin/startup-osgraph.sh
## 9.Browser verification
    http://127.0.0.1

