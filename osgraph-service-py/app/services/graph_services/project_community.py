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
            inputTypes=["repo"],
            filterKeys=[
                FilterKey(key="company-limit", type="int", default=3, required=False),
                FilterKey(key="country-limit", type="int", default=3, required=False),
                FilterKey(key="user-limit", type="int", default=10, required=False),
            ],
        )


class ProjectCommunityService(BaseService):
    def __init__(self):
        super().__init__(ProjectCommunityServiceConfig())

    def execute(self, data: Dict[str, Any]) -> Any:
        validated_data = self.validate_params(data)
        github_repo: str = validated_data["GitHubRepo"]
        company_topn: int = validated_data["company_topn"]
        country_topn: int = validated_data["country_topn"]
        developer_topn: int = validated_data["developer_topn"]
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
            print(cypher)
            result = self.graphClient.run(cypher)
            return result