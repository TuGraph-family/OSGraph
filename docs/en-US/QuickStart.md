## Introduction
**OSGraph (Open Source Graph)** is an open-source graph relationship insight tool that leverages the GitHub open-source data graph to provide analysis and insights into developer behavior and project community ecosystems. It offers a simple and intuitive view of open-source data for developers, project owners, open-source evangelists, and community managers, helping you and your projects create unique open-source profiles, find suitable development partners, and uncover deep community value.

## Online Usage
If you want to quickly use the OSGraph product, you can visit the website: https://osgraph.com/ for a quick experience. The product provides six open-source data graphs by default for users to explore, including three project-related graphs (Contributions, Ecosystem, Community) and three developer-related graphs (Activity, Partners, Interests).

## Local Deployment
### Environment Preparation
+ Install Docker:
    - Mac：[https://docs.docker.com/desktop/setup/install/mac-install/](https://docs.docker.com/desktop/setup/install/mac-install/)
    - Windows：[https://docs.docker.com/desktop/setup/install/windows-install/](https://docs.docker.com/desktop/setup/install/windows-install/)
    - Linux：[https://docs.docker.com/desktop/setup/install/linux/](https://docs.docker.com/desktop/setup/install/linux/)
+ Install Python，version 3.12+:
    - Mac：[https://www.python.org/downloads/macos/](https://www.python.org/downloads/macos/)
    - Windows：[https://www.python.org/downloads/windows/](https://www.python.org/downloads/windows/)
    - Linux：[https://www.python.org/downloads/source/](https://www.python.org/downloads/source/)

+ Install Peotry

    ```json
    pip install poetry
    ```

+ Install Docker image

    - Pull image

    ```json
    docker pull tugraph/tugraph-db-osgraph:4.4.0
    ```

    - Start

    ```json
    docker run -d -p 7687:7687 -p 7070:7070 -p 9200:9200 --name tugraph tugraph/tugraph-db-osgraph:4.4.0
    ```

### Start Service 
+ Pull

    ```powershell
    git clone https://github.com/TuGraph-family/OSGraph.git
    ```

+ Install

    ```powershell
    cd OSGraph
    cd OSGraph/osgraph-service-py
    poetry install
    ```

+ Env

    ```powershell
    cp .env.template .env
    ```

+ Build Web

    ```powershell
    cd osgraph-web
    npm install 
    npm run build
    cp -rf ./dist/*  ../osgraph-service/web
    ```

+ Start

    ```powershell
    poetry run python run.py
    ```


### Accessing the Page
+ Open the page in a web browser: [http://localhost:8000/](http://localhost:8000/)

