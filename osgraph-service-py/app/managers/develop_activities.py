# app/manager/develop_activities.py
import json
import os
from typing import Any, Dict

from app.models.graph_view import Graph, Push, Repo, User
from app.services.graph_services.develop_activities import DevelopActivitiesService


class DevelopActivitiesManager:
    def __init__(self) -> None:
        pass

    def get_graph(self, data: Dict[str, Any]) -> Dict | None:
        service = DevelopActivitiesService()
        graph = Graph()
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

                if end_node["type"] == "github_user":
                    user = User(id=end_node["id"], name=end_node["properties"]["name"])
                    graph.insert_entity(user)
                if end_node["type"] == "github_repo":
                    repo = Repo(id=end_node["id"], name=end_node["properties"]["name"])
                    graph.insert_entity(repo)

                if relationship["type"] == "push":
                    push = Push(
                        sid=relationship["src"],
                        tid=relationship["dst"],
                        id=relationship["id"],
                        count=relationship["properties"]["count"],
                    )
                    graph.insert_relationship(push)

                if relationship["type"] == "open_pr":
                    open_pr = Push(
                        sid=relationship["src"],
                        tid=relationship["dst"],
                        id=relationship["id"],
                        count=relationship["properties"]["count"],
                    )
                    graph.insert_relationship(open_pr)

                if relationship["type"] == "code_review":
                    code_review = Push(
                        sid=relationship["src"],
                        tid=relationship["dst"],
                        id=relationship["id"],
                        count=relationship["properties"]["count"],
                    )
                    graph.insert_relationship(code_review)

                if relationship["type"] == "open_issue":
                    open_issue = Push(
                        sid=relationship["src"],
                        tid=relationship["dst"],
                        id=relationship["id"],
                        count=relationship["properties"]["count"],
                    )
                    graph.insert_relationship(open_issue)

                if relationship["type"] == "comment_issue":
                    comment_issue = Push(
                        sid=relationship["src"],
                        tid=relationship["dst"],
                        id=relationship["id"],
                        count=relationship["properties"]["count"],
                    )
                    graph.insert_relationship(comment_issue)

            if os.getenv("SUMMARY_GRAPH") == "on":
                from app.services.graph_summary import GraphSummaryService

                summary_service = GraphSummaryService()
                summary = summary_service.execute(data=graph.to_dict())
                if summary:
                    graph.update_summary(summary=summary)
            return graph.to_dict()
