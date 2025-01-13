## 介绍
**OSGraph (Open Source Graph)** 是一个开源图谱关系洞察工具，基于GitHub开源数据全域图谱，实现开发者行为、项目社区生态的分析洞察。可以为开发者、项目Owner、开源布道师、社区运营等提供简洁直观的开源数据视图，帮助你和你的项目制作专属的开源名片、寻求契合的开发伙伴、挖掘深度的社区价值。

## 在线使用
如果您想快速使用**OSGraph**产品，您可以访问网站：[https://osgraph.com/](https://osgraph.com/) 进行快速体验。产品默认提供了6张开源数据图谱供大家体验，包含项目类图谱3个（贡献、生态、社区）、开发类3个（活动、伙伴、兴趣）。	

## 本地部署
### 环境准备
+ 安装docker 软件：
    - Mac：[https://docs.docker.com/desktop/setup/install/mac-install/](https://docs.docker.com/desktop/setup/install/mac-install/)
    - Windows：[https://docs.docker.com/desktop/setup/install/windows-install/](https://docs.docker.com/desktop/setup/install/windows-install/)
    - Linux：[https://docs.docker.com/desktop/setup/install/linux/](https://docs.docker.com/desktop/setup/install/linux/)
+ 安装Python环境，版本3.12+：
    - Mac：[https://www.python.org/downloads/macos/](https://www.python.org/downloads/macos/)
    - Windows：[https://www.python.org/downloads/windows/](https://www.python.org/downloads/windows/)
    - Linux：[https://www.python.org/downloads/source/](https://www.python.org/downloads/source/)

+ 安装Peotry

    ```json
    pip install poetry
    ```

+ 安装docker 镜像

    - 拉取镜像

    ```json
    docker pull tugraph/tugraph-db-osgraph:4.4.0
    ```

    - 启动容器

    ```json
    docker run -d -p 7687:7687 -p 7070:7070 -p 9200:9200 --name tugraph tugraph/tugraph-db-osgraph:4.4.0
    ```

### 启动本地服务
+ 拉取代码

    ```powershell
    git clone https://github.com/TuGraph-family/OSGraph.git
    ```

+ 安装依赖

    ```powershell
    cd OSGraph
    cd OSGraph/osgraph-service-py
    poetry install
    ```

+ 配置变量

    ```powershell
    cp .env.template .env
    ```

+ 构建前端

    ```powershell
    cd osgraph-web
    npm install 
    npm run build
    cp -rf ./dist/*  ../osgraph-service/web
    ```

+ 启动服务

    ```powershell
    poetry run python run.py
    ```

### 访问页面
+ 通过浏览器打开页面：[http://localhost:8000/](http://localhost:8000/)

