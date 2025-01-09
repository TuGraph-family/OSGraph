## 介绍
**OSGraph (Open Source Graph)** 默认提供了6张开源数据图谱供大家体验，包含项目类图谱3个（贡献、生态、社区）、开发类3个（活动、伙伴、兴趣）。如果这6张图谱不能满足您的需求，您也可以根据此文档，定制属于您自己的图谱。

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

> `Poetry`是一个 Python 的包管理工具, 确保你的系统中已经安装了 Python 和 pip,然后，在命令行中输入以下命令来安装 Poetry。

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
    docker run -d -p 7687:7687 -p 7070:7070 -p 9200:9200 --name tugraph tugraph/tugraph-db-osgraph:4.4.0  lgraph_server -d start
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

+ 启动服务

    ```powershell
    poetry run python run.py
    ```

### 访问页面
+ 通过浏览器打开页面：[http://localhost:8000/](http://localhost:8000/)



## 项目结构
![画板](https://intranetproxy.alipay.com/skylark/lark/0/2024/jpeg/345921/1734589934374-34b01288-1861-4741-890d-11b37d1b294e.jpeg)



## 开发详解
### 数据库中的图结构
+ 模型视图

![](https://intranetproxy.alipay.com/skylark/lark/0/2025/png/345921/1736413397357-b96f1eff-569f-4b5d-ae28-aa2136984937.png)

+ 模型类

```python
import os
from dataclasses import dataclass
from typing import Any, Optional

from dotenv import load_dotenv

load_dotenv()

graph_name = os.getenv("TUGRAPHDB_OSGRAPH_GITHUB_GRAPH_NAME")


class Vertex:
    label: str
    primary: str
    type: str = "vertex"
    _props: Optional[Any] = None

    def __init__(self, label: str, primary: str):
        self.label = label
        self.primary = primary

    @property
    def props(self) -> Any:
        return self._props

    def __repr__(self):
        return (
            f"{self.__class__.__name__}(label={self.label}, primary={self.primary}, "
            f"type={self.type}, props={self.props})"
        )


class Edge:
    label: str
    type: str = "edge"
    source: Any
    target: Any
    _props: Optional[Any] = None

    def __init__(self, label: str, source: Any, target: Any):
        self.label = label
        self.source = source
        self.target = target

    @property
    def props(self) -> Any:
        return self._props

    def __repr__(self):
        return (
            f"{self.__class__.__name__}(label={self.label}, primary={self.primary}, "
            f"type={self.type}, source={self.source}, "
            f"target={self.target}, props={self.props})"
        )


@dataclass
class GitHubUserProps:
    id: Optional[int] = None
    name: Optional[str] = None
    company: Optional[str] = None
    country: Optional[str] = None


class GitHubUser(Vertex):
    def __init__(self, props: GitHubUserProps):
        if not isinstance(props, GitHubUserProps):
            raise ValueError("props must be an instance of GitHubUserProps.")
        super().__init__(label="github_user", primary="id")
        self._props = props

    def __repr__(self):
        return (
            f"{self.__class__.__name__}("
            f"label={self.label}, "
            f"primary={self.primary}, "
            f"props={self._props})"
        )


@dataclass
class IssueProps:
    id: Optional[int] = None
    state: Optional[str] = None
    created_at: Optional[int] = None
    closed_at: Optional[int] = None


class Issue(Vertex):
    def __init__(self, props: Optional[IssueProps] = None):
        if props is None:
            props = IssueProps()
        if not isinstance(props, IssueProps):
            raise ValueError("props must be an instance of IssueProps.")
        super().__init__(label="issue", primary="id")
        self._props = props


@dataclass
class PullRequestProps:
    id: Optional[int] = None
    merged: Optional[bool] = None
    created_at: Optional[int] = None
    closed_at: Optional[int] = None
    deletions: Optional[int] = None
    changed_files: Optional[int] = None
    additions: Optional[int] = None


class PullRequest(Vertex):
    def __init__(self, props: Optional[PullRequestProps] = None):
        if props is None:
            props = PullRequestProps()
        if not isinstance(props, PullRequestProps):
            raise ValueError("props must be an instance of PullRequestProps.")
        super().__init__(label="pr", primary="id")
        self._props = props


@dataclass
class LanguageProps:
    name: Optional[str] = None


class Language(Vertex):
    def __init__(self, props: Optional[LanguageProps] = None):
        if props is None:
            props = LanguageProps()
        if not isinstance(props, LanguageProps):
            raise ValueError("props must be an instance of LanguageProps.")
        super().__init__(label="language", primary="name")
        self._props = props


@dataclass
class GitHubRepoProps:
    id: Optional[int] = None
    name: Optional[str] = None
    star: Optional[int] = None
    opened_pr: Optional[int] = None
    opened_issue: Optional[int] = None
    merged_pr: Optional[int] = None
    fork: Optional[int] = None
    commits: Optional[int] = None
    comments: Optional[int] = None
    code_deletions: Optional[int] = None
    code_changed_files: Optional[int] = None
    code_additions: Optional[int] = None
    closed_issue: Optional[int] = None


class GitHubRepo(Vertex):
    def __init__(self, props: Optional[GitHubRepoProps] = None):
        if props is None:
            props = GitHubRepoProps()
        if not isinstance(props, GitHubRepoProps):
            raise ValueError("props must be an instance of GitHubRepoProps.")
        super().__init__(label="github_repo", primary="id")
        self._props = props


@dataclass
class LicenseProps:
    name: Optional[str] = None


class License(Vertex):
    def __init__(self, props: Optional[LicenseProps] = None):
        if props is None:
            props = LicenseProps()
        if not isinstance(props, LicenseProps):
            raise ValueError("props must be an instance of LicenseProps.")
        super().__init__(label="license", primary="name")
        self._props = props


@dataclass
class TopicProps:
    name: Optional[str] = None


class Topic(Vertex):
    def __init__(self, props: Optional[TopicProps] = None):
        if props is None:
            props = TopicProps()
        if not isinstance(props, TopicProps):
            raise ValueError("props must be an instance of TopicProps.")
        super().__init__(label="topic", primary="name")
        self._props = props


@dataclass
class GitHubOrganizationProps:
    id: Optional[int] = None
    name: Optional[str] = None


class GitHubOrganization(Vertex):
    def __init__(self, props: Optional[GitHubOrganizationProps] = None):
        if props is None:
            props = GitHubOrganizationProps()
        if not isinstance(props, GitHubOrganizationProps):
            raise ValueError("props must be an instance of GitHubOrganizationProps.")
        super().__init__(label="github_organization", primary="id")
        self._props = props


@dataclass
class PushProps:
    commits: Optional[int] = None
    created_at: Optional[int] = None


class Push(Edge):
    def __init__(self, source, target, props: Optional[PushProps] = None):
        if props is None:
            props = PushProps()
        if not isinstance(props, PushProps):
            raise ValueError("props must be an instance of PushProps.")
        super().__init__(label="push", source=source, target=target)
        self._props = props


@dataclass
class ForkProps:
    created_at: Optional[int] = None


class Fork(Edge):
    def __init__(self, source, target, props: Optional[ForkProps] = None):
        if props is None:
            props = ForkProps()
        if not isinstance(props, ForkProps):
            raise ValueError("props must be an instance of ForkProps.")
        super().__init__(label="fork", source=source, target=target)
        self._props = props


@dataclass
class StarProps:
    created_at: Optional[int] = None


class Star(Edge):
    def __init__(self, source, target, props: Optional[StarProps] = None):
        if props is None:
            props = StarProps()
        if not isinstance(props, StarProps):
            raise ValueError("props must be an instance of StarProps.")
        super().__init__(label="star", source=source, target=target)
        self._props = props


@dataclass
class ReviewPrProps:
    created_at: Optional[int] = None


class ReviewPr(Edge):
    def __init__(self, source, target, props: Optional[ReviewPrProps] = None):
        if props is None:
            props = ReviewPrProps()
        if not isinstance(props, ReviewPrProps):
            raise ValueError("props must be an instance of ReviewPrProps.")
        super().__init__(label="review_pr", source=source, target=target)
        self._props = props


@dataclass
class CommentPrProps:
    created_at: Optional[int] = None


class CommentPr(Edge):
    def __init__(self, source, target, props: Optional[CommentPrProps] = None):
        if props is None:
            props = CommentPrProps()
        if not isinstance(props, CommentPrProps):
            raise ValueError("props must be an instance of CommentPrProps.")
        super().__init__(label="comment_pr", source=source, target=target)
        self._props = props


@dataclass
class ClosePrProps:
    created_at: Optional[int] = None


class ClosePr(Edge):
    def __init__(self, source, target, props: Optional[ClosePrProps] = None):
        if props is None:
            props = ClosePrProps()
        if not isinstance(props, ClosePrProps):
            raise ValueError("props must be an instance of ClosePrProps.")
        super().__init__(label="close_pr", source=source, target=target)
        self._props = props


@dataclass
class OpenPrProps:
    created_at: Optional[int] = None


class OpenPr(Edge):
    def __init__(self, source, target, props: Optional[OpenPrProps] = None):
        if props is None:
            props = OpenPrProps()
        if not isinstance(props, OpenPrProps):
            raise ValueError("props must be an instance of OpenPrProps.")
        super().__init__(label="open_pr", source=source, target=target)
        self._props = props


@dataclass
class CommentIssueProps:
    created_at: Optional[int] = None


class CommentIssue(Edge):
    def __init__(self, source, target, props: Optional[CommentIssueProps] = None):
        if props is None:
            props = CommentIssueProps()
        if not isinstance(props, CommentIssueProps):
            raise ValueError("props must be an instance of CommentIssueProps.")
        super().__init__(label="comment_issue", source=source, target=target)
        self._props = props


@dataclass
class CloseIssueProps:
    created_at: Optional[int] = None


class CloseIssue(Edge):
    def __init__(self, source, target, props: Optional[CloseIssueProps] = None):
        if props is None:
            props = CloseIssueProps()
        if not isinstance(props, CloseIssueProps):
            raise ValueError("props must be an instance of CloseIssueProps.")
        super().__init__(label="close_issue", source=source, target=target)
        self._props = props


@dataclass
class OpenIssueProps:
    created_at: Optional[int] = None


class OpenIssue(Edge):
    def __init__(self, source, target, props: Optional[OpenIssueProps] = None):
        if props is None:
            props = OpenIssueProps()
        if not isinstance(props, OpenIssueProps):
            raise ValueError("props must be an instance of OpenIssueProps.")
        super().__init__(label="open_issue", source=source, target=target)
        self._props = props


@dataclass
class HasPrProps:
    created_at: Optional[int] = None


class HasPr(Edge):
    def __init__(self, source, target, props: Optional[HasPrProps] = None):
        if props is None:
            props = HasPrProps()
        if not isinstance(props, HasPrProps):
            raise ValueError("props must be an instance of HasPrProps.")
        super().__init__(label="has_pr", source=source, target=target)
        self._props = props


@dataclass
class HasIssueProps:
    created_at: Optional[int] = None


class HasIssue(Edge):
    def __init__(self, source, target, props: Optional[HasIssueProps] = None):
        if props is None:
            props = HasIssueProps()
        if not isinstance(props, HasIssueProps):
            raise ValueError("props must be an instance of HasIssueProps.")
        super().__init__(label="has_issue", source=source, target=target)
        self._props = props


class UseLang(Edge):
    def __init__(self, source, target):
        super().__init__(label="use_lang", source=source, target=target)
        self._props = None


class HasTopic(Edge):
    def __init__(self, source, target):
        super().__init__(label="has_topic", source=source, target=target)
        self._props = None


class UseLicense(Edge):
    def __init__(self, source, target):
        super().__init__(label="use_license", source=source, target=target)
        self._props = None

```



### 开发graph service
+ 在services/graph_services 目录中创建属于自己
+ 示例：project_community.py
    - 创建ProjectCommunityServiceConfig类：用来定义这个服务的名称，描述，输入参数，过滤条件
        * name：string，切要确保不能与其他服务的名称相同
        * comment：string
        * inputTypes：List[string] 
        * filterKeys: List[FilterKey] 如果没有过滤调教可以为空数组
    - 将配置ProjectCommunityServiceConfig注入到service/__init__.py

```python
# app/services/__init__.py

from flask import current_app
from app.services.graph_services.project_community import ProjectCommunityServiceConfig

SERVICE_CONFIGS = [
    ProjectContributionServiceConfig(),
    ProjectEcologyServiceConfig(),
    ProjectCommunityServiceConfig(),
    DevelopActivitiesServiceConfig(),
    OSPartnerServiceConfig(),
    OSInterestServiceConfig(),
]

def register_all_services():
    """
    遍历所有的服务配置，并在应用启动时自动注册。
    """
    with current_app.app_context():
        for config in SERVICE_CONFIGS:
            config.register_service()

```

- 创建ProjectCommunityService类
- 编辑execute函数，根据自己需求编写服务数据请求逻辑。
- 数据请求可通过两种方式：
- OGM查询：
    - 示例：查询10个中国开发者

```python
from app.models.default_graph import GitHubUser, GitHubUserProps

from app.dal.graph.tugraph import GraphClient

graphClient = GraphClient(
    host=TUGRAPHDB_HOST,
    port=TUGRAPHDB_PORT,
    user=TUGRAPHDB_USER,
    password=TUGRAPHDB_PASSWORD,
    graph_name=TUGRAPHDB_OSGRAPH_GITHUB_GRAPH_NAME
)
user = GitHubUser(props:GitHubUserProps(country='china'))
graphClient.get_vertex(user,limit=10)
```

* Cypher查询
    * 示例：查询10个中国开发者

```python
from app.dal.graph.tugraph import GraphClient
graphClient = GraphClient(
    host=TUGRAPHDB_HOST,
    port=TUGRAPHDB_PORT,
    user=TUGRAPHDB_USER,
    password=TUGRAPHDB_PASSWORD,
    graph_name=TUGRAPHDB_OSGRAPH_GITHUB_GRAPH_NAME
)
cypher = 'MATCH (n:github_user) WHRER n.country = "china" RETURN n LIMIT 10'
graphClient.run(cypher)
```

```python
import os
from datetime import datetime, timedelta
from typing import Any, Dict
from dotenv import load_dotenv
from app.dal.search.es import ElasticsearchClient
from app.services.graph_services.base import BaseService, FilterKey, ServiceConfig

load_dotenv()

class ProjectCommunityServiceConfig(ServiceConfig):
    def __init__(self):
        super().__init__(
            name="项目社区",
            comment="这是一个项目社区图谱",
            inputTypes=["GitHubRepo"],
            filterKeys=[
                FilterKey(key="company-topn", type="int", default=50, required=False),
                FilterKey(key="country-topn", type="int", default=50, required=False),
                FilterKey(key="developer-topn", type="int", default=50, required=False),
            ],
        )


class ProjectCommunityService(BaseService):
    def __init__(self):
        super().__init__(ProjectCommunityServiceConfig())

    def execute(self, data: Dict[str, Any]) -> Any:
        validated_data = self.validate_params(data)
        github_repo: str = validated_data["GitHubRepo"]
        company_topn: int = validated_data["company-topn"]
        country_topn: int = validated_data["country-topn"]
        developer_topn: int = validated_data["developer-topn"]
        es = ElasticsearchClient()
        query = {"match": {"name": github_repo}}
        res = es.search(index="github_repo", query=query, size=1)
        if len(res):
            repo_id = res[0]["id"]
            
            cypher = (
                f"CALL osgraph.get_repo_developers_profile('{{"
                f'"repo_id":{repo_id},"company_topn":{company_topn},'
                f'"country_topn":{country_topn},"developer_topn":{developer_topn}'
                f"}}') YIELD start_node, relationship, end_node "
                "return start_node, relationship, end_node"
            )
            result = self.graphClient.run(cypher)
            return result

```

### 开发 graph manager
+ 引入要在视图上显示的对象，系统对通用视图对象进行了封装，如果内置的对象不能满足你的需求，你也可以自定义。

> ps：视图模型定义文件 models/graph_view.py

```python
from app.models.graph_view import (
    Belong,
    Country,
    Star,
    User
)
```

+ 将数服务层请求回来的数据，进行处理。

```python
# app/manager/project_community.py
import json
import os
from typing import Any, Dict, Union

from app.models.graph_view import (
    Belong,
    Country,
    Graph,
    PullRequestAction,
    Repo,
    Star,
    User,
)
from app.services.graph_services.project_community import ProjectCommunityService


class ProjectCommunityManager:
    def __init__(self) -> None:
        pass
    def get_graph(self, data: Dict[str, Any]) -> Union[Dict, None]:
        service = ProjectCommunityService()
        graph = Graph()
        result = service.execute(data=data)
        if result:
            for data in result:
                start_node = json.loads(data["start_node"])
                relationship = json.loads(data["relationship"])
                end_node = json.loads(data["end_node"])
                if start_node["type"] == "github_user":
                    user = User(
                        id=start_node["id"], name=start_node["properties"]["name"]
                    )
                    graph.insert_entity(user)
                if relationship["type"] == "PR":
                    pr = PullRequestAction(
                        sid=relationship["src"],
                        tid=relationship["dst"],
                        id=relationship["id"],
                        count=relationship["properties"]["count"],
                    )
                    graph.insert_relationship(pr)
            
            return graph.to_dict()
        return None
```

### 开发路由接口
+ 接口结构如下：
    - 协议://IP:PORT/api/graphs/<图服务名称>/<平台>/<组织名称/仓库名称 或 用户名称>
+ 定义 controller类型，调用manager
+ 定义 route 及对应的 url

```python
import logging
from typing import Any, Dict

from flask import Blueprint, request

from app.managers.project_community import ProjectCommunityManager
from app.utils.custom_exceptions import InvalidUsage
from app.utils.response_handler import ResponseHandler

project_community_bp = Blueprint("project_community", __name__, url_prefix="/api/graphs")
logger = logging.getLogger(__name__)


class ProjectCommunityController:
    def __init__(self):
        self.manager = ProjectCommunityManager()

    def get_community_graph(self, data: Dict[str, Any]) -> Dict[str, Any]:
        try:
            graph = self.manager.get_graph(data)
            return ResponseHandler.success(graph)
        except InvalidUsage as e:
            logger.error(f"Invalid usage: {str(e)}")
            return ResponseHandler.error(str(e.message), e.status_code)
        except Exception:
            logger.exception("Internal server error")
            return ResponseHandler.error("Internal server error", 500)
controller = ProjectCommunityController()
@project_community_bp.route("/project-community/<platform>/<path:remaining_path>", methods=["GET"])
def get_project_community():
    data = request.args.to_dict()
    response = controller.get_community_graph(data)
    return ResponseHandler.jsonify_response(response)

```

### 验证
默认使用GET 请求，可以通过浏览器对自定的服务进行验证。

+ 验证自定义服务是否成功注入
    - 在浏览器地址栏输入：http://localhost:8000/api/graph/list
    - 响应结果：

```json
{
  "data": [
    {
      "comment": "这是一个项目社区图谱",
      "filter_keys": "",
      "input_types": "GitHubRepo",
      "name": "项目社区"
    },
    
    # ....
  ],
  "error": null,
  "message": "Success",
  "status": 0
}
```

出现以上的响应结果，并且列表中有自定义的服务，证明注入成功。

+ 验证自定义的服务请求：在浏览器地址输入您定义服务请求URL及参数，查看是否返回预期的数据结果。

## 贡献
如果您愿意将您开发服务在开源社区分享，就可以向我们的代码仓库提交PR，审核通过后，我们会将您的服务上线到我们官网服务，让更多的开源用户可以在线使用。



