## OSGraph部署流程

### 1. 拉取镜像

dockerhub上拉取所需的2个镜像

```bash
# 此镜像含 mysql、elasticsearch、tugraph-DB 组件
docker pull tugraph/tugraph-db-osgraph:4.4.0
# 系统编译镜像
docker pull registry.cn-chengdu.aliyuncs.com/nextgraph/webbuild:202405.2
```

### 2. 启动容器

```bash
# 启动osgraph依赖组件容器
docker run -d --privileged --net host --name tugraph tugraph/tugraph-db-osgraph:4.4.0
# 启动osgraph编译、运行容器
docker run --name=build -p 80:80 -itd registry.cn-chengdu.aliyuncs.com/nextgraph/webbuild:202405.2
```

### 3. 在build容器内编译、启动OSGraph

#### 3.1 在build容器内拉取osgraph代码，编译

```bash
docker exec -it build bash
cd /home/admin/app
git clone https://github.com/TuGraph-family/OSGraph.git
cd OSGraph/
bash bin/build-osgraph.sh
```

#### 3.2 在build容器内修改配置、启动

```bash
vi bin/osgraph-env
# 修改 TUMAKER_DB_HOST、ES_HOST、TUGRAPHDB_HOST 为服务器本机的IP
# TUGRAPHDB_USER修改为admin TUGRAPHDB_PASSWORD修改为73@TuGraph
# 剩余其他配置项不用修改

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

# 修改保存 /bin/osgraph-env后，执行
source bin/osgraph-env

# 启动系统（注意要在/home/admin/app/OSGraph 此目录下执行下面启动脚本）
bash bin/startup-osgraph.sh

```

### 4.浏览器访问

在浏览器中访问`http://服务器IP`



### 备注：内置ES测试数据

* 可通过name进行搜索

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
