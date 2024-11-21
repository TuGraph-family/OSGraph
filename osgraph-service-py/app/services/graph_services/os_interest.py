from datetime import datetime, timedelta
from typing import Dict, Any
from app.services.graph_services.base import BaseService, ServiceConfig, FilterKey
from app.dal.graph.tugraph import GraphClient
from app.dal.search.es import ElasticsearchClient
import os
from dotenv import load_dotenv

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
            graph_name = os.getenv("TUGRAPHDB_OSGRAPH_GITHUB_GRAPH_NAME")
            client = GraphClient(graph_name)
            cypher = f"""CALL osgraph.get_developer_repos_profile('{{"developer_id":{user_id},"topic_topn":{topic_topn},"repo_topn":{repo_topn}}}') YIELD start_node, relationship, end_node return start_node, relationship, end_node"""
            result = client.run(cypher)
            return result
