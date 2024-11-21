# app/manager/os_interest.py
import json
import os
from typing import Any, Dict, Union

from app.models.graph_view import Belong, ContributeRepo, Graph, Repo, Topic, User
from app.services.graph_services.os_interest import OSInterestService


class OSInterestManager:
    def __init__(self) -> None:
        pass

    def get_graph(self, data: Dict[str, Any]) -> Union[Dict, None]:
        service = OSInterestService()
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
                if start_node["type"] == "topic":
                    topic = Topic(
                        id=start_node["id"], name=start_node["properties"]["name"]
                    )
                    graph.insert_entity(topic)

                if end_node["type"] == "github_user":
                    user = User(id=end_node["id"], name=end_node["properties"]["name"])
                    graph.insert_entity(user)
                if end_node["type"] == "github_repo":
                    repo = Repo(id=end_node["id"], name=end_node["properties"]["name"])
                    graph.insert_entity(repo)
                if end_node["type"] == "topic":
                    topic = Topic(
                        id=end_node["id"], name=end_node["properties"]["name"]
                    )
                    graph.insert_entity(topic)

                if relationship["type"] == "belong_to":
                    belong_to = Belong(
                        sid=relationship["src"],
                        tid=relationship["dst"],
                        id=relationship["id"],
                    )
                    graph.insert_relationship(belong_to)
                if relationship["type"] == "repo":
                    contribute_repo = ContributeRepo(
                        sid=relationship["src"],
                        tid=relationship["dst"],
                        id=relationship["id"],
                        count=relationship["properties"]["count"],
                    )
                    graph.insert_relationship(contribute_repo)
            if os.getenv("SUMMARY_GRAPH") == "on":
                from app.services.graph_summary import GraphSummaryService

                summary_service = GraphSummaryService()
                summary = summary_service.execute(data=graph.to_dict())
                if summary:
                    graph.update_summary(summary=summary)
            return graph.to_dict()
        return None
