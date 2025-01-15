import os
from datetime import datetime, timedelta
from typing import Any, Dict

from dotenv import load_dotenv

from app.dal.search.es import ElasticsearchClient
from app.services.graph_services.base import BaseService, FilterKey, ServiceConfig

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
        query = {"match": {"name": github_user}}
        res = es.search(index="github_user", query=query, size=1)
        if len(res):
            user_id = res[0]["id"]
            cypher = (
                f"CALL osgraph.get_developer_by_developer('{{"
                f'"developer_id":{user_id},"top_n":{topn}'
                f"}}') YIELD start_node, relationship, end_node "
                "return start_node, relationship, end_node"
            )
            result = self.graphClient.run(cypher)
            return result
