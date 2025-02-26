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

class ProjectEcosystemServiceConfig(ServiceConfig):
    def __init__(self):
        super().__init__(
            name_zh="项目生态",
            comment_zh="洞察项目生态伙伴：提取项目间的开发活动、组织等关联信息，构建项目核心生态关系。",
            name_en="Project Ecosystem",
            comment_en="Insight into project ecosystem partners: Extract inter-project development activities, organizations, and other related information to construct the core ecosystem relationships of the project.",
            inputTypes=["github_repo"],
            path="project-ecosystem",
            filterKeys=[
                FilterKey(key="repo-limit", type="int", default=10, required=False),
            ],
        )


class ProjectEcosystemService(BaseService):
    def __init__(self):
        super().__init__(ProjectEcosystemServiceConfig())

    def execute(self, data: Dict[str, Any]) -> Any:
        validated_data = self.validate_params(data)
        input:str = self.inputTypes[0]
        path: str = validated_data["path"]
        platform: str = validated_data["platform"]
        repo_limit: int = validated_data["repo-limit"]
        es = ElasticsearchClient()
        query = {"match_phrase": {"name": path}}
        res = es.search(index=f"{input}", query=query, size=1)
        if len(res):
            repo_id = res[0]["id"]
            cypher = (
                f"CALL osgraph.get_repo_by_repo('{{"
                f'"repo_id":{repo_id}, "top_n":{repo_limit}'
                f"}}') YIELD start_node, relationship, end_node "
                "return start_node, relationship, end_node"
            )
            result = self.graphClient.run(cypher)
            return result
