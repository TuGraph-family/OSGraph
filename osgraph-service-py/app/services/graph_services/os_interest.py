import json
import os
from datetime import datetime, timedelta
from typing import Any, Dict

from dotenv import load_dotenv

from app.dal.graph.tugraph import GraphClient
from app.dal.search.es import ElasticsearchClient
from app.services.graph_services.base import BaseService, FilterKey, ServiceConfig

load_dotenv()


def get_default_start_time() -> int:
    return int((datetime.now() - timedelta(days=30)).timestamp() * 1000)


def get_default_end_time() -> int:
    return int(datetime.now().timestamp() * 1000)


class OSInterestServiceConfig(ServiceConfig):
    def __init__(self):
        super().__init__(
            name="开源兴趣",
            comment="这是一张开源兴趣图谱",
            inputTypes=["GitHubUser"],
            filterKeys=[
                FilterKey(key="topic-topn", type="int", default=50, required=False),
                FilterKey(
                    key="githubrepo-topn", type="int", default=50, required=False
                ),
            ],
        )


class OSInterestService(BaseService):
    def __init__(self):
        super().__init__(OSInterestServiceConfig())

    def execute(self, data: Dict[str, Any]) -> Any:
        validated_data = self.validate_params(data)
        user_name: str = validated_data["GitHubUser"]
        topic_topn: int = validated_data["topic-topn"]
        repo_topn: int = validated_data["githubrepo-topn"]
        es = ElasticsearchClient()
        query = {"term": {"name.keyword": user_name}}
        res = es.search(index="github_user", query=query)
        if len(res):
            user_id = res[0]["id"]
            params_dict = {
                "developer_id": user_id,
                "topic_topn": topic_topn,
                "repo_topn": repo_topn,
            }
            params = json.dumps(params_dict)
            cypher = (
                f"CALL osgraph.get_developer_repos_profile('{params}') "
                "YIELD start_node, relationship, end_node "
                "return start_node, relationship, end_node"
            )
            result = self.graphClient.run(cypher)
            return result
