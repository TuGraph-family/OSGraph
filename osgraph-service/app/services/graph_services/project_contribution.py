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


def get_default_start_time() -> str:
    start_time = datetime.now() - timedelta(days=30)
    return start_time.strftime('%Y-%m-%d')

def get_default_end_time() -> str:
    end_time = datetime.now()
    return end_time.strftime('%Y-%m-%d')

def string_to_timestamp(date_str: str) -> int:
    try:
        date_obj = datetime.strptime(date_str, '%Y-%m-%d')
        return int(date_obj.timestamp())
    except ValueError:
        return int(date_str)

class ProjectContributionServiceConfig(ServiceConfig):
    def __init__(self):
        super().__init__(
            name="项目贡献",
            comment="这是一个获取项目贡献的图谱",
            inputTypes=["repo"],
            filterKeys=[
                FilterKey(
                    key="start-time",
                    type="str",
                    default=get_default_start_time(),
                    required=False,
                ),
                FilterKey(
                    key="end-time",
                    type="str",
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
        start_time_str: str = validated_data["start-time"] or get_default_start_time()
        start_time: int = string_to_timestamp(start_time_str)
        end_time_str: str = validated_data["end-time"] or get_default_end_time()
        end_time: int = string_to_timestamp(end_time_str)
        repo_limit: int = validated_data["repo-limit"]
        es = ElasticsearchClient()
        query = {"match_phrase": {"name": path}}
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