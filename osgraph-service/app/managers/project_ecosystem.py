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
# app/manager/project_ecology.py
import json
import os
from typing import Any, Dict, Union
from app.utils.get_lang import get_language
from app.models.graph_view import Belong, CommonDevelop, Graph, Orgnization, Repo
from app.services.graph_services.project_ecosystem import ProjectEcosystemService


class ProjectEcosystemManager:
    def __init__(self) -> None:
        pass

    def get_graph(self, data: Dict[str, Any]) -> Union[Dict, None]:
        service = ProjectEcosystemService()
        lang = get_language()
        graph = Graph(lang=lang)
        result = service.execute(data=data)
        if result:
            for data in result:
                start_node = json.loads(data["start_node"])
                relationship = json.loads(data["relationship"])
                end_node = json.loads(data["end_node"])
                if start_node["type"] == "github_repo":
                    user = Repo(
                        id=start_node["id"], name=start_node["properties"]["name"]
                    )
                    graph.insert_entity(user)
                if start_node["type"] == "github_organization":
                    organization = Orgnization(
                        id=start_node["id"], name=start_node["properties"]["name"]
                    )
                    graph.insert_entity(organization)
                if end_node["type"] == "github_repo":
                    user = Repo(id=end_node["id"], name=end_node["properties"]["name"])
                    graph.insert_entity(user)
                if end_node["type"] == "github_organization":
                    organization = Orgnization(
                        id=end_node["id"], name=end_node["properties"]["name"]
                    )
                    graph.insert_entity(organization)

                if relationship["type"] == "belong_to":
                    belong_to = Belong(
                        source=relationship["src"],
                        target=relationship["dst"],
                        id=relationship["id"],
                    )
                    graph.insert_relationship(belong_to)

                if relationship["type"] == "common_developer":
                    common_developer = CommonDevelop(
                        source=relationship["src"],
                        target=relationship["dst"],
                        id=relationship["id"],
                        count=relationship["properties"]["count"],
                    )
                    graph.insert_relationship(common_developer)
            if os.getenv("SUMMARY_GRAPH") == "on":
                from app.services.graph_summary import GraphSummaryService

                summary_service = GraphSummaryService()
                summary = summary_service.execute(data=graph.to_dict())
                if summary:
                    graph.update_summary(summary=summary)
            return graph.to_dict()
        return None
