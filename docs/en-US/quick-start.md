# Quick Start

## 1. Set Up Development Environment
* Install Python: [Python >= 3.10](https://www.python.org/downloads)
* Install NodeJS: [NodeJS >= 20.12.2](https://nodejs.org/en/download)

## 2. Set Up TuGraph Database

* Install Docker: [Docker Desktop](https://www.docker.com/products/docker-desktop)
* Pull the TuGraph image (OSGraph customized version) and start it.
```bash
docker pull tugraph/tugraph-db-osgraph:4.4.0
docker run -d -p 7687:7687 -p 7070:7070 -p 9200:9200 --name tugraph tugraph/tugraph-db-osgraph:4.4.0
```

## 3. Start OSGraph

Clone the repository: 
```bash
git clone https://github.com/TuGraph-family/OSGraph.git
```

Build the code: 
```bash
cd OSGraph
bash ./bin/build.sh
```

Start the service: 
```bash
cd OSGraph
bash ./bin/start.sh
```

Access the page: 
Open the page in your browser: [http://localhost:8000/](http://localhost:8000/)

## 4. Customize OSGraph

Customize open source graphs you interest according to the [Developer Manual](./developer-manual.md)
