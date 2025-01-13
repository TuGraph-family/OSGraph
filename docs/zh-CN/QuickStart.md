## 快速开始

### 1. 准备Python环境(>= 3.10)

安装官方提供的Python包:
* Mac：[https://www.python.org/downloads/macos/](https://www.python.org/downloads/macos/)
* Windows：[https://www.python.org/downloads/windows/](https://www.python.org/downloads/windows/)
* Linux：[https://www.python.org/downloads/source/](https://www.python.org/downloads/source/)

或者使用[conda](https://docs.anaconda.com/miniconda/)等工具初始化Python环境：
```bash
conda create -n osgraph 'python=3.10'
conda activate osgraph
```

### 2. 准备Node环境(>= 20.12.2)
安装官方提供的Nodejs
* Download：[https://nodejs.org/en/download](https://nodejs.org/en/download)

### 2. 准备TuGraph数据库

安装Docker软件：
* Mac：[https://docs.docker.com/desktop/setup/install/mac-install/](https://docs.docker.com/desktop/setup/install/mac-install/)
* Windows：[https://docs.docker.com/desktop/setup/install/windows-install/](https://docs.docker.com/desktop/setup/install/windows-install/)
* Linux：[https://docs.docker.com/desktop/setup/install/linux/](https://docs.docker.com/desktop/setup/install/linux/)

拉取OSGraph专有TuGraph镜像，并启动：
```bash
docker pull tugraph/tugraph-db-osgraph:4.4.0
docker run -d -p 7687:7687 -p 7070:7070 -p 9200:9200 --name tugraph tugraph/tugraph-db-osgraph:4.4.0
```

### 3. 本地启动OSGraph

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

