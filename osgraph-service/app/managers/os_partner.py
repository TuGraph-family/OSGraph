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
# app/manager/os_partner.py
import json
import os
from typing import Any, Dict, Union
from app.utils.get_lang import get_language
from app.models.graph_view import (
    CommonIssue,
    CommonPR,
    CommonRepo,
    CommonStar,
    Graph,
    User,
)
from app.services.graph_services.os_partner import OSPartnerService


class OSPartnerManager:
    def __init__(self) -> None:
        pass

    def get_graph(self, data: Dict[str, Any]) -> Union[Dict, None]:
        service = OSPartnerService()
        lang = get_language()
        graph = Graph(lang=lang)
        result = service.execute(data=data)
        if result:
            for data in result:
                start_node = json.loads(data["start_node"])
                relationship = json.loads(data["relationship"])
                end_node = json.loads(data["end_node"])
                if start_node["type"] == "github_user":
                    src_user = User(
                        id=start_node["id"], name=start_node["properties"]["name"]
                    )
                    graph.insert_entity(src_user)

                if end_node["type"] == "github_user":
                    tar_user = User(
                        id=end_node["id"], name=end_node["properties"]["name"]
                    )
                    graph.insert_entity(tar_user)

                if relationship["type"] == "common_issue":
                    common_issue = CommonIssue(
                        source=relationship["src"],
                        target=relationship["dst"],
                        id=relationship["id"],
                        count=relationship["properties"]["count"],
                    )
                    graph.insert_relationship(common_issue)

                if relationship["type"] == "common_pr":
                    common_pr = CommonPR(
                        source=relationship["src"],
                        target=relationship["dst"],
                        id=relationship["id"],
                        count=relationship["properties"]["count"],
                    )
                    graph.insert_relationship(common_pr)

                if relationship["type"] == "common_star":
                    common_star = CommonStar(
                        source=relationship["src"],
                        target=relationship["dst"],
                        id=relationship["id"],
                        count=relationship["properties"]["count"],
                    )
                    graph.insert_relationship(common_star)

                if relationship["type"] == "common_repo":
                    common_repo = CommonRepo(
                        source=relationship["src"],
                        target=relationship["dst"],
                        id=relationship["id"],
                        count=relationship["properties"]["count"],
                    )
                    graph.insert_relationship(common_repo)

            if os.getenv("SUMMARY_GRAPH") == "on":
                from app.services.graph_summary import GraphSummaryService

                summary_service = GraphSummaryService()
                summary = summary_service.execute(data=graph.to_dict())
                if summary:
                    graph.update_summary(summary=summary)
            return graph.to_dict()
        return None
