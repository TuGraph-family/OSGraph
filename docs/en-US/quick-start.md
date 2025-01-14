## Quick Start

### 1. Prepare Python Environment (>= 3.10)

Install the official Python package:
* Mac：[https://www.python.org/downloads/macos/](https://www.python.org/downloads/macos/)
* Windows：[https://www.python.org/downloads/windows/](https://www.python.org/downloads/windows/)
* Linux：[https://www.python.org/downloads/source/](https://www.python.org/downloads/source/)

Or use tools like conda to initialize the Python environment:
```bash
conda create -n osgraph 'python=3.10'
conda activate osgraph
```

### 2. Prepare Node Environment (>= 20.12.2)
Install the official Node.js package:
* Download: [https://nodejs.org/en/download](https://nodejs.org/en/download)

### 3. Prepare TuGraph Database

Install Docker software:
* Mac：[https://docs.docker.com/desktop/setup/install/mac-install/](https://docs.docker.com/desktop/setup/install/mac-install/)
* Windows：[https://docs.docker.com/desktop/setup/install/windows-install/](https://docs.docker.com/desktop/setup/install/windows-install/)
* Linux：[https://docs.docker.com/desktop/setup/install/linux/](https://docs.docker.com/desktop/setup/install/linux/)

Pull the OSGraph-specific TuGraph image and start it:
```bash
docker pull tugraph/tugraph-db-osgraph:4.4.0
docker run -d -p 7687:7687 -p 7070:7070 -p 9200:9200 --name tugraph tugraph/tugraph-db-osgraph:4.4.0
```

### 4. Start OSGraph

Clone the code:
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

Access the web page:
Open the page in your browser: [http://localhost:8000/](http://localhost:8000/)
