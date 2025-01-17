import os
from datetime import datetime, timedelta
from typing import Any, Dict

from dotenv import load_dotenv

from app.dal.search.es import ElasticsearchClient
from app.services.graph_services.base import BaseService, FilterKey, ServiceConfig

load_dotenv()


def get_default_start_time() -> int:
    return int((datetime.now() - timedelta(days=30)).timestamp())


def get_default_end_time() -> int:
    return int(datetime.now().timestamp())


class ProjectContributionServiceConfig(ServiceConfig):
    def __init__(self):
        super().__init__(
            name="项目贡献",
            comment="这是一个获取项目贡献的图谱",
            inputTypes=["repo"],
            filterKeys=[
                FilterKey(
                    key="start-time",
                    type="int",
                    default=get_default_start_time(),
                    required=False,
                ),
                FilterKey(
                    key="end-time",
                    type="int",
                    default=get_default_end_time(),
                    required=False,
                ),
                FilterKey(
                    key="repo-limit", type="int", default=10, required=False
                ),
            ],
        )


class ProjectContributionService(BaseService):
    def __init__(self):
        super().__init__(ProjectContributionServiceConfig())

    def execute(self, data: Dict[str, Any]) -> Any:
        validated_data = self.validate_params(data)
        input:str = self.inputTypes[0]
        path: str = validated_data["path"]
        platform: str = validated_data["platform"]
        start_time: int = validated_data["start-time"] or get_default_start_time()
        end_time: int = validated_data["end-time"] or get_default_end_time()
        repo_limit: int = validated_data["repo-limit"]
        es = ElasticsearchClient()
        query = {"match": {"name": path}}
        res = es.search(index=f"{platform}_{input}", query=query, size=1)
        if len(res):
            repo_id = res[0]["id"]
            cypher = (
                f"CALL osgraph.get_repo_contribution('{{"
                f'"repo_id":{repo_id},"start_timestamp":{start_time},'
                f'"end_timestamp":{end_time},"top_n":{repo_limit}'
                f"}}') YIELD start_node, relationship, end_node "
                "return start_node, relationship, end_node"
            )
            print(cypher)
            result = self.graphClient.run(cypher)
            return result