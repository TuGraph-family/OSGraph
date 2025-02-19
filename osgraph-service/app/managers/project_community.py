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
# app/manager/project_community.py
import json
import os
from typing import Any, Dict, Union
from app.utils.get_lang import get_language
from app.models.graph_view import (
    Belong,
    Country,
    Company,
    Graph,
    PullRequestAction,
    Repo,
    Star,
    User,
)
from app.services.graph_services.project_community import ProjectCommunityService


class ProjectCommunityManager:
    def __init__(self) -> None:
        pass

    def get_graph(self, data: Dict[str, Any]) -> Union[Dict, None]:
        service = ProjectCommunityService()
        lang = get_language()
        graph = Graph(lang=lang)
        result = service.execute(data=data)
        if result:
            for data in result:
                start_node = json.loads(data["start_node"])
                relationship = json.loads(data["relationship"])
                end_node = json.loads(data["end_node"])
                if start_node["type"] == "github_user":
                    user = User(
                        id=start_node["id"], name=start_node["properties"]["name"]
                    )
                    graph.insert_entity(user)
                if start_node["type"] == "github_repo":
                    repo = Repo(
                        id=start_node["id"], name=start_node["properties"]["name"]
                    )
                    graph.insert_entity(repo)
                if start_node["type"] == "country":
                    # replace country id by name
                    # country = Country(
                    #     id=start_node["id"], name=start_node["properties"]["name"]
                    # )
                    country = Country(
                        id=start_node["properties"]["name"], name=start_node["properties"]["name"]
                    )
                    graph.insert_entity(country)
                if start_node["type"] == "company":
                    # replace company id by name
                    # company = Company(
                    #     id=start_node["id"], name=start_node["properties"]["name"]
                    # )
                    company = Company(
                        id=start_node["properties"]["name"], name=start_node["properties"]["name"]
                    )
                    graph.insert_entity(company)

                if end_node["type"] == "github_user":
                    user = User(id=end_node["id"], name=end_node["properties"]["name"])
                    graph.insert_entity(user)
                if end_node["type"] == "github_repo":
                    repo = Repo(id=end_node["id"], name=end_node["properties"]["name"])
                    graph.insert_entity(repo)
                if end_node["type"] == "country":
                    # replace country id by name
                    # country = Country(
                    #     id=end_node["id"], name=end_node["properties"]["name"]
                    # )
                    country = Country(
                        id=end_node["properties"]["name"], name=end_node["properties"]["name"]
                    )
                    graph.insert_entity(country)
                if end_node["type"] == "company":
                    # replace company id by name
                    # company = Company(
                    #     id=end_node["id"], name=end_node["properties"]["name"]
                    # )
                    company = Company(
                        id=end_node["properties"]["name"], name=end_node["properties"]["name"]
                    )
                    graph.insert_entity(company)

                source = start_node["properties"]["name"] if start_node["type"] == "country" or start_node["type"] == "company" else relationship["src"]
                target = end_node["properties"]["name"] if end_node["type"] == "country" or end_node["type"] == "company" else relationship["dst"]

                if relationship["type"] == "PR":
                    pr = PullRequestAction(
                        source=source,
                        target=target,
                        id=relationship["id"],
                        count=relationship["properties"]["count"],
                    )
                    graph.insert_relationship(pr)
                if relationship["type"] == "Star":
                    star = Star(
                        source=source,
                        target=target,
                        id=relationship["id"],
                        count=relationship["properties"]["count"],
                    )
                    graph.insert_relationship(star)
                if relationship["type"] == "belong_to":
                    belong = Belong(
                        source=source,
                        target=target,
                        id=relationship["id"],
                    )
                    graph.insert_relationship(belong)
            if os.getenv("SUMMARY_GRAPH") == "on":
                from app.services.graph_summary import GraphSummaryService

                summary_service = GraphSummaryService()
                summary = summary_service.execute(data=graph.to_dict())
                if summary:
                    graph.update_summary(summary=summary)
            return graph.to_dict()
        return None
