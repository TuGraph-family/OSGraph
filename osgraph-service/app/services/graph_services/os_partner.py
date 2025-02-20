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


def get_default_start_time() -> int:
    return int((datetime.now() - timedelta(days=30)).timestamp() * 1000)


def get_default_end_time() -> int:
    return int(datetime.now().timestamp() * 1000)


class OSPartnerServiceConfig(ServiceConfig):
    def __init__(self):
        super().__init__(
            name_zh="开源伙伴",
            comment_zh="寻找个人开源伙伴：找到开发者在开源社区中，与之协作紧密的其他开发者。",
            name_en="Open-source Partner",
            comment_en="Finding open-source partners: Find other developers in the open-source community who collaborate closely with you.",
            inputTypes=["user"],
            filterKeys=[
                FilterKey(key="user-limit", type="int", default=10, required=False),
            ],
        )


class OSPartnerService(BaseService):
    def __init__(self):
        super().__init__(OSPartnerServiceConfig())

    def execute(self, data: Dict[str, Any]) -> Any:
        validated_data = self.validate_params(data)
        input:str = self.inputTypes[0]
        path: str = validated_data["path"]
        platform: str = validated_data["platform"]
        user_limit: int = validated_data["user-limit"]
        es = ElasticsearchClient()
        query = {"match_phrase": {"name": path}}
        res = es.search(index=f"{platform}_{input}", query=query, size=1)
        if len(res):
            user_id = res[0]["id"]
            cypher = (
                f"CALL osgraph.get_developer_by_developer('{{"
                f'"developer_id":{user_id},"top_n":{user_limit}'
                f"}}') YIELD start_node, relationship, end_node "
                "return start_node, relationship, end_node"
            )
            result = self.graphClient.run(cypher)
            return result
