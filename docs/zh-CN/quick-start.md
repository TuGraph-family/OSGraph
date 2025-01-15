# 快速开始

## 1. 准备开发环境
* 安装Python：[Python >= 3.10](https://www.python.org/downloads)
* 安装NodeJS：[NodeJS >= 20.12.2](https://nodejs.org/en/download)

## 2. 准备TuGraph数据库

* 安装Docker：[Docker Desktop](https://www.docker.com/products/docker-desktop)
* 拉取TuGraph镜像（OSGraph定制版），并启动。
```bash
docker pull tugraph/tugraph-db-osgraph:4.4.0
docker run -d -p 7687:7687 -p 7070:7070 -p 9200:9200 --name tugraph tugraph/tugraph-db-osgraph:4.4.0
```

## 3. 启动OSGraph

拉取代码：
```bash
git clone https://github.com/TuGraph-family/OSGraph.git
```

构建代码：
```bash
cd OSGraph
bash ./bin/build.sh
```

启动服务：
```bash
cd OSGraph
bash ./bin/start.sh
```

页面访问：
通过浏览器打开页面：[http://localhost:8000/](http://localhost:8000/)

## 4. 定制OSGraph

请参考[开发手册](./developer-manual.md)定制自己感兴趣的开源图谱。