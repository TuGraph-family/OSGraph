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

class DeveloperActivityServiceConfig(ServiceConfig):
    def __init__(self):
        super().__init__(
            name_zh="开发活动",
            comment_zh="展示个人开源贡献：根据开发者研发活动信息（Issue、PR、Commit、CR等），找到参与的核心项目。",
            name_en="Developer Activity",
            comment_en="Showcasing individual open-source contributions: Find core projects participated in based on developer development activities (Issues, PRs, Commits, CRs, etc.).",
            inputTypes=["github_user"],
            path="developer-activity",
            filterKeys=[
                FilterKey(key="user-limit", type="int", default=10, required=False),
            ],
        )


class DeveloperActivityService(BaseService):
    def __init__(self):
        super().__init__(DeveloperActivityServiceConfig())

    def execute(self, data: Dict[str, Any]) -> Any:
        validated_data = self.validate_params(data)
        input:str = self.inputTypes[0]
        path: str = validated_data["path"]
        # platform: str = validated_data["platform"]
        user_limit: int = validated_data["user-limit"]
        es = ElasticsearchClient()
        query = {"match_phrase": {"name": path}}
        res = es.search(index=f"{input}", query=query, size=1)
        if len(res):
            develop_id = res[0]["id"]
            cypher = (
                f"CALL osgraph.get_developer_contribution('{{"
                f'"developer_id":{develop_id},"top_n":{user_limit}'
                f"}}') YIELD start_node, relationship, end_node "
                "return start_node, relationship, end_node"
            )
            result = self.graphClient.run(cypher)
            return result
