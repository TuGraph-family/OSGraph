#
# Copyright 2025 AntGroup CO., Ltd.
# 
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
# 
# http://www.apache.org/licenses/LICENSE-2.0
# 
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#
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
            name_zh="项目社区",
            comment_zh="分析项目社区分布：根据项目的开发活动、开发者组织等信息，提取项目核心开发者社区分布。",
            name_en="Project Community",
            comment_en="Analyze the distribution of the project community: Extract core developers' community distribution based on project development activities and developer organizations.",
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
        input:str = self.inputTypes[0]
        path: str = validated_data["path"]
        platform: str = validated_data["platform"]
        company_limit: int = validated_data["company-limit"]
        country_limit: int = validated_data["country-limit"]
        developer_limit: int = validated_data["user-limit"]
        es = ElasticsearchClient()
        query = {"match_phrase": {"name": path}}
        res = es.search(index=f"{platform}_{input}", query=query, size=1)
        if len(res):
            repo_id = res[0]["id"]
            
            cypher = (
                f"CALL osgraph.get_repo_developers_profile('{{"
                f'"repo_id":{repo_id},"company_topn":{company_limit},'
                f'"country_topn":{country_limit},"developer_topn":{developer_limit}'
                f"}}') YIELD start_node, relationship, end_node "
                "return start_node, relationship, end_node"
            )
            print(cypher)
            result = self.graphClient.run(cypher)
            return result