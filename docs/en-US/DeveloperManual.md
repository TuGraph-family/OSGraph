## OSGraph Deployment Process

### 1. Pull the Docker Images

Pull the required images from Docker Hub

```bash
# This image includes the components: MySQL, Elasticsearch, and TuGraph-DB
docker pull tugraph/tugraph-db-osgraph:4.4.0

# System build image
docker pull registry.cn-chengdu.aliyuncs.com/nextgraph/webbuild:202405.2
```

### 2. Start the Containers

Start two containers: one for OSGraph's dependencies and one for building and running OSGraph.

```bash
# Start the container for OSGraph dependencies
docker run -d --privileged --net host --name tugraph tugraph/tugraph-db-osgraph:4.4.0

# Start the container for building and running OSGraph
docker run --name build -p 80:80 -itd registry.cn-chengdu.aliyuncs.com/nextgraph/webbuild:202405.2
```

### 3. Compile and Start OSGraph inside the 'build' Container

#### 3.1 Pull the OSGraph Code and Compile it inside the 'build' Container

Enter the `build` container:

```bash
docker exec -it build bash
```

Inside the container, execute the following commands to pull the code and compile it:

```bash
cd /home/admin/app
git clone https://github.com/TuGraph-family/OSGraph.git
cd OSGraph/
bash bin/build-osgraph.sh
```

#### 3.2 Modify Configurations and Start OSGraph inside the 'build' Container

Edit the configuration file and replace the respective values:

```bash
vi bin/osgraph-env
```

Fill in the following content in the file:

```bash
# Modify TUMAKER_DB_HOST, ES_HOST, and TUGRAPHDB_HOST to the server's IP address
# Change TUGRAPHDB_USER to 'admin' and TUGRAPHDB_PASSWORD to '73@TuGraph'
# Other configuration items do not need to be modified
export LANG=zh_CN.UTF-8
export TUMAKER_DB_HOST=127.0.0.1
export TUMAKER_DB_PORT=3306
export TUMAKER_DB_USER=root
export TUMAKER_DB_PASSWORD=tuMaker0520@
export ES_HOST=127.0.0.1
export ES_PORT=9200
export ES_USERNAME=elastic
export ES_PASSWORD=es
export TUGRAPHDB_HOST=127.0.0.1
export TUGRAPHDB_PORT=7687
export TUGRAPHDB_USER=admin
export TUGRAPHDB_PASSWORD=73@TuGraph
export TUGRAPHDB_NAME=default
```

Save and exit the text editor, then load the environment variables:

```bash
source bin/osgraph-env
```

Ensure you are in the correct directory and start the system:

```bash
# Make sure you are in the /home/admin/app/OSGraph directory
bash bin/startup-osgraph.sh
```

### 4. Access via Browser

Open your browser and navigate to `http://<server-ip>`.

For example, if the server IP is `192.168.1.100`, you can access it in your browser by navigating to:

```bash
http://192.168.1.100
```

### Note: Embedded ES Test Data

You can use the following embedded test data for testing purposes, for example, you can search by name:

```json
{"index":{"_index":"github_repo","_id":"528766495"}}
{"id":528766495,"name":"TuGraph-family/tugraph-db","star":1026}
{"index":{"_index":"github_repo","_id":"81810486"}}
{"id":81810486,"name":"antvis/G6","star":10748}
{"index":{"_index":"github_user","_id":"827205"}}
{"id":827205,"name":"DanielRuf"}
{"index":{"_index":"github_user","_id":"2311313"}}
{"id":2311313,"name":"fanzhidongyzby"}
{"index":{"_index":"github_user","_id":"1132769"}}
{"id":1132769,"name":"hjk41"}
```
