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


class OSPartnerServiceConfig(ServiceConfig):
    def __init__(self):
        super().__init__(
            name="开源伙伴",
            comment="这是一个获取开源伙伴的图谱",
            inputTypes=["GitHubUser"],
            filterKeys=[
                FilterKey(key="topn", type="int", default=50, required=False),
            ],
        )


class OSPartnerService(BaseService):
    def __init__(self):
        super().__init__(OSPartnerServiceConfig())

    def execute(self, data: Dict[str, Any]) -> Any:
        validated_data = self.validate_params(data)
        github_user: str = validated_data["GitHubUser"]
        topn: int = validated_data["topn"]
        es = ElasticsearchClient()
        query = {"term": {"name.keyword": github_user}}
        res = es.search(index="github_user", query=query)
        if len(res):
            user_id = res[0]["id"]
            graph_name = os.getenv("TUGRAPHDB_OSGRAPH_GITHUB_GRAPH_NAME")
            client = GraphClient(graph_name)
            cypher = f"""CALL osgraph.get_developer_by_developer('{{"developer_id":{user_id},"top_n":{topn}}}') YIELD start_node, relationship, end_node return start_node, relationship, end_node"""
            result = client.run(cypher)
            return result
